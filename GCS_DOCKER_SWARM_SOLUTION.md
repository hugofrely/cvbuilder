# 🔧 Solution: GCS Credentials dans Docker Swarm

## ❌ Problème

Docker Swarm ne permet pas de monter facilement un fichier JSON de credentials GCS. Vous ne pouvez pas faire:

```yaml
# ❌ NE FONCTIONNE PAS
volumes:
  - /path/to/credentials.json:/app/credentials.json
```

## ✅ Solution Implémentée

Le backend supporte maintenant **deux méthodes** pour les credentials GCS:

### 1. Développement Local (Fichier)

Utilisez `GCS_CREDENTIALS_PATH` avec le chemin vers votre fichier JSON:

```bash
# .env (local)
GCS_CREDENTIALS_PATH=/path/to/credentials.json
```

### 2. Docker Swarm/Production (Variable d'environnement)

Utilisez `GCS_CREDENTIALS_JSON` avec le contenu JSON en string:

```bash
# .env.swarm (production)
GCS_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}
```

## 🔄 Comment ça Marche ?

Le code dans [settings.py](backend/cvbuilder_backend/settings.py:205-227) vérifie les deux variables:

```python
# Si GCS_CREDENTIALS_JSON est défini (Docker Swarm)
if credentials_json:
    # Parse le JSON
    credentials_data = json.loads(credentials_json)
    # Crée un fichier temporaire
    temp_creds_file = tempfile.NamedTemporaryFile(mode='w', delete=False)
    json.dump(credentials_data, temp_creds_file)
    temp_creds_file.close()
    # Configure Google Cloud pour utiliser ce fichier
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_creds_file.name

# Sinon, si GCS_CREDENTIALS_PATH est défini (Local)
elif credentials_path:
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
```

## 📝 Utilisation

### Étape 1: Convertir vos Credentials

Utilisez le script fourni:

```bash
./scripts/convert-gcs-credentials.sh /path/to/credentials.json
```

Ou manuellement:

```bash
cat /path/to/credentials.json | jq -c
```

### Étape 2: Ajouter à .env.swarm

Copiez le résultat dans votre fichier `.env.swarm`:

```bash
GCS_CREDENTIALS_JSON={"type":"service_account","project_id":"cvbuilder-476609","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@...iam.gserviceaccount.com",...}
```

**Important**:
- **Pas d'espaces** autour du `=`
- **Pas de guillemets** externes autour de la valeur
- **Sur une seule ligne**

### Étape 3: Déployer

```bash
export $(cat .env.swarm | xargs)
docker stack deploy -c docker-compose.swarm.yml cvbuilder
```

## 📋 Fichiers Modifiés

### 1. [backend/cvbuilder_backend/settings.py](backend/cvbuilder_backend/settings.py)

**Avant** (ligne 206-208):
```python
credentials_path = os.getenv('GCS_CREDENTIALS')
if credentials_path:
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
```

**Après** (ligne 205-227):
```python
import json
import tempfile

credentials_path = os.getenv('GCS_CREDENTIALS_PATH')
credentials_json = os.getenv('GCS_CREDENTIALS_JSON')

if credentials_json:
    # Docker Swarm: JSON string
    try:
        credentials_data = json.loads(credentials_json)
        temp_creds_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        json.dump(credentials_data, temp_creds_file)
        temp_creds_file.close()
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_creds_file.name
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse GCS_CREDENTIALS_JSON: {e}")
elif credentials_path:
    # Local: file path
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
```

### 2. [docker-compose.swarm.yml](docker-compose.swarm.yml)

**Ajouté** aux services `backend` et `celery`:

```yaml
environment:
  # Google Cloud Storage
  USE_GCS: ${USE_GCS:-True}
  GCS_BUCKET_NAME: ${GCS_BUCKET_NAME}
  GCS_PROJECT_ID: ${GCS_PROJECT_ID}
  GCS_CREDENTIALS_JSON: ${GCS_CREDENTIALS_JSON}
  # Supabase
  SUPABASE_URL: ${SUPABASE_URL}
  SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
  SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
  SUPABASE_JWT_SECRET: ${SUPABASE_JWT_SECRET}
  # Stripe
  STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
  STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY}
  STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
  STRIPE_SINGLE_CV_PRICE_ID: ${STRIPE_SINGLE_CV_PRICE_ID}
  STRIPE_LIFETIME_PREMIUM_PRICE_ID: ${STRIPE_LIFETIME_PREMIUM_PRICE_ID}
```

### 3. Fichiers Créés

- [.env.swarm.example](.env.swarm.example) - Template de configuration
- [scripts/convert-gcs-credentials.sh](scripts/convert-gcs-credentials.sh) - Script de conversion
- [DOCKER_SWARM_DEPLOYMENT.md](DOCKER_SWARM_DEPLOYMENT.md) - Guide complet de déploiement
- [GCS_DOCKER_SWARM_SOLUTION.md](GCS_DOCKER_SWARM_SOLUTION.md) - Ce fichier

## ✅ Checklist de Déploiement

- [ ] Convertir les credentials GCS en JSON string
- [ ] Créer le fichier `.env.swarm` depuis `.env.swarm.example`
- [ ] Remplir toutes les variables (DB, Supabase, GCS, Stripe)
- [ ] Vérifier que `GCS_CREDENTIALS_JSON` est sur **une seule ligne**
- [ ] Build et push les images Docker
- [ ] Déployer avec `docker stack deploy`
- [ ] Vérifier les logs: `docker service logs cvbuilder_backend`
- [ ] Tester l'upload d'une image de CV

## 🐛 Dépannage

### Erreur: "Failed to parse GCS_CREDENTIALS_JSON"

```bash
# Vérifier que le JSON est valide
echo "$GCS_CREDENTIALS_JSON" | jq

# Si erreur, reconvertir:
./scripts/convert-gcs-credentials.sh /path/to/credentials.json
```

### Erreur: "GOOGLE_APPLICATION_CREDENTIALS not set"

```bash
# Vérifier que la variable est bien définie
docker service inspect cvbuilder_backend --format '{{json .Spec.TaskTemplate.ContainerSpec.Env}}' | jq
```

Cherchez `GCS_CREDENTIALS_JSON=` dans la sortie.

### L'upload d'images échoue

```bash
# Vérifier les logs
docker service logs -f cvbuilder_backend | grep -i gcs

# Vérifier les permissions GCS
# Le service account doit avoir le rôle "Storage Object Admin"
```

## 📚 Références

- **Guide complet**: [DOCKER_SWARM_DEPLOYMENT.md](DOCKER_SWARM_DEPLOYMENT.md)
- **Troubleshooting auth**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Setup Supabase**: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

---

**Résumé en 3 Points**:

1. 🔄 **Convertir** vos credentials JSON en string: `./scripts/convert-gcs-credentials.sh credentials.json`
2. 📝 **Ajouter** à `.env.swarm`: `GCS_CREDENTIALS_JSON={"type":"service_account",...}`
3. 🚀 **Déployer**: `docker stack deploy -c docker-compose.swarm.yml cvbuilder`

C'est tout! Les credentials seront automatiquement convertis en fichier temporaire par le backend au démarrage.

---

**Dernière mise à jour:** 2025-11-02
