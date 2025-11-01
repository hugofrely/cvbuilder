# Google Cloud Storage (GCS) Setup Guide

Ce guide explique comment configurer Google Cloud Storage pour stocker les images de profil des CVs.

## Configuration GCP (Google Cloud Platform)

### 1. Créer un projet GCP

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le **Project ID**

### 2. Créer un bucket GCS

```bash
# Installer gcloud CLI si pas déjà fait
# https://cloud.google.com/sdk/docs/install

# Se connecter
gcloud auth login

# Définir le projet
gcloud config set project YOUR_PROJECT_ID

# Créer un bucket (remplacez par votre nom unique)
gsutil mb -l europe-west1 gs://cvbuilder-images

# Configurer les permissions publiques pour la lecture
gsutil iam ch allUsers:objectViewer gs://cvbuilder-images
```

### 3. Créer un Service Account

1. Allez dans **IAM & Admin > Service Accounts**
2. Cliquez sur **Create Service Account**
3. Donnez-lui un nom : `cvbuilder-storage`
4. Rôle : **Storage Object Admin**
5. Créez une clé JSON :
   - Cliquez sur le service account créé
   - Onglet **Keys**
   - **Add Key > Create new key > JSON**
   - Téléchargez le fichier JSON

### 4. Configurer les variables d'environnement

Mettez à jour votre fichier `.env` :

```bash
# Google Cloud Storage
USE_GCS=True  # False pour développement local
GCS_BUCKET_NAME=cvbuilder-images
GCS_PROJECT_ID=your-project-id
GCS_CREDENTIALS=/path/to/service-account-key.json
```

**Important** :
- Ne committez JAMAIS le fichier JSON de credentials dans Git
- Ajoutez `*.json` dans `.gitignore`
- En production (Docker), montez le fichier comme volume ou utilisez des secrets

## Installation des dépendances

Les packages nécessaires ont été ajoutés à `requirements.txt` :

```bash
# Dans le conteneur Docker ou votre environnement virtuel
pip install django-storages google-cloud-storage
```

Ou avec Docker :

```bash
docker compose build backend
docker compose up -d backend
```

## Utilisation

### Upload d'image

Le champ `photo` du modèle `Resume` utilise automatiquement GCS quand `USE_GCS=True` :

```python
# Dans votre API
resume = Resume.objects.create(
    full_name="John Doe",
    photo=request.FILES.get('photo')  # Sera uploadé sur GCS
)

# L'URL sera automatiquement générée
print(resume.photo.url)
# https://storage.googleapis.com/cvbuilder-images/resumes/photos/filename.jpg
```

### API Endpoint exemple

```python
# Dans resumes/views.py
from rest_framework.parsers import MultiPartParser, FormParser

class ResumeViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        # Le fichier photo sera automatiquement uploadé sur GCS
        return super().update(request, *args, **kwargs)
```

## Frontend - Upload d'image

Exemple avec React/Next.js :

```typescript
const uploadPhoto = async (file: File, resumeId: string) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`/api/resumes/${resumeId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('Photo URL:', data.photo);
  // https://storage.googleapis.com/cvbuilder-images/resumes/photos/...
};
```

## Développement Local vs Production

### Développement (USE_GCS=False)

- Les fichiers sont stockés dans `backend/media/`
- Servis par Django via `/media/`
- Parfait pour tester sans frais

### Production (USE_GCS=True)

- Les fichiers sont uploadés sur GCS
- Servis directement depuis `https://storage.googleapis.com/`
- CDN intégré pour des performances optimales
- Pas de charge sur votre serveur Django

## Coûts GCS

- **Stockage** : ~0.020€/GB/mois (region europe-west1)
- **Requêtes** :
  - Upload : 0.05€ / 10,000 opérations
  - Download : 0.004€ / 10,000 opérations
- **Transfert** : ~0.12€/GB (vers internet)

**Estimation** : Pour 1000 CVs avec photos de 500KB :
- Stockage : 0.5GB × 0.020€ = 0.01€/mois
- Très économique ! 💰

## Sécurité

### Fichiers publics

Actuellement configuré avec `GS_DEFAULT_ACL = 'publicRead'` pour que les images soient accessibles publiquement (nécessaire pour l'affichage dans les CVs).

### Fichiers privés (optionnel)

Si vous voulez des fichiers privés avec URLs signées :

```python
# Dans settings.py
GS_DEFAULT_ACL = None
GS_QUERYSTRING_AUTH = True
GS_EXPIRATION = timedelta(hours=1)  # URL expire après 1h
```

## Troubleshooting

### Erreur "Could not automatically determine credentials"

Vérifiez que :
1. Le fichier JSON existe au chemin `GCS_CREDENTIALS`
2. Le service account a les bonnes permissions
3. La variable d'environnement est bien chargée

### Images non accessibles (403)

Vérifiez les permissions du bucket :
```bash
gsutil iam get gs://cvbuilder-images
```

Pour rendre public :
```bash
gsutil iam ch allUsers:objectViewer gs://cvbuilder-images
```

### Performance lente

Assurez-vous que :
1. Le bucket est dans la région la plus proche de vos utilisateurs
2. Vous utilisez un CDN si nécessaire (Cloud CDN)

## Next Steps

1. ✅ Configuration GCS terminée
2. 🔄 Installer les packages (`docker compose build`)
3. 🔄 Configurer vos credentials GCP
4. 🔄 Tester l'upload depuis le frontend
5. 📊 Monitorer les coûts dans GCP Console
