# 🐳 Guide de Déploiement Docker Swarm

Ce guide explique comment déployer CVBuilder sur Docker Swarm avec Google Cloud Storage.

## 📋 Prérequis

- Docker Swarm initialisé
- Traefik configuré sur le réseau `traefik_public`
- Accès à un registry Docker (registry.frely.fr)
- Compte Google Cloud avec bucket GCS configuré
- Projet Supabase configuré
- Compte Stripe configuré

## 🔧 Configuration des Credentials GCS

### Problème: Fichiers de Credentials

Docker Swarm ne permet pas de monter facilement des fichiers de credentials. La solution est de passer les credentials GCS en tant que **variable d'environnement JSON**.

### Solution: GCS_CREDENTIALS_JSON

Le backend a été modifié pour supporter deux méthodes:

1. **Développement local**: Utiliser `GCS_CREDENTIALS_PATH` (chemin vers le fichier JSON)
2. **Docker Swarm/Production**: Utiliser `GCS_CREDENTIALS_JSON` (JSON string sur une seule ligne)

### Étapes pour Convertir les Credentials

#### Méthode 1: Script Automatique (Recommandé)

```bash
# Utilisez le script fourni
./scripts/convert-gcs-credentials.sh /path/to/your/gcs-credentials.json
```

Cela affichera quelque chose comme:
```
GCS_CREDENTIALS_JSON={"type":"service_account","project_id":"cvbuilder-476609",...}
```

Copiez cette ligne dans votre fichier `.env.swarm`.

#### Méthode 2: Manuelle

```bash
# Installez jq si nécessaire
brew install jq  # macOS
# ou
sudo apt-get install jq  # Ubuntu/Debian

# Convertir le JSON en une seule ligne
cat /path/to/gcs-credentials.json | jq -c

# Copier le résultat dans .env.swarm comme:
# GCS_CREDENTIALS_JSON={"type":"service_account",...}
```

## 🚀 Déploiement

### 1. Créer le Fichier d'Environnement

```bash
# Copier le template
cp .env.swarm.example .env.swarm

# Éditer avec vos valeurs
nano .env.swarm
```

### 2. Remplir les Variables Obligatoires

Dans [.env.swarm](.env.swarm):

```bash
# Database
DB_PASSWORD=votre_mot_de_passe_postgres_securise

# Django
SECRET_KEY=votre_cle_secrete_django
DEBUG=False

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
SUPABASE_JWT_SECRET=votre-jwt-secret

# Google Cloud Storage
USE_GCS=True
GCS_BUCKET_NAME=cvbuilder-images
GCS_PROJECT_ID=cvbuilder-476609
GCS_CREDENTIALS_JSON={"type":"service_account",...}

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SINGLE_CV_PRICE_ID=price_...
STRIPE_LIFETIME_PREMIUM_PRICE_ID=price_...
```

### 3. Build et Push des Images

```bash
# Backend
docker build -t registry.frely.fr/cvbuilder-backend:latest ./backend
docker push registry.frely.fr/cvbuilder-backend:latest

# Frontend
docker build -t registry.frely.fr/cvbuilder-frontend:latest ./frontend
docker push registry.frely.fr/cvbuilder-frontend:latest
```

### 4. Déployer le Stack

```bash
# Charger les variables d'environnement
export $(cat .env.swarm | xargs)

# Déployer sur Swarm
docker stack deploy -c docker-compose.swarm.yml cvbuilder
```

### 5. Vérifier le Déploiement

```bash
# Voir les services
docker stack services cvbuilder

# Voir les logs du backend
docker service logs -f cvbuilder_backend

# Voir les logs du frontend
docker service logs -f cvbuilder_frontend

# Voir les logs de Celery
docker service logs -f cvbuilder_celery
```

## 🔍 Vérifications Post-Déploiement

### 1. Backend API

```bash
curl https://api.bidly.fr/api/health/
```

Devrait retourner 200 OK.

### 2. Frontend

```bash
curl https://bidly.fr
```

Devrait retourner la page HTML.

### 3. GCS Upload Test

Testez l'upload d'une image de CV depuis l'interface pour vérifier que GCS fonctionne.

### 4. Supabase Auth

Testez la connexion via:
- Email/Password
- Google OAuth
- LinkedIn OAuth

