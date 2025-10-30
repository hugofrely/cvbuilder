# Changements - Système d'Authentification

## Résumé

Le système d'authentification utilise maintenant vos endpoints existants `/api/auth/` au lieu de dj-rest-auth.

## Modifications Backend

### 1. URLs ([backend/cvbuilder_backend/urls.py](backend/cvbuilder_backend/urls.py))

- ❌ Supprimé : `/api/auth/dj-rest-auth/`
- ✅ Conservé : `/api/auth/` (vos endpoints existants)
- ✅ Ajouté : `/accounts/` pour OAuth (django-allauth)

### 2. Vues ([backend/users/views.py](backend/users/views.py))

**Ajouté :**
- `get_tokens_for_user()` : Fonction helper pour générer les tokens JWT
- `CustomTokenObtainPairView` : Vue de login qui retourne aussi les données utilisateur

**Modifié :**
- `UserRegistrationView` : Retourne maintenant les tokens JWT après inscription

### 3. URLs Users ([backend/users/urls.py](backend/users/urls.py))

- Remplacé `TokenObtainPairView` par `CustomTokenObtainPairView` pour `/login/`

## Modifications Frontend

### 1. Service Auth ([frontend/lib/api/auth.ts](frontend/lib/api/auth.ts))

**Endpoints mis à jour :**
- Login : `/api/auth/login/` (au lieu de `/api/auth/dj-rest-auth/login/`)
- Register : `/api/auth/register/` (au lieu de `/api/auth/dj-rest-auth/registration/`)
- OAuth Google : `/accounts/google/login/`
- OAuth LinkedIn : `/accounts/linkedin_oauth2/login/`

**Logout :**
- Géré uniquement côté frontend (suppression des tokens)

## Endpoints API Disponibles

### Authentification
- `POST /api/auth/login/` - Connexion (retourne tokens + user)
- `POST /api/auth/register/` - Inscription (retourne tokens + user)
- `POST /api/auth/refresh/` - Rafraîchir le token
- `GET /api/auth/profile/` - Récupérer le profil utilisateur
- `POST /api/auth/change-password/` - Changer le mot de passe

### OAuth
- `GET /accounts/google/login/` - Connexion Google
- `GET /accounts/linkedin_oauth2/login/` - Connexion LinkedIn

## Pages Frontend

### Créées
- `/auth/login` - Page de connexion
- `/auth/register` - Page d'inscription
- `/auth/callback` - Callback OAuth

### Composants
- `OAuthButtons` - Boutons Google/LinkedIn
- `ProtectedRoute` - Protection des routes authentifiées
- `AuthContext` - Context React pour l'authentification

## Configuration OAuth

### URIs de redirection à configurer

**Google Cloud Console :**
- `http://localhost:8000/accounts/google/login/callback/`
- `http://localhost:3000/auth/callback`

**LinkedIn Developers :**
- `http://localhost:8000/accounts/linkedin_oauth2/login/callback/`
- `http://localhost:3000/auth/callback`

## Utilisation

```typescript
// Dans un composant
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, register, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'pass123' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Connecté en tant que {user?.email}</p>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

## Prochaines étapes

1. Configurer les credentials OAuth (Google/LinkedIn)
2. Mettre à jour les variables d'environnement
3. Tester le flux d'authentification
4. Déployer en production avec les bonnes URIs de redirection

## Notes

- Les tokens JWT sont stockés dans Zustand avec persistance localStorage
- Le refresh automatique des tokens est géré par l'interceptor axios
- La page `/builder` est maintenant protégée (authentification requise)
- Pas besoin de dj-rest-auth, tout utilise vos endpoints personnalisés
