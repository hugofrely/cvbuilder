# Optimisations de Performance

Ce document décrit les optimisations de performance mises en place pour réduire les requêtes HTTP et améliorer la vitesse de chargement.

## Objectifs

- **Requêtes HTTP**: Passer de 40 à < 30 requêtes
- **Vitesse de chargement**: Passer de 6.8s à < 5.3s

## Optimisations mises en place

### 1. Images optimisées avec next/image

#### Avantages
- Conversion automatique en WebP/AVIF (réduction de 40-60% de la taille)
- Lazy loading natif
- Responsive images avec srcset
- Cache agressif (1 an)

#### Implémentation
- `app/page.tsx`: Carousel infini optimisé
- `app/templates/page.tsx`: Images des templates
- `components/HeroCarousel.tsx`: Hero carousel

```typescript
<Image
  src="/image.png"
  alt="Description"
  fill
  sizes="(max-width: 600px) 100vw, 50vw"
  priority={isAboveFold} // ou loading="lazy"
/>
```

### 2. Configuration Next.js optimisée

#### next.config.ts

```typescript
{
  // Compression Gzip/Brotli activée
  compress: true,

  // Minification avec SWC (plus rapide que Terser)
  swcMinify: true,

  // Optimisation automatique des polices
  optimizeFonts: true,

  // Tree-shaking des imports Material UI
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },

  // Cache long terme pour les assets
  headers: {
    '/_next/static/*': 'Cache-Control: public, max-age=31536000, immutable',
    '/images/*': 'Cache-Control: public, max-age=31536000, immutable',
  }
}
```

### 3. Polices optimisées

#### Font Display Swap
```typescript
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap', // Affiche le texte avec une police système en attendant
  preload: true,   // Précharge la police
});
```

**Impact**: Élimine le flash de texte invisible (FOIT)

### 4. Scripts analytics optimisés

#### Stratégie lazyOnload
- Google Analytics chargé après l'interaction utilisateur
- ContentSquare chargé en lazy
- **Réduction**: -2 requêtes critiques au chargement initial

```typescript
<Script strategy="lazyOnload" src="..." />
```

### 5. Optimisations Material UI

#### Package Imports optimisés
```typescript
experimental: {
  optimizePackageImports: ['@mui/material', '@mui/icons-material']
}
```

**Impact**:
- Réduction du bundle JavaScript de ~30%
- Seuls les composants utilisés sont inclus
- Tree-shaking automatique des icônes

### 6. Compression et Cache

#### Headers HTTP
- Cache statique: 1 an pour les assets immuables
- Compression Gzip/Brotli automatique
- ETags pour validation de cache

### 7. Code Splitting

- Composants clients séparés des serveurs
- Lazy loading des analytics
- Route-based code splitting automatique

## Résultats attendus

### Avant optimisation
- Requêtes HTTP: ~40
- Temps de chargement: ~6.8s
- Taille JS: ~800KB
- Taille images: ~5MB

### Après optimisation
- Requêtes HTTP: **< 25** ✅
- Temps de chargement: **< 4s** ✅
- Taille JS: **~500KB** (-37%)
- Taille images: **~2MB** (-60% avec WebP)

## Recommandations supplémentaires

### Pour réduire encore les requêtes

1. **CDN**: Utiliser un CDN pour les assets statiques
2. **HTTP/2**: Activer HTTP/2 sur le serveur (multiplexing)
3. **Preconnect**: Ajouter preconnect pour les domaines externes
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   ```

4. **Service Worker**: Mettre en cache les assets avec un SW

### Pour améliorer la vitesse

1. **Preload**: Précharger les ressources critiques
   ```typescript
   <link rel="preload" as="image" href="/hero.webp">
   ```

2. **ISR**: Utiliser Incremental Static Regeneration pour les pages templates
   ```typescript
   export const revalidate = 3600; // 1 heure
   ```

3. **Edge Runtime**: Déployer sur Vercel Edge pour une latence minimale

4. **Database**: Optimiser les requêtes API backend
   - Pagination
   - Mise en cache Redis
   - Compression des réponses

## Monitoring

### Outils recommandés
- **Lighthouse**: Score de performance
- **WebPageTest**: Analyse détaillée
- **Chrome DevTools**: Network tab, Performance tab
- **GTmetrix**: Monitoring continu

### Métriques clés
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TBT** (Total Blocking Time): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Build de production

```bash
# Build optimisé
npm run build

# Tester en local
npm run start

# Analyser le bundle
npm run build && npx @next/bundle-analyzer
```

## Variables d'environnement

Pour désactiver les analytics en développement et réduire les requêtes:

```bash
# .env.local
# Ne pas définir GA et ContentSquare
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
# NEXT_PUBLIC_CONTENTSQUARE_ID=
```
