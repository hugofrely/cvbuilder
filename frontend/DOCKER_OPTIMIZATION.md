# Optimisations Docker pour la Production

Ce guide décrit comment optimiser le déploiement Docker du frontend pour des performances maximales.

## Dockerfile optimisé

Créez ou mettez à jour votre `Dockerfile` avec les optimisations suivantes :

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build with optimizations
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

## Docker Compose optimisé

Mettez à jour votre `docker-compose.yml` :

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

    # Optimisations de ressources
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

    # Health check
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

## Configuration Nginx (Reverse Proxy)

Pour de meilleures performances en production, utilisez Nginx comme reverse proxy :

```nginx
# nginx.conf
upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json
               image/svg+xml;

    # Brotli compression (si module disponible)
    # brotli on;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Cache des assets statiques
    location /_next/static {
        proxy_pass http://frontend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache des images
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)$ {
        proxy_pass http://frontend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Proxy vers Next.js
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Headers de sécurité
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

## Variables d'environnement de production

Créez un fichier `.env.production` :

```bash
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Analytics (optionnel - commentez pour réduire les requêtes)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_CONTENTSQUARE_ID=your-id
```

## Build et déploiement

```bash
# 1. Build l'image
docker-compose build --no-cache

# 2. Démarrer les services
docker-compose up -d

# 3. Vérifier les logs
docker-compose logs -f frontend

# 4. Vérifier la santé du container
docker-compose ps
```

## Optimisations supplémentaires

### 1. Multi-stage build avec cache

Ajoutez ceci à votre Dockerfile pour accélérer les builds :

```dockerfile
# Utilisez BuildKit pour le cache
# export DOCKER_BUILDKIT=1
```

### 2. .dockerignore

Créez un `.dockerignore` pour exclure les fichiers inutiles :

```
node_modules
.next
.git
.gitignore
README.md
*.md
.env*
!.env.production.example
.DS_Store
```

### 3. Compression des images

Avant le build, optimisez vos images :

```bash
# Installer imagemin
npm install -g imagemin-cli imagemin-webp

# Convertir en WebP
imagemin public/*.png --plugin=webp > public/
```

## Monitoring de performance

### Métriques Docker

```bash
# CPU et mémoire
docker stats frontend

# Logs avec timestamp
docker-compose logs -f --timestamps frontend
```

### Lighthouse en production

```bash
# Installer Lighthouse CI
npm install -g @lhci/cli

# Tester
lhci autorun --collect.url=https://yourdomain.com
```

## Résultats attendus

Avec ces optimisations :

- **Taille de l'image Docker** : ~150MB (vs ~1GB sans optimisations)
- **Temps de démarrage** : ~5s
- **Mémoire utilisée** : ~256MB
- **CPU idle** : <5%
- **Temps de réponse** : <100ms pour les pages statiques

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Analytics désactivées si non nécessaires
- [ ] Images optimisées (WebP/AVIF)
- [ ] Nginx configuré avec compression
- [ ] Health checks configurés
- [ ] Logs de monitoring en place
- [ ] SSL/TLS configuré
- [ ] CDN configuré pour les assets statiques
- [ ] Backup de la base de données planifié