## 🐛 Dépannage

### Erreur: "Failed to parse GCS_CREDENTIALS_JSON"

**Cause**: Le JSON n'est pas correctement formaté ou échappé.

**Solution**:
1. Vérifiez que le JSON est valide: `echo "$GCS_CREDENTIALS_JSON" | jq`
2. Assurez-vous qu'il n'y a pas d'espaces avant/après le `=`
3. Pas de guillemets autour de la valeur dans `.env.swarm`

**Bon**:
```bash
GCS_CREDENTIALS_JSON={"type":"service_account",...}
```

**Mauvais**:
```bash
GCS_CREDENTIALS_JSON = {"type":"service_account",...}  # Espaces autour du =
GCS_CREDENTIALS_JSON="{"type":"service_account",...}"  # Guillemets externes
```

### Erreur: "Google Cloud Storage authentication failed"

**Vérifications**:
1. Le bucket GCS existe
2. Le service account a les permissions nécessaires (`Storage Object Admin`)
3. Le `GCS_PROJECT_ID` est correct
4. Le JSON credentials contient bien la `private_key`

### Erreur: "Invalid Supabase token"

**Vérifications**:
1. `SUPABASE_JWT_SECRET` est correct (Dashboard > Settings > API > JWT Secret)
2. `SUPABASE_URL` pointe vers le bon projet
3. Les tokens ne sont pas expirés

### Les Images Docker ne se Mettent pas à Jour

```bash
# Forcer le pull des nouvelles images
docker service update --force cvbuilder_backend
docker service update --force cvbuilder_frontend
```

## 📊 Architecture de Production

```
Internet
   │
   ▼
Traefik (HTTPS)
   │
   ├─▶ Frontend (bidly.fr) ─────┐
   │                             │
   └─▶ Backend (api.bidly.fr) ──┤
                                 │
                                 ▼
                         ┌───────────────┐
                         │  PostgreSQL   │
                         └───────────────┘
                                 │
                         ┌───────┴───────┐
                         │     Redis     │
                         └───────────────┘
                                 │
                         ┌───────┴───────┐
                         │  Celery Worker│
                         └───────────────┘
                                 │
                         ┌───────┴───────┐
                         │  Google Cloud │
                         │    Storage    │
                         └───────────────┘
                                 │
                         ┌───────┴───────┐
                         │   Supabase    │
                         └───────────────┘
```

## 🔄 Mise à Jour de l'Application

### Rolling Update (Zero Downtime)

```bash
# 1. Build et push les nouvelles images
docker build -t registry.frely.fr/cvbuilder-backend:latest ./backend
docker push registry.frely.fr/cvbuilder-backend:latest

docker build -t registry.frely.fr/cvbuilder-frontend:latest ./frontend
docker push registry.frely.fr/cvbuilder-frontend:latest

# 2. Mettre à jour le stack
export $(cat .env.swarm | xargs)
docker stack deploy -c docker-compose.swarm.yml cvbuilder

# Les services se mettront à jour automatiquement avec:
# - parallelism: 1 (un container à la fois)
# - order: start-first (démarrer le nouveau avant d'arrêter l'ancien)
```

## 📝 Notes Importantes

### Sécurité

1. **Ne jamais commit** `.env.swarm` dans Git
2. **Rotation** régulière des secrets (DB_PASSWORD, SECRET_KEY, etc.)
3. **Audit** des accès GCS service account
4. **Monitoring** des logs pour détecter les accès non autorisés

### Performance

1. **Scaling**: Ajustez `replicas` selon la charge
2. **Redis**: Pour scaling horizontal, considérez Redis Cluster
3. **PostgreSQL**: Envisagez des réplicas read-only pour la lecture
4. **GCS**: Activez le CDN si beaucoup de lectures d'images

### Backup

1. **PostgreSQL**: Backup régulier avec `pg_dump`
2. **GCS**: Versionning activé sur le bucket
3. **Secrets**: Backup sécurisé de `.env.swarm`

## 🆘 Support

**Problème de déploiement ?**
1. Vérifiez les logs: `docker service logs cvbuilder_backend`
2. Vérifiez la configuration: `docker service inspect cvbuilder_backend`
3. Consultez [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Dernière mise à jour:** 2025-11-02
