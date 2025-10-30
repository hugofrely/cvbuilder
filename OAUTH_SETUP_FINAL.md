# Configuration OAuth - Résumé Final

## Architecture

Le système OAuth utilise `/api/auth/social/` comme préfixe pour tous les endpoints OAuth :

```
Frontend → /api/auth/social/google/ → /accounts/google/login/ (allauth)
        ↓
   Google OAuth Flow
        ↓
   /accounts/google/login/callback/ (allauth) → /api/auth/social/callback/
        ↓
   Backend génère JWT tokens
        ↓
   Redirect → Frontend /auth/callback?access=xxx&refresh=xxx
```

## Endpoints Backend

### OAuth Initiation

**Google Login**
```
GET /api/auth/social/google/
```
→ Redirige vers `/accounts/google/login/` (allauth)

**LinkedIn Login**
```
GET /api/auth/social/linkedin_oauth2/
```
→ Redirige vers `/accounts/linkedin_oauth2/login/` (allauth)

### OAuth Callback

```
GET /api/auth/social/callback/
```
- Reçoit l'utilisateur authentifié par allauth
- Génère les JWT tokens (access + refresh)
- Redirige vers frontend : `/auth/callback?access={token}&refresh={token}`

### Authentification Standard

```
POST /api/auth/login/          - Login email/password (retourne tokens + user)
POST /api/auth/register/       - Register (retourne tokens + user)
POST /api/auth/refresh/        - Refresh token
GET  /api/auth/profile/        - Get user profile
POST /api/auth/change-password/- Change password
```

## Flux OAuth Complet

### 1. Utilisateur clique sur bouton Google/LinkedIn

Frontend :
```typescript
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8000/api/auth/social/google/';
};
```

### 2. Backend redirige vers OAuth provider

`GoogleLoginView` → redirect `/accounts/google/login/`

### 3. Django-allauth gère l'OAuth flow

- Redirect vers Google
- Utilisateur autorise
- Google callback → `/accounts/google/login/callback/`
- Allauth crée/récupère l'utilisateur
- Redirect vers `LOGIN_REDIRECT_URL = /api/auth/social/callback/`

### 4. Backend callback génère JWT

```python
# users/oauth_views.py - OAuthCallbackView
tokens = get_tokens_for_user(request.user)
redirect(f'{FRONTEND_URL}/auth/callback?access={tokens.access}&refresh={tokens.refresh}')
```

### 5. Frontend récupère les tokens

```typescript
// app/auth/callback/page.tsx
const access = searchParams.get('access');
const refresh = searchParams.get('refresh');
authService.setTokens({ access, refresh });
await refreshUser();
router.push('/builder');
```

## Configuration OAuth Providers

### Google Cloud Console

**Authorized redirect URIs :**
```
http://localhost:8000/accounts/google/login/callback/
https://your-domain.com/accounts/google/login/callback/
```

### LinkedIn Developers

**Redirect URLs :**
```
http://localhost:8000/accounts/linkedin_oauth2/login/callback/
https://your-domain.com/accounts/linkedin_oauth2/login/callback/
```

### Django Admin

1. Aller sur http://localhost:8000/admin
2. **Sites** → Modifier site (domain: `localhost:8000`)
3. **Social applications** → Add :
   - **Provider** : Google
   - **Client ID** : (from Google Console)
   - **Secret key** : (from Google Console)
   - **Sites** : localhost:8000

## Fichiers Créés/Modifiés

### Backend

**[users/oauth_views.py](backend/users/oauth_views.py)** - Nouveau
- `GoogleLoginView` : GET /api/auth/social/google/
- `LinkedInLoginView` : GET /api/auth/social/linkedin_oauth2/
- `OAuthCallbackView` : GET /api/auth/social/callback/

**[users/urls.py](backend/users/urls.py)** - Modifié
- Ajout des routes OAuth sous `/social/`

**[users/views.py](backend/users/views.py)** - Modifié
- `CustomTokenObtainPairView` : Login qui retourne user + tokens
- `UserRegistrationView` : Register qui retourne tokens

**[cvbuilder_backend/settings.py](backend/cvbuilder_backend/settings.py)** - Modifié
- `LOGIN_REDIRECT_URL = '/api/auth/social/callback/'`

### Frontend

**[lib/api/auth.ts](frontend/lib/api/auth.ts)** - Modifié
- `getGoogleAuthUrl()` → `/api/auth/social/google/`
- `getLinkedInAuthUrl()` → `/api/auth/social/linkedin_oauth2/`

**[app/auth/callback/page.tsx](frontend/app/auth/callback/page.tsx)** - Modifié
- Récupère tokens depuis URL params
- Stocke les tokens
- Redirige vers /builder

## Test du Flow

### 1. Démarrer les serveurs

```bash
# Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Frontend
cd frontend
npm run dev
```

### 2. Configurer OAuth dans Admin

```
http://localhost:8000/admin
→ Social applications
→ Ajouter Google/LinkedIn avec vos credentials
```

### 3. Tester OAuth

```
http://localhost:3000/auth/login
→ Cliquer "Sign in with Google"
→ Autoriser
→ Redirection vers /builder avec tokens
```

## Variables d'Environnement

### Backend (.env)
```env
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Sécurité

- Tokens JWT stockés dans Zustand (persisté localStorage)
- Refresh automatique via axios interceptor
- CORS configuré pour frontend uniquement
- HTTPS obligatoire en production

## Troubleshooting

### "Redirect URI mismatch"
→ Vérifier que l'URI dans Google/LinkedIn console correspond exactement à `/accounts/google/login/callback/`

### "No tokens received"
→ Vérifier que `LOGIN_REDIRECT_URL` pointe vers `/api/auth/social/callback/`

### "User not found"
→ Vérifier que Social application est configurée dans Django admin
→ Vérifier que le site est correctement configuré (localhost:8000)

## Résumé des URLs

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/social/google/` | GET | Initie OAuth Google |
| `/api/auth/social/linkedin_oauth2/` | GET | Initie OAuth LinkedIn |
| `/api/auth/social/callback/` | GET | Callback après OAuth (retourne tokens) |
| `/accounts/google/login/callback/` | GET | Callback allauth Google (interne) |
| `/accounts/linkedin_oauth2/login/callback/` | GET | Callback allauth LinkedIn (interne) |
| `/auth/callback?access=...&refresh=...` | GET | Frontend callback (stocke tokens) |

Le système est maintenant configuré pour utiliser `/api/auth/social/` ! 🎉
