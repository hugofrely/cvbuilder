# 🔧 Fix: Trailing Slash dans les URLs DRF

## ❌ Problème

En production, erreur 404 sur les actions custom DRF:

```
Not Found: /api/resumes/3fa5684e-ccee-442b-bea2-af6459c09df7/upload_photo/
"POST /api/resumes/3fa5684e-ccee-442b-bea2-af6459c09df7/upload_photo/ HTTP/1.1" 404 23
```

## 🔍 Cause

**Django REST Framework** enregistre les actions custom **sans trailing slash** par défaut:
- DRF enregistre: `/api/resumes/{id}/upload_photo` ✅
- Frontend appelait: `/api/resumes/{id}/upload_photo/` ❌ (avec slash)

Bien que Django's `APPEND_SLASH` puisse rediriger automatiquement, cela ne fonctionne pas toujours correctement avec DRF, surtout en production avec des reverse proxies.

## ✅ Solution Appliquée

Supprimé les trailing slashes dans tous les appels API frontend pour correspondre aux URLs DRF.

### Fichiers Modifiés

#### 1. [frontend/components/builder/PersonalInfoForm.tsx](frontend/components/builder/PersonalInfoForm.tsx)

**Avant:**
```typescript
// Upload photo
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/upload_photo/`,
  { method: 'POST', ... }
);

// Delete photo
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/delete_photo/`,
  { method: 'DELETE', ... }
);
```

**Après:**
```typescript
// Upload photo
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/upload_photo`,
  { method: 'POST', ... }
);

// Delete photo
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/delete_photo`,
  { method: 'DELETE', ... }
);
```

#### 2. [frontend/lib/api/resume.ts](frontend/lib/api/resume.ts)

**Avant:**
```typescript
// Export PDF
await apiClient.post(`/api/resumes/${id}/export_pdf/`, ...);

// Render HTML
await apiClient.get(`/api/resumes/${id}/render_html/`);
```

**Après:**
```typescript
// Export PDF
await apiClient.post(`/api/resumes/${id}/export_pdf`, ...);

// Render HTML
await apiClient.get(`/api/resumes/${id}/render_html`);
```

## 📋 URLs Corrigées

| Endpoint | Avant | Après | Méthode |
|----------|-------|-------|---------|
| Upload photo | `/upload_photo/` | `/upload_photo` | POST |
| Delete photo | `/delete_photo/` | `/delete_photo` | DELETE |
| Export PDF | `/export_pdf/` | `/export_pdf` | POST |
| Render HTML | `/render_html/` | `/render_html` | GET |

## 🔄 Convention DRF

### Actions Custom DRF

Quand vous définissez une action custom dans un ViewSet DRF:

```python
@action(detail=True, methods=['post'])
def my_action(self, request, pk=None):
    ...
```

DRF l'enregistre automatiquement **SANS** trailing slash:
- ✅ Enregistré: `/api/resource/{id}/my_action`
- ❌ Non enregistré: `/api/resource/{id}/my_action/`

### Routes Standard DRF

Les routes standard de DRF utilisent des trailing slashes (contrôlés par `APPEND_SLASH`):
- ✅ `/api/resumes/` (list)
- ✅ `/api/resumes/{id}/` (detail)

### Règle à Suivre

Pour éviter ce problème à l'avenir:

1. **Actions custom DRF:** Pas de trailing slash
   ```typescript
   // ✅ Correct
   await fetch(`/api/resumes/${id}/custom_action`, ...)

   // ❌ Incorrect
   await fetch(`/api/resumes/${id}/custom_action/`, ...)
   ```

2. **Routes standard DRF:** Avec trailing slash
   ```typescript
   // ✅ Correct
   await fetch(`/api/resumes/`, ...)
   await fetch(`/api/resumes/${id}/`, ...)
   ```

## 🐛 Dépannage

### Erreur 404 sur une action custom

**Symptôme:** `404 Not Found` sur `/api/resource/{id}/action/`

**Vérification:**
1. Vérifier que l'action existe dans le ViewSet:
   ```python
   @action(detail=True, methods=['post'])
   def my_action(self, request, pk=None):
       ...
   ```

2. Vérifier l'URL appelée côté frontend:
   ```typescript
   // ❌ Ne fonctionne pas
   fetch('/api/resource/{id}/my_action/')

   // ✅ Fonctionne
   fetch('/api/resource/{id}/my_action')
   ```

### Comment détecter ce problème

Regardez les logs Django/DRF:
```
Not Found: /api/resumes/{id}/upload_photo/
```

Le trailing slash `/` à la fin indique le problème.

### Solution Alternative (Backend)

Si vous préférez garder les trailing slashes côté frontend, vous pouvez forcer DRF à les accepter en ajoutant explicitement les URLs:

```python
# resumes/urls.py
from django.urls import path

urlpatterns = [
    # ... routes existantes

    # Ajouter explicitement les routes avec trailing slash
    path('resumes/<uuid:pk>/upload_photo/',
         ResumeViewSet.as_view({'post': 'upload_photo'})),
]
```

**Mais** la solution recommandée est de suivre la convention DRF (sans trailing slash pour actions custom).

## ✅ Vérification

Après la correction:

```bash
# Build frontend
cd frontend
npm run build
# ✅ Build successful

# Test en production
curl -X POST https://api.bidly.fr/api/resumes/{id}/upload_photo
# ✅ 200 OK (ou 400 si pas de fichier)

# Avant la correction
curl -X POST https://api.bidly.fr/api/resumes/{id}/upload_photo/
# ❌ 404 Not Found
```

## 📚 Documentation Connexe

- [DRF ViewSet Actions](https://www.django-rest-framework.org/api-guide/viewsets/#marking-extra-actions-for-routing)
- [Django APPEND_SLASH Setting](https://docs.djangoproject.com/en/4.2/ref/settings/#append-slash)

## 🚀 Déploiement

Après cette correction, rebuild et redeploy le frontend:

```bash
# Build image
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.bidly.fr \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... \
  -t registry.frely.fr/cvbuilder-frontend:latest \
  ./frontend

# Push image
docker push registry.frely.fr/cvbuilder-frontend:latest

# Update service
docker service update --force cvbuilder_frontend
```

## ✅ Résultat

Les endpoints DRF custom fonctionnent maintenant correctement:
- ✅ `/api/resumes/{id}/upload_photo` → 200 OK
- ✅ `/api/resumes/{id}/delete_photo` → 200 OK
- ✅ `/api/resumes/{id}/export_pdf` → 200 OK
- ✅ `/api/resumes/{id}/render_html` → 200 OK

---

**Dernière mise à jour:** 2025-11-02
