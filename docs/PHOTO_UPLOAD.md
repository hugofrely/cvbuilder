# Photo Upload Feature Documentation

Cette documentation explique comment fonctionne l'upload de photo pour les CVs.

## Architecture

### Backend (Django)

#### Endpoints API

**1. Upload Photo**
- **URL**: `POST /api/resumes/{resume_id}/upload_photo/`
- **Content-Type**: `multipart/form-data`
- **Permissions**: Propriétaire du CV (user ou session)
- **Body**:
  ```
  photo: File (image/jpeg, image/png, image/gif)
  ```
- **Validations**:
  - Type de fichier: JPG, PNG, GIF
  - Taille maximum: 5 MB
  - Supprime l'ancienne photo si elle existe
- **Response**:
  ```json
  {
    "message": "Photo uploaded successfully",
    "photo_url": "https://storage.googleapis.com/cvbuilder-images/resumes/photos/uuid.jpg",
    "resume": { ... }
  }
  ```

**2. Delete Photo**
- **URL**: `DELETE /api/resumes/{resume_id}/delete_photo/`
- **Permissions**: Propriétaire du CV
- **Response**:
  ```json
  {
    "message": "Photo deleted successfully",
    "resume": { ... }
  }
  ```

#### Modèle Resume

Le champ `photo` dans le modèle `Resume` ([resumes/models.py:66](../backend/resumes/models.py#L66)) :

```python
photo = models.ImageField(upload_to='resumes/photos/', blank=True, null=True)
```

**Stockage**:
- **Développement** (`USE_GCS=False`): Stockage local dans `backend/media/resumes/photos/`
- **Production** (`USE_GCS=True`): Google Cloud Storage dans le bucket `cvbuilder-images`

L'URL de la photo est automatiquement générée :
- Local: `http://localhost:8000/media/resumes/photos/filename.jpg`
- GCS: `https://storage.googleapis.com/cvbuilder-images/resumes/photos/filename.jpg`

#### Implementation (views.py)

Voir [resumes/views.py:481-575](../backend/resumes/views.py#L481-L575) pour l'implémentation complète.

Fonctionnalités clés :
- Validation du type MIME
- Validation de la taille
- Suppression de l'ancienne photo
- Support GCS via django-storages

### Frontend (Next.js / React)

#### Composant PersonalInfoForm

Le composant [PersonalInfoForm.tsx](../frontend/components/builder/PersonalInfoForm.tsx) gère l'upload de photo.

**Fonctionnalités** :
1. **Prévisualisation** : Avatar MUI avec l'image
2. **Upload** :
   - Sélection de fichier via input
   - Validation côté client (type + taille)
   - Upload vers l'API backend
   - Mise à jour du context local avec l'URL
3. **Suppression** :
   - Bouton de suppression sur l'avatar
   - Appel API DELETE
   - Mise à jour du context local
4. **États** :
   - Loading spinner pendant l'upload
   - Messages d'erreur
   - Feedback visuel

**Code clé** :

```typescript
const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  // Validation
  if (file.size > 5 * 1024 * 1024) {
    setPhotoError('La photo ne doit pas dépasser 5 MB');
    return;
  }

  // Upload to API
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/upload_photo/`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  );

  const data = await response.json();
  updatePersonalInfo({ photo: data.photo_url });
};
```

## Configuration Requise

### Variables d'Environnement

**Backend** (`.env`) :
```bash
# Google Cloud Storage (optionnel pour production)
USE_GCS=True  # False pour développement local
GCS_BUCKET_NAME=cvbuilder-images
GCS_PROJECT_ID=cvbuilder-476609
GCS_CREDENTIALS=/app/service-account.json
```

**Frontend** (`.env.local`) :
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Dépendances

**Backend** (`requirements.txt`) :
```
Pillow==10.2.0  # Pour le traitement d'images
django-storages==1.14.2  # Pour GCS
google-cloud-storage==2.14.0  # Client GCS
```

## Flow d'utilisation

1. **Utilisateur sélectionne une photo** :
   - Clique sur "Ajouter une photo" dans PersonalInfoForm
   - Sélectionne un fichier image (JPG, PNG, GIF)

2. **Validation côté client** :
   - Vérification du type de fichier
   - Vérification de la taille (max 5MB)

3. **Upload vers le backend** :
   - FormData avec le fichier
   - POST `/api/resumes/{id}/upload_photo/`
   - Authentification via cookie de session

4. **Traitement backend** :
   - Validation du type MIME
   - Validation de la taille
   - Suppression de l'ancienne photo (si existe)
   - Sauvegarde dans GCS ou local storage
   - Génération de l'URL publique

5. **Mise à jour frontend** :
   - Récupération de l'URL de la photo
   - Mise à jour du context CV
   - Affichage de la nouvelle photo dans l'avatar

6. **Utilisation dans le CV** :
   - La photo est incluse dans le rendu HTML du CV
   - L'URL est injectée dans le template Handlebars
   - Visible dans la prévisualisation et le PDF exporté

## Sécurité

### Validations

1. **Type de fichier** : Seulement images (MIME type check)
2. **Taille** : Maximum 5 MB
3. **Permissions** : Seulement le propriétaire peut uploader/supprimer
4. **Ownership** : Vérification via user_id ou session_id

### Protection

- CORS configuré pour accepter seulement le frontend
- Credentials (cookies) requis pour l'authentification
- Validation server-side en plus du client-side
- Suppression sécurisée des anciennes photos

## Troubleshooting

### Erreur "No photo file provided"
**Cause** : Le FormData ne contient pas le champ 'photo'
**Solution** : Vérifier que le nom du champ dans FormData est 'photo'

### Erreur "Invalid file type"
**Cause** : Type MIME non autorisé
**Solution** : Accepter seulement JPG, PNG, GIF

### Erreur "File too large"
**Cause** : Fichier > 5 MB
**Solution** : Compresser l'image ou demander une image plus petite

### Photo n'apparaît pas après upload
**Causes possibles** :
1. GCS non configuré (`USE_GCS=True` mais bucket n'existe pas)
2. Permissions GCS incorrectes
3. CORS bloque le chargement de l'image

**Solutions** :
1. Vérifier la configuration GCS avec `python test_gcs.py`
2. Créer le bucket : `gsutil mb -l europe-west1 gs://cvbuilder-images`
3. Rendre le bucket public : `gsutil iam ch allUsers:objectViewer gs://cvbuilder-images`

### Développement local

Pour tester sans GCS :
```bash
# Dans backend/.env
USE_GCS=False
```

Les photos seront stockées dans `backend/media/resumes/photos/`

## Tests

### Test manuel

1. Démarrer le backend : `docker compose up backend`
2. Démarrer le frontend : `cd frontend && npm run dev`
3. Aller sur http://localhost:3000/builder
4. Étape "Informations personnelles"
5. Cliquer "Ajouter une photo"
6. Sélectionner une image < 5MB
7. Vérifier que la photo apparaît dans l'avatar
8. Vérifier dans le backend que le fichier existe

### Test API avec cURL

```bash
# Upload photo
curl -X POST \
  http://localhost:8000/api/resumes/{resume_id}/upload_photo/ \
  -H "Cookie: sessionid=..." \
  -F "photo=@/path/to/photo.jpg"

# Delete photo
curl -X DELETE \
  http://localhost:8000/api/resumes/{resume_id}/delete_photo/ \
  -H "Cookie: sessionid=..."
```

## Améliorations futures

1. **Compression automatique** : Réduire automatiquement la taille des images
2. **Crop/Resize** : Permettre de recadrer la photo
3. **Formats supplémentaires** : Support WebP, AVIF
4. **CDN** : Ajouter un CDN pour des performances optimales
5. **Thumbnails** : Générer des miniatures pour optimiser le chargement
6. **Drag & Drop** : Interface drag & drop pour l'upload
7. **Webcam** : Permettre de prendre une photo avec la webcam

## Références

- [Django ImageField](https://docs.djangoproject.com/en/5.1/ref/models/fields/#imagefield)
- [django-storages GCS](https://django-storages.readthedocs.io/en/latest/backends/gcloud.html)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [MUI Avatar](https://mui.com/material-ui/react-avatar/)
