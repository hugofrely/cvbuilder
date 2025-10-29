# CI/CD Docker Build

Ce projet utilise GitHub Actions pour construire et pousser automatiquement les images Docker vers le registry privé `registry.frely.fr`.

## Déclenchement

Le workflow se déclenche automatiquement lors du **push d'un tag de version** suivant le pattern `v*.*.*` (semantic versioning).

Exemple :
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Images générées

Deux images Docker sont construites :

1. **Backend** : `registry.frely.fr/cvbuilder-backend`
2. **Frontend** : `registry.frely.fr/cvbuilder-frontend`

## Tags générés

Pour chaque tag poussé, plusieurs tags Docker sont créés :

- Version complète : `v1.0.0`
- Version majeure.mineure : `v1.0`
- Version majeure : `v1`
- Hash du commit : `main-abc1234`

Exemple avec le tag `v1.2.3` :
- `registry.frely.fr/cvbuilder-backend:v1.2.3`
- `registry.frely.fr/cvbuilder-backend:v1.2`
- `registry.frely.fr/cvbuilder-backend:v1`
- `registry.frely.fr/cvbuilder-backend:main-abc1234`

## Configuration requise

### Secrets GitHub à configurer

Vous devez ajouter les secrets suivants dans votre repository GitHub (Settings > Secrets and variables > Actions) :

- `REGISTRY_USERNAME` : Nom d'utilisateur pour le registry privé
- `REGISTRY_PASSWORD` : Mot de passe pour le registry privé

### Commandes pour ajouter les secrets

Via GitHub CLI :
```bash
gh secret set REGISTRY_USERNAME --body "votre_username"
gh secret set REGISTRY_PASSWORD --body "votre_password"
```

Via l'interface web :
1. Aller dans **Settings** > **Secrets and variables** > **Actions**
2. Cliquer sur **New repository secret**
3. Ajouter `REGISTRY_USERNAME` et `REGISTRY_PASSWORD`

## Workflow

Le workflow effectue les étapes suivantes pour chaque image :

1. Checkout du code source
2. Configuration de Docker Buildx
3. Connexion au registry privé
4. Extraction des métadonnées (tags, labels)
5. Build et push de l'image avec cache GitHub Actions

## Utilisation des images

Pour utiliser les images buildées :

```bash
# Connexion au registry
docker login registry.frely.fr

# Pull de l'image backend
docker pull registry.frely.fr/cvbuilder-backend:v1.0.0

# Pull de l'image frontend
docker pull registry.frely.fr/cvbuilder-frontend:v1.0.0
```

## Docker Compose avec les images du registry

```yaml
version: '3.8'

services:
  backend:
    image: registry.frely.fr/cvbuilder-backend:v1.0.0
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://...

  frontend:
    image: registry.frely.fr/cvbuilder-frontend:v1.0.0
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
```

## Processus de release

1. Faire les modifications nécessaires sur votre branche
2. Merger vers `main`
3. Créer et pousser un tag de version :
   ```bash
   git checkout main
   git pull
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. Le workflow GitHub Actions se déclenche automatiquement
5. Vérifier le statut dans l'onglet **Actions** du repository
6. Les images sont disponibles sur `registry.frely.fr`

## Surveillance

Pour voir l'état des builds :
- Aller dans l'onglet **Actions** de votre repository GitHub
- Cliquer sur le workflow "Build and Push Docker Images"
- Voir les logs détaillés de chaque étape

## Cache

Le workflow utilise le cache GitHub Actions pour accélérer les builds successifs :
- Cache des layers Docker
- Réutilisation des dépendances npm/pip non modifiées

## Troubleshooting

### Erreur de connexion au registry
- Vérifier que `REGISTRY_USERNAME` et `REGISTRY_PASSWORD` sont correctement configurés
- Vérifier que le registry `registry.frely.fr` est accessible

### Build échoue
- Vérifier les logs dans l'onglet Actions
- Vérifier que les Dockerfiles sont valides localement :
  ```bash
  docker build -t test-backend ./backend
  docker build -t test-frontend ./frontend
  ```

### Tag non reconnu
- Vérifier que le tag suit le pattern `v*.*.*`
- Exemples valides : `v1.0.0`, `v2.1.3`, `v0.0.1`
- Exemples invalides : `1.0.0`, `version-1.0`, `release-v1.0.0`
