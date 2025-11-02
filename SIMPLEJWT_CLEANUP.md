# 🧹 Nettoyage des Références rest_framework_simplejwt

## ❌ Problème

Lors du déploiement en production, après avoir résolu l'erreur `allauth`, une nouvelle erreur apparaissait:

```
ModuleNotFoundError: No module named 'rest_framework_simplejwt'
```

**Cause:** Bien que `djangorestframework-simplejwt` ait été supprimé de `requirements.txt` lors de la migration vers Supabase, certains fichiers Python continuaient à l'importer.

## ✅ Solution Appliquée

### Fichiers Modifiés

#### 1. [backend/users/serializers.py](backend/users/serializers.py)

**Avant:**
```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer that uses email instead of username"""
    username_field = 'email'
```

**Après:**
```python
# Note: With Supabase authentication, JWT tokens are managed by Supabase.
# CustomTokenObtainPairSerializer is no longer needed.
```

**Justification:** Avec Supabase, les JWT tokens sont gérés par Supabase côté frontend. Le serializer custom n'est plus nécessaire.

#### 2. [backend/users/views.py](backend/users/views.py)

**Avant:**
```python
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(generics.CreateAPIView):
    def create(self, request, *args, **kwargs):
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
        })

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    def post(self, request):
        # Blacklist the refresh token
        refresh_token = request.data.get('refresh')
        if refresh_token:
            from rest_framework_simplejwt.tokens import RefreshToken
            token = RefreshToken(refresh_token)
            token.blacklist()
        ...
```

**Après:**
```python
# Note: With Supabase authentication, user registration is handled by Supabase.
# UserRegistrationView is no longer needed.

# Note: With Supabase authentication, login is handled by Supabase.
# CustomTokenObtainPairView is no longer needed.

class LogoutView(APIView):
    """
    Logout endpoint - handles session cleanup for Supabase authentication.

    Note: With Supabase, JWT token management is handled client-side.
    This endpoint only handles Django session cleanup for anonymous users.
    """
    def post(self, request):
        # Only destroy Django session, no token blacklisting
        request.session.flush()
        request.session.create()
        ...
```

**Justification:**
- **Registration:** Géré par Supabase (`supabase.auth.signUp()`)
- **Login:** Géré par Supabase (`supabase.auth.signInWithPassword()`, OAuth)
- **Tokens:** Gérés par Supabase (automatiquement refresh côté client)
- **Logout:** Géré par Supabase côté client (`supabase.auth.signOut()`), le backend ne gère que la session Django pour les users anonymes

### Classes/Fonctions Supprimées

| Élément | Fichier | Raison |
|---------|---------|--------|
| `CustomTokenObtainPairSerializer` | serializers.py | Tokens gérés par Supabase |
| `get_tokens_for_user()` | views.py | Plus nécessaire |
| `UserRegistrationView` | views.py | Registration via Supabase |
| `CustomTokenObtainPairView` | views.py | Login via Supabase |
| Token blacklisting logic | views.py | Tokens gérés côté client |

### Classes/Fonctions Conservées

| Élément | Fichier | Usage |
|---------|---------|-------|
| `UserSerializer` | serializers.py | ✅ Pour API responses |
| `UserProfileView` | views.py | ✅ Pour GET/PUT /api/auth/profile/ |
| `ChangePasswordSerializer` | serializers.py | ✅ Pour changer le mot de passe |
| `ChangePasswordView` | views.py | ✅ Pour POST /api/auth/change-password/ |
| `LogoutView` | views.py | ✅ Pour cleanup session Django (modifié) |

## 🔄 Flux d'Authentification Complet

### Inscription (Register)

**Avant (Django + simplejwt):**
```
Frontend → POST /api/auth/register/ → Django
              ↓
        UserRegistrationView crée user
              ↓
        get_tokens_for_user() génère JWT
              ↓
        Response { user, access, refresh }
```

**Après (Supabase):**
```
Frontend → supabase.auth.signUp() → Supabase API
              ↓
        Session Supabase créée
              ↓
        Frontend → POST /api/auth/sync/ → Django
              ↓
        User Django créé/mis à jour
              ↓
        Response { user }
```

### Connexion (Login)

**Avant (Django + simplejwt):**
```
Frontend → POST /api/auth/login/ → Django
              ↓
        CustomTokenObtainPairView valide credentials
              ↓
        get_tokens_for_user() génère JWT
              ↓
        Response { user, access, refresh }
```

**Après (Supabase):**
```
Frontend → supabase.auth.signInWithPassword() → Supabase API
              ↓
        Session Supabase créée (avec JWT)
              ↓
        Frontend → POST /api/auth/sync/ → Django
              ↓
        User Django créé/mis à jour
              ↓
        Response { user }
```

### OAuth (Google/LinkedIn)

**Avant (Django + simplejwt):**
```
Frontend → /api/auth/social/google/ → Django
              ↓
        Redirect to Google
              ↓
        Google callback → Django
              ↓
        get_tokens_for_user() génère JWT
              ↓
        Redirect to frontend with tokens
```

