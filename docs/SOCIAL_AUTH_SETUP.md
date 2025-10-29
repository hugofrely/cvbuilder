# Configuration de l'Authentification Sociale (Google & LinkedIn)

Ce guide vous explique comment configurer l'authentification sociale avec Google et LinkedIn pour le CV Builder.

## Table des matières
- [Installation](#installation)
- [Configuration Google OAuth](#configuration-google-oauth)
- [Configuration LinkedIn OAuth](#configuration-linkedin-oauth)
- [Configuration Backend Django](#configuration-backend-django)
- [URLs d'Authentification](#urls-dauthentification)
- [Frontend Integration](#frontend-integration)
- [Tests](#tests)

---

## Installation

Les dépendances ont déjà été ajoutées dans `requirements.txt` :

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Packages installés** :
- `django-allauth` - Gestion complète de l'authentification sociale
- `dj-rest-auth` - API REST pour l'authentification
- `dj-rest-auth[with_social]` - Support OAuth social

---

## Configuration Google OAuth

### Étape 1 : Créer un Projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Nom du projet : **CV Builder** (ou autre)

### Étape 2 : Activer Google+ API

1. Dans le menu, aller sur **APIs & Services** > **Library**
2. Chercher **Google+ API**
3. Cliquer sur **Enable** (Activer)

### Étape 3 : Créer des Identifiants OAuth 2.0

1. Aller sur **APIs & Services** > **Credentials**
2. Cliquer sur **Create Credentials** > **OAuth client ID**
3. Si demandé, configurer l'écran de consentement OAuth :
   - **User Type** : External (pour tests) ou Internal (si workspace)
   - **App name** : CV Builder
   - **User support email** : Votre email
   - **Developer contact** : Votre email
   - **Scopes** : Laisser par défaut (email, profile)
   - Cliquer **Save and Continue**

4. Créer les identifiants OAuth :
   - **Application type** : Web application
   - **Name** : CV Builder Web Client
   - **Authorized JavaScript origins** :
     ```
     http://localhost:8000
     http://localhost:3000
     https://votre-domaine.com (en production)
     ```
   - **Authorized redirect URIs** :
     ```
     http://localhost:8000/api/auth/google/callback/
     http://localhost:3000/auth/callback
     https://votre-domaine.com/api/auth/google/callback/ (en production)
     ```

5. Cliquer **Create**

### Étape 4 : Récupérer les Clés

Vous obtiendrez :
- **Client ID** : `xxxxx.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-xxxxxx`

Copiez ces valeurs dans votre fichier `.env` :

```bash
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
```

---

## Configuration LinkedIn OAuth

### Étape 1 : Créer une Application LinkedIn

1. Aller sur [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Cliquer sur **Create app**
3. Remplir les informations :
   - **App name** : CV Builder
   - **LinkedIn Page** : Créer une page LinkedIn si nécessaire
   - **App logo** : Uploader un logo (optionnel)
   - **Legal agreement** : Accepter

### Étape 2 : Configurer l'Application

1. Dans l'onglet **Auth**, noter :
   - **Client ID**
   - **Client Secret** (cliquer sur "Show" pour voir)

2. Dans **OAuth 2.0 settings**, ajouter les **Redirect URLs** :
   ```
   http://localhost:8000/api/auth/linkedin_oauth2/callback/
   http://localhost:3000/auth/callback
   https://votre-domaine.com/api/auth/linkedin_oauth2/callback/ (en production)
   ```

3. Dans l'onglet **Products**, demander l'accès à :
   - **Sign In with LinkedIn** (approuvé instantanément)
   - **Share on LinkedIn** (optionnel)

### Étape 3 : Configurer les Permissions

Dans l'onglet **Auth** > **OAuth 2.0 scopes**, vérifier que ces scopes sont disponibles :
- `r_liteprofile` - Accès au profil basique
- `r_emailaddress` - Accès à l'email

### Étape 4 : Ajouter les Clés dans .env

```bash
LINKEDIN_CLIENT_ID=votre-linkedin-client-id
LINKEDIN_CLIENT_SECRET=votre-linkedin-client-secret
```

---

## Configuration Backend Django

### Les fichiers ont déjà été configurés :

#### 1. `settings.py` ✅
- `INSTALLED_APPS` : ajout de `django-allauth` et providers
- `AUTHENTICATION_BACKENDS` : support OAuth
- `SOCIALACCOUNT_PROVIDERS` : configuration Google et LinkedIn
- `REST_AUTH` : intégration avec JWT

#### 2. URLs à créer

Créer ou mettre à jour `backend/cvbuilder_backend/urls.py` :

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication endpoints
    path('api/auth/', include('dj_rest_auth.urls')),  # Login, Logout, Password reset
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration
    path('api/auth/', include('allauth.urls')),  # Social auth (Google, LinkedIn)

    # Vos autres URLs...
    # path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 3. Migrations

Exécuter les migrations pour créer les tables nécessaires :

```bash
python manage.py migrate
```

### 4. Configurer les Social Apps dans Django Admin

**Option A : Via Django Admin (Recommandé pour débuter)**

1. Lancer le serveur :
   ```bash
   python manage.py runserver
   ```

2. Aller sur http://localhost:8000/admin

3. Se connecter avec votre superuser

4. Aller dans **Sites** :
   - Modifier le site existant (ID=1)
   - **Domain name** : `localhost:8000` (en dev) ou `votre-domaine.com` (en prod)
   - **Display name** : CV Builder

5. Aller dans **Social applications** :

   **Pour Google** :
   - Cliquer **Add Social Application**
   - **Provider** : Google
   - **Name** : Google OAuth
   - **Client id** : Votre `GOOGLE_CLIENT_ID`
   - **Secret key** : Votre `GOOGLE_CLIENT_SECRET`
   - **Sites** : Sélectionner `localhost:8000` (ou votre site)
   - **Save**

   **Pour LinkedIn** :
   - Cliquer **Add Social Application**
   - **Provider** : LinkedIn OAuth2
   - **Name** : LinkedIn OAuth
   - **Client id** : Votre `LINKEDIN_CLIENT_ID`
   - **Secret key** : Votre `LINKEDIN_CLIENT_SECRET`
   - **Sites** : Sélectionner `localhost:8000`
   - **Save**

**Option B : Via Code (settings.py)**

Les clés sont déjà configurées dans `SOCIALACCOUNT_PROVIDERS` dans `settings.py`.

---

## URLs d'Authentification

### Backend Endpoints

Une fois configuré, vous aurez accès à ces endpoints :

#### Inscription/Connexion Classique
```
POST /api/auth/registration/          - Inscription
POST /api/auth/login/                 - Connexion (email + password)
POST /api/auth/logout/                - Déconnexion
POST /api/auth/password/reset/        - Demande reset password
POST /api/auth/password/reset/confirm/ - Confirmer reset
GET  /api/auth/user/                  - Profil utilisateur (JWT required)
```

#### Connexion Sociale (OAuth)

**Google** :
```
GET /api/auth/google/                 - Initie OAuth Google
GET /api/auth/google/callback/        - Callback après autorisation
```

**LinkedIn** :
```
GET /api/auth/linkedin_oauth2/        - Initie OAuth LinkedIn
GET /api/auth/linkedin_oauth2/callback/ - Callback après autorisation
```

#### JWT Tokens
```
POST /api/auth/token/                 - Obtenir access + refresh tokens
POST /api/auth/token/refresh/         - Refresh access token
POST /api/auth/token/verify/          - Vérifier token
```

---

## Frontend Integration

### 1. Boutons de Connexion Sociale

Dans votre frontend Next.js, créer des boutons de connexion :

```typescript
// src/components/auth/SocialLogin.tsx
'use client'
import { Button } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SocialLogin() {
  const handleGoogleLogin = () => {
    // Redirect vers backend pour initier OAuth
    window.location.href = `${API_URL}/api/auth/google/`
  }

  const handleLinkedInLogin = () => {
    window.location.href = `${API_URL}/api/auth/linkedin_oauth2/`
  }

  return (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Button
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        fullWidth
        sx={{ minHeight: 48 }}
      >
        Se connecter avec Google
      </Button>

      <Button
        variant="outlined"
        startIcon={<LinkedInIcon />}
        onClick={handleLinkedInLogin}
        fullWidth
        sx={{ minHeight: 48, bgcolor: '#0077B5', color: 'white' }}
      >
        Se connecter avec LinkedIn
      </Button>
    </div>
  )
}
```

### 2. Page de Callback

Créer une page pour gérer le callback après l'authentification :

```typescript
// src/app/auth/callback/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CircularProgress, Box, Typography } from '@mui/material'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Récupérer le token depuis les query params ou cookies
    const token = searchParams.get('token')

    if (token) {
      // Stocker le token (localStorage ou cookie)
      localStorage.setItem('access_token', token)

      // Rediriger vers dashboard ou builder
      router.push('/dashboard')
    } else {
      // Si pas de token, erreur
      router.push('/auth/error')
    }
  }, [searchParams, router])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Authentification en cours...
      </Typography>
    </Box>
  )
}
```

### 3. Gestion du JWT

Après authentification sociale, le backend retourne un JWT. Configurez Axios pour l'utiliser :

```typescript
// src/lib/api.ts
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Intercepteur pour ajouter JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur pour refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
```

---

## Tests

### 1. Tester le Flow Google OAuth

```bash
# Backend en cours d'exécution
python manage.py runserver

# Dans un navigateur
http://localhost:8000/api/auth/google/
```

**Flow attendu** :
1. Redirection vers Google
2. Sélection du compte Google
3. Autorisation de l'app
4. Callback vers `http://localhost:8000/api/auth/google/callback/`
5. Création automatique du user dans Django
6. Redirection vers frontend avec JWT

### 2. Tester le Flow LinkedIn OAuth

```bash
http://localhost:8000/api/auth/linkedin_oauth2/
```

**Flow attendu** :
1. Redirection vers LinkedIn
2. Connexion LinkedIn
3. Autorisation de l'app
4. Callback vers `http://localhost:8000/api/auth/linkedin_oauth2/callback/`
5. Création user
6. Redirection frontend

### 3. Vérifier l'Utilisateur Créé

Dans Django admin :

1. Aller sur http://localhost:8000/admin
2. **Users** : Vérifier qu'un nouvel utilisateur a été créé
3. **Social accounts** : Vérifier la liaison avec Google/LinkedIn

### 4. Tester l'API avec JWT

```bash
# Obtenir le token après connexion sociale
curl -X GET http://localhost:8000/api/auth/user/ \
  -H "Authorization: Bearer votre-access-token"
```

**Réponse attendue** :
```json
{
  "id": 1,
  "email": "user@gmail.com",
  "username": "user",
  "first_name": "John",
  "last_name": "Doe",
  "is_premium": false
}
```

---

## Associer CV Anonymes au Compte Social

Après connexion sociale, lier les CV créés en mode anonyme :

```python
# Backend - après connexion sociale (signal ou custom view)
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from resumes.models import Resume

@receiver(user_logged_in)
def link_anonymous_resumes(sender, request, user, **kwargs):
    """Associer les CV de la session à l'utilisateur connecté"""
    session_id = request.session.session_key

    if session_id:
        # Trouver et associer les CV
        resumes = Resume.objects.filter(session_id=session_id, user__isnull=True)
        resumes.update(user=user, session_id=None)

        print(f"{resumes.count()} CV(s) associé(s) à {user.email}")
```

Ajouter ce code dans `users/signals.py` (à créer) et l'importer dans `users/apps.py`.

---

## Troubleshooting

### Erreur : "Redirect URI mismatch"

**Cause** : L'URL de callback n'est pas autorisée dans Google/LinkedIn

**Solution** :
- Vérifier que l'URL de callback est exactement la même dans :
  - Google Cloud Console / LinkedIn App
  - Backend Django
  - Frontend redirect

### Erreur : "Invalid client"

**Cause** : Client ID ou Secret incorrect

**Solution** :
- Vérifier les clés dans `.env`
- Vérifier qu'elles correspondent à celles dans Google/LinkedIn
- Redémarrer le serveur Django après modification `.env`

### Erreur : "SITE_ID not found"

**Cause** : Table `django_site` vide

**Solution** :
```bash
python manage.py shell

from django.contrib.sites.models import Site
Site.objects.create(domain='localhost:8000', name='CV Builder')
```

### Utilisateur créé mais pas de token JWT

**Cause** : Configuration `REST_AUTH` incorrecte

**Solution** :
- Vérifier `REST_AUTH['USE_JWT'] = True` dans `settings.py`
- Vérifier que `rest_framework_simplejwt` est installé

---

## Sécurité en Production

### HTTPS Obligatoire

En production, **toujours** utiliser HTTPS :

```python
# settings.py (production)
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        },
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'VERIFIED_EMAIL': True,  # Exiger email vérifié
    }
}
```

### Variables d'Environnement

Ne JAMAIS commit les clés dans Git :

```bash
# .gitignore
.env
*.env.local
```

### Rate Limiting

Ajouter rate limiting sur endpoints OAuth :

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',  # 100 requêtes/heure pour anonymes
    }
}
```

---

## Récapitulatif des Commandes

```bash
# Installation
cd backend
pip install -r requirements.txt

# Migrations
python manage.py migrate

# Créer superuser (si pas encore fait)
python manage.py createsuperuser

# Configurer social apps via admin
python manage.py runserver
# → http://localhost:8000/admin → Social applications

# Tester OAuth Google
# → http://localhost:8000/api/auth/google/

# Tester OAuth LinkedIn
# → http://localhost:8000/api/auth/linkedin_oauth2/
```

---

## Endpoints Complets

```
# Authentification classique
POST   /api/auth/registration/         - Inscription
POST   /api/auth/login/                - Connexion
POST   /api/auth/logout/               - Déconnexion
GET    /api/auth/user/                 - Profil (JWT required)

# OAuth Social
GET    /api/auth/google/               - Login Google
GET    /api/auth/google/callback/      - Callback Google
GET    /api/auth/linkedin_oauth2/      - Login LinkedIn
GET    /api/auth/linkedin_oauth2/callback/ - Callback LinkedIn

# JWT
POST   /api/auth/token/                - Obtenir tokens
POST   /api/auth/token/refresh/        - Refresh token
POST   /api/auth/token/verify/         - Vérifier token
```

---

## Ressources

- **django-allauth** : https://django-allauth.readthedocs.io/
- **dj-rest-auth** : https://dj-rest-auth.readthedocs.io/
- **Google OAuth** : https://console.cloud.google.com/
- **LinkedIn OAuth** : https://www.linkedin.com/developers/apps

---

Vous êtes maintenant prêt à utiliser l'authentification sociale Google et LinkedIn dans votre CV Builder ! 🚀
