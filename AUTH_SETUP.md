# Configuration du Système d'Authentification

Ce document explique comment configurer et utiliser le système d'authentification (Email/Password, Google OAuth, LinkedIn OAuth).

## Table des matières

1. [Architecture](#architecture)
2. [Configuration Backend](#configuration-backend)
3. [Configuration Frontend](#configuration-frontend)
4. [Configuration OAuth](#configuration-oauth)
5. [Utilisation](#utilisation)
6. [Endpoints API](#endpoints-api)

## Architecture

Le système d'authentification utilise :

- **Backend** : Django + django-allauth + djangorestframework-simplejwt
- **Frontend** : Next.js + React Context + Zustand
- **Tokens** : JWT (Access + Refresh tokens)
- **OAuth** : Google et LinkedIn via django-allauth
- **Endpoints** : API personnalisée sur `/api/auth/`

## Configuration Backend

### 1. Packages installés

Les packages suivants sont déjà installés (voir `backend/requirements.txt`) :

```
Django==5.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
dj-rest-auth==5.0.2
django-allauth==0.57.0
dj-rest-auth[with_social]==5.0.2
```

### 2. Variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` avec les variables suivantes :

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=cvbuilder
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Redis (for Celery)
REDIS_URL=redis://localhost:6379/0
```

### 3. Migrations

Exécutez les migrations pour créer les tables nécessaires :

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 4. Créer un superuser (optionnel)

```bash
python manage.py createsuperuser
```

### 5. Lancer le serveur

```bash
python manage.py runserver
```

## Configuration Frontend

### 1. Variables d'environnement

Créez un fichier `.env.local` dans le dossier `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Installation des dépendances

```bash
cd frontend
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

## Configuration OAuth

### Configuration Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ (Google People API)
4. Créez des identifiants OAuth 2.0 :
   - Type : Application Web
   - URI de redirection autorisés :
     - `http://localhost:8000/accounts/google/login/callback/`
     - `http://localhost:3000/auth/callback`
5. Copiez le Client ID et Client Secret dans votre `.env`

### Configuration LinkedIn OAuth

1. Allez sur [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Créez une nouvelle application
3. Dans les paramètres OAuth 2.0 :
   - URI de redirection autorisés :
     - `http://localhost:8000/accounts/linkedin_oauth2/login/callback/`
     - `http://localhost:3000/auth/callback`
4. Copiez le Client ID et Client Secret dans votre `.env`

### Configuration dans Django Admin

1. Accédez à l'admin Django : `http://localhost:8000/admin/`
2. Allez dans **Sites** et modifiez le site par défaut :
   - Domain name : `localhost:8000`
   - Display name : `CV Builder`
3. Allez dans **Social applications** et ajoutez :

   **Pour Google :**
   - Provider : Google
   - Name : Google OAuth
   - Client id : (votre Google Client ID)
   - Secret key : (votre Google Client Secret)
   - Sites : Sélectionnez votre site

   **Pour LinkedIn :**
   - Provider : LinkedIn OAuth2
   - Name : LinkedIn OAuth
   - Client id : (votre LinkedIn Client ID)
   - Secret key : (votre LinkedIn Client Secret)
   - Sites : Sélectionnez votre site

## Utilisation

### Pages d'authentification

- **Login** : `/auth/login`
- **Register** : `/auth/register`
- **OAuth Callback** : `/auth/callback`

### Utiliser l'authentification dans vos composants

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, register } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password123' });
      // Redirection après login réussie
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bienvenue {user?.email}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

### Protéger une route

Utilisez le composant `ProtectedRoute` :

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  );
}
```

### Utiliser le store Zustand directement

```typescript
import { useAuthStore } from '@/lib/stores/useAuthStore';

function MyComponent() {
  const { user, isAuthenticated, accessToken } = useAuthStore();

  return (
    <div>
      {isAuthenticated && <p>Token: {accessToken}</p>}
    </div>
  );
}
```

## Endpoints API

### Authentification Email/Password

#### Register
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "password2": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "is_premium": false,
    "subscription_type": "none"
  },
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "is_premium": false,
    "subscription_type": "none"
  }
}
```

#### Logout
Le logout est géré côté frontend en supprimant les tokens. Pas d'endpoint backend nécessaire.

#### Refresh Token
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Current User
```http
GET /api/auth/profile/
Authorization: Bearer {access_token}
```

### OAuth

#### Google Login
```http
GET /accounts/google/login/
```

Redirige vers la page d'autorisation Google, puis callback vers `/auth/callback`

#### LinkedIn Login
```http
GET /accounts/linkedin_oauth2/login/
```

Redirige vers la page d'autorisation LinkedIn, puis callback vers `/auth/callback`

## Flux d'authentification

### 1. Email/Password

1. L'utilisateur remplit le formulaire de login/register
2. Le frontend envoie les credentials au backend
3. Le backend valide et retourne les tokens JWT
4. Les tokens sont stockés dans Zustand (persisté dans localStorage)
5. L'utilisateur est redirigé vers `/builder`

### 2. OAuth (Google/LinkedIn)

1. L'utilisateur clique sur le bouton OAuth
2. Redirection vers la page d'autorisation OAuth du provider
3. Après autorisation, le provider redirige vers le callback backend
4. Le backend crée/récupère l'utilisateur et établit une session
5. Redirection vers `/auth/callback` frontend
6. Le frontend récupère les informations utilisateur
7. L'utilisateur est redirigé vers `/builder`

## Sécurité

- Les tokens JWT sont stockés dans Zustand avec persistance localStorage
- Les access tokens expirent après 15 minutes (configurable)
- Les refresh tokens expirent après 7 jours (configurable)
- Le refresh automatique des tokens est géré par l'interceptor axios
- Les routes protégées nécessitent un token valide
- CORS est configuré pour autoriser uniquement le frontend

## Dépannage

### Erreur CORS

Vérifiez que `FRONTEND_URL` dans `.env` backend correspond à l'URL de votre frontend.

### OAuth ne fonctionne pas

1. Vérifiez que les URIs de redirection sont corrects dans la console Google/LinkedIn
2. Vérifiez que les credentials sont corrects dans le Django admin
3. Vérifiez que le site Django est configuré correctement

### Tokens non rafraîchis

1. Vérifiez que `SIMPLE_JWT` est correctement configuré dans `settings.py`
2. Vérifiez que l'interceptor axios est bien configuré
3. Consultez la console browser pour voir les erreurs

## Tests

Pour tester l'authentification :

```bash
# Backend
cd backend
python manage.py test users

# Frontend
cd frontend
npm run test
```