**Après (Supabase):**
```
Frontend → supabase.auth.signInWithOAuth() → Supabase
              ↓
        Redirect to Google
              ↓
        Google callback → Supabase
              ↓
        Supabase crée session
              ↓
        Redirect to /auth/callback
              ↓
        Frontend → POST /api/auth/sync/ → Django
              ↓
        User Django créé/mis à jour
```

### Déconnexion (Logout)

**Avant (Django + simplejwt):**
```
Frontend → POST /api/auth/logout/ → Django
              ↓
        LogoutView blacklist refresh token
              ↓
        Session Django destroyed
              ↓
        Response { message }
```

**Après (Supabase):**
```
Frontend → supabase.auth.signOut() → Supabase API
              ↓
        Session Supabase cleared (côté client)
              ↓
        Frontend → POST /api/auth/logout/ → Django
              ↓
        Session Django cleared (pour anonymous users)
              ↓
        Response { message }
```

## 📋 Checklist de Vérification

- [x] **Supprimé les imports simplejwt** de `serializers.py`
- [x] **Supprimé les imports simplejwt** de `views.py`
- [x] **Supprimé** `CustomTokenObtainPairSerializer`
- [x] **Supprimé** `get_tokens_for_user()`
- [x] **Supprimé** `UserRegistrationView`
- [x] **Supprimé** `CustomTokenObtainPairView`
- [x] **Modifié** `LogoutView` (supprimé token blacklisting)
- [x] **Conservé** `UserSerializer`, `UserProfileView`, `ChangePasswordView`
- [x] **Vérifié** que `python manage.py check` passe sans erreur

## 🚀 Déploiement

Après ces modifications, le backend peut être déployé sans erreur `ModuleNotFoundError: No module named 'rest_framework_simplejwt'`.

### Fichiers à Rebuild

```bash
# Backend (contient les changements)
docker build -t registry.frely.fr/cvbuilder-backend:latest ./backend
docker push registry.frely.fr/cvbuilder-backend:latest

# Mettre à jour les services
docker service update --force cvbuilder_backend
docker service update --force cvbuilder_celery
```

## ✅ État Final

### Modules Supprimés de requirements.txt
- ❌ `django-allauth` (session précédente)
- ❌ `dj-rest-auth` (session précédente)
- ❌ `djangorestframework-simplejwt` (session précédente)

### Modules Ajoutés
- ✅ `supabase==2.16.0`
- ✅ `pyjwt==2.10.1` (pour validation JWT Supabase)

### Authentification

| Fonctionnalité | Avant | Après |
|----------------|-------|-------|
| Registration | Django UserRegistrationView | Supabase signUp() |
| Login (email/password) | Django CustomTokenObtainPairView | Supabase signInWithPassword() |
| OAuth (Google/LinkedIn) | Django allauth views | Supabase signInWithOAuth() |
| JWT Tokens | Django simplejwt | Supabase (auto-refresh) |
| Token Blacklisting | Django simplejwt blacklist | N/A (géré côté client) |
| Session Management | Django sessions | Django sessions (anonymous only) |
| User Sync | N/A | Django SupabaseAuthentication |

## 🐛 Dépannage

### Erreur: "No module named 'rest_framework_simplejwt'"

**Solution:** Vérifiez qu'aucun fichier Python n'importe simplejwt:

```bash
cd backend
grep -r "simplejwt" --include="*.py" --exclude-dir=migrations .
grep -r "TokenObtainPairView" --include="*.py" --exclude-dir=migrations .
grep -r "RefreshToken" --include="*.py" --exclude-dir=migrations .
```

Si des fichiers sont trouvés, supprimez les imports et adaptez le code selon ce guide.

### Erreur: "Cannot import name 'UserRegistrationView'"

**Solution:** Si d'autres fichiers importaient cette vue, supprimez ces imports. `UserRegistrationView` n'existe plus, l'inscription se fait via Supabase.

### Erreur: "Cannot import name 'CustomTokenObtainPairSerializer'"

**Solution:** Cette classe n'existe plus. Si elle était importée ailleurs, supprimez l'import.

## 📚 Fichiers de Documentation Connexes

- [ALLAUTH_CLEANUP.md](ALLAUTH_CLEANUP.md) - Nettoyage allauth (précédent)
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guide complet de la migration Supabase
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Configuration de Supabase
- [SESSION_SUMMARY.md](SESSION_SUMMARY.md) - Résumé de session

## ✅ Résultat

Le backend peut maintenant démarrer en production sans dépendre de `djangorestframework-simplejwt`. L'authentification complète (inscription, login, OAuth, tokens) est entièrement gérée par Supabase côté frontend, avec synchronisation des utilisateurs vers Django via `/api/auth/sync/`.

**Vérification finale:**
```bash
cd backend
python manage.py check
# ✅ System check identified no issues (0 silenced).
```

---

**Dernière mise à jour:** 2025-11-02
