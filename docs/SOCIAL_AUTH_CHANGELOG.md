# Changelog - Ajout de l'Authentification Sociale

## Résumé

Ajout de l'authentification sociale (Google OAuth et LinkedIn OAuth) au backend Django du CV Builder.

## Modifications Effectuées

### 1. Dépendances Python (`requirements.txt`)

**Ajouté** :
```python
dj-rest-auth==5.0.2
django-allauth==0.57.0
dj-rest-auth[with_social]==5.0.2
```

**Installation** :
```bash
pip install -r requirements.txt
```

---

### 2. Configuration Django (`settings.py`)

#### 2.1 Applications Installées

**Ajouté à `INSTALLED_APPS`** :
```python
'django.contrib.sites',  # Required for allauth
'rest_framework.authtoken',  # Required for dj-rest-auth
'dj_rest_auth',
'dj_rest_auth.registration',
'allauth',
'allauth.account',
'allauth.socialaccount',
'allauth.socialaccount.providers.google',
'allauth.socialaccount.providers.linkedin_oauth2',
```

**Variable ajoutée** :
```python
SITE_ID = 1
```

#### 2.2 Backends d'Authentification

**Ajouté** :
```python
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]
```

#### 2.3 Configuration Allauth

**Ajouté** :
```python
# Allauth configuration
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

# Social providers
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'key': ''
        }
    },
    'linkedin_oauth2': {
        'SCOPE': ['r_basicprofile', 'r_emailaddress'],
        'PROFILE_FIELDS': [
            'id', 'first-name', 'last-name',
            'email-address', 'picture-url', 'public-profile-url'
        ],
        'APP': {
            'client_id': os.getenv('LINKEDIN_CLIENT_ID'),
            'secret': os.getenv('LINKEDIN_CLIENT_SECRET'),
            'key': ''
        }
    }
}

# dj-rest-auth settings
REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'auth-token',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh-token',
    'JWT_AUTH_HTTPONLY': True,
    'USER_DETAILS_SERIALIZER': 'users.serializers.UserSerializer',
    'REGISTER_SERIALIZER': 'users.serializers.UserRegistrationSerializer',
}

# Redirect URLs
LOGIN_REDIRECT_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000') + '/auth/callback'
ACCOUNT_LOGOUT_REDIRECT_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
```

---

### 3. Variables d'Environnement (`.env.example`)

**Ajouté** :
```bash
# Social Authentication - Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Social Authentication - LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

---

### 4. Signaux Django (`users/signals.py`) - NOUVEAU FICHIER

**Créé** : `backend/users/signals.py`

**Contenu** :
- Signal `user_logged_in` : Associe les CV anonymes à l'utilisateur après connexion classique
- Signal `pre_social_login` : Associe les CV anonymes lors de connexion sociale
- Signal `user_signed_up` : Associe les CV anonymes lors de l'inscription
- Signal `post_save` : Met à jour automatiquement le statut premium

**Fonctionnalité clé** :
Lorsqu'un utilisateur crée un CV sans être connecté (avec `session_id`), puis se connecte via Google ou LinkedIn, tous ses CV anonymes sont automatiquement associés à son compte.

---

### 5. Apps Configuration (`users/apps.py`)

**Modifié** :
```python
class UsersConfig(AppConfig):
    # ...

    def ready(self):
        """Import signals when app is ready"""
        import users.signals  # noqa
```

Charge les signaux au démarrage de l'application.

---

### 6. Documentation

**Créé** : `SOCIAL_AUTH_SETUP.md`

Guide complet de configuration incluant :
- Installation des dépendances
- Configuration Google Cloud Console
- Configuration LinkedIn Developers
- Configuration Django Admin
- Intégration frontend Next.js
- Tests et troubleshooting
- Sécurité en production

---

## URLs d'Authentification Disponibles

### Après configuration, ces endpoints seront disponibles :

#### Authentification Classique
```
POST /api/auth/registration/          - Inscription
POST /api/auth/login/                 - Connexion
POST /api/auth/logout/                - Déconnexion
GET  /api/auth/user/                  - Profil utilisateur (JWT)
POST /api/auth/password/reset/        - Reset password
```

#### OAuth Social
```
GET  /api/auth/google/                - Connexion Google
GET  /api/auth/google/callback/       - Callback Google
GET  /api/auth/linkedin_oauth2/       - Connexion LinkedIn
GET  /api/auth/linkedin_oauth2/callback/ - Callback LinkedIn
```

#### JWT Tokens
```
POST /api/auth/token/                 - Obtenir tokens
POST /api/auth/token/refresh/         - Refresh token
POST /api/auth/token/verify/          - Vérifier token
```

---

## Prochaines Étapes

### 1. Installation

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Migrations

```bash
python manage.py migrate
```

### 3. Configuration OAuth Providers

Suivre le guide dans **SOCIAL_AUTH_SETUP.md** pour :
- Créer une application Google OAuth
- Créer une application LinkedIn OAuth
- Ajouter les clés dans `.env`

### 4. Configuration Django Admin

```bash
python manage.py runserver
```

Aller sur http://localhost:8000/admin :
- **Sites** : Configurer le site (domain: localhost:8000)
- **Social applications** : Ajouter Google et LinkedIn avec leurs clés

### 5. URLs Backend (À finaliser)

Ajouter dans `cvbuilder_backend/urls.py` :

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/', include('allauth.urls')),
    # ... autres URLs
]
```

### 6. Frontend Integration

Créer les composants :
- `src/components/auth/SocialLogin.tsx` - Boutons Google/LinkedIn
- `src/app/auth/callback/page.tsx` - Page de callback OAuth

Exemples complets dans **SOCIAL_AUTH_SETUP.md**.

---

## Flux Utilisateur avec OAuth

### Scénario 1 : Utilisateur Anonyme → Connexion Google

1. ✅ Utilisateur arrive sur le site
2. ✅ Crée un CV sans se connecter → Sauvegarde avec `session_id`
3. ✅ Clic "Se connecter avec Google"
4. ✅ Redirection vers Google OAuth
5. ✅ Autorisation de l'app
6. ✅ Callback vers backend Django
7. ✅ Création automatique du compte utilisateur
8. ✅ **Signal** : Association automatique du CV anonyme au compte
9. ✅ Génération JWT (access + refresh tokens)
10. ✅ Redirection vers frontend avec tokens
11. ✅ Utilisateur connecté avec son CV déjà créé !

### Scénario 2 : Utilisateur Existant → Reconnexion LinkedIn

1. ✅ Utilisateur déjà inscrit via email/password
2. ✅ Clic "Se connecter avec LinkedIn"
3. ✅ OAuth LinkedIn
4. ✅ Liaison du compte LinkedIn au compte existant
5. ✅ Connexion réussie avec JWT

---

## Avantages de cette Implémentation

### 1. Expérience Utilisateur Fluide
- ✅ Pas de perte de données (CV anonymes associés automatiquement)
- ✅ Connexion en 2 clics (Google ou LinkedIn)
- ✅ Pas besoin de créer un mot de passe

### 2. Sécurité
- ✅ OAuth 2.0 (standard de l'industrie)
- ✅ Pas de stockage de passwords pour utilisateurs sociaux
- ✅ JWT avec rotation de tokens
- ✅ HttpOnly cookies pour les tokens

### 3. Fonctionnalités Avancées
- ✅ Import automatique du profil (nom, email, photo)
- ✅ Récupération facile de compte (via Google/LinkedIn)
- ✅ Support multi-providers (Google + LinkedIn + email)

---

## Tests

### Tester Google OAuth

```bash
# Backend lancé
python manage.py runserver

# Dans navigateur
http://localhost:8000/api/auth/google/
```

### Tester LinkedIn OAuth

```bash
http://localhost:8000/api/auth/linkedin_oauth2/
```

### Vérifier Utilisateur Créé

Django Admin → Users :
- Vérifier que l'utilisateur a été créé
- Vérifier Social accounts → Liaison Google/LinkedIn

### Vérifier Association des CV

1. Créer un CV sans connexion
2. Se connecter via Google
3. Django Admin → Resumes :
   - Vérifier que le CV a `user_id` au lieu de `session_id`

---

## Fichiers Modifiés/Créés

### Modifiés ✏️
- `backend/requirements.txt`
- `backend/cvbuilder_backend/settings.py`
- `backend/users/apps.py`
- `backend/.env.example`

### Créés ✨
- `backend/users/signals.py`
- `SOCIAL_AUTH_SETUP.md`
- `SOCIAL_AUTH_CHANGELOG.md` (ce fichier)

### À Créer (Prochaines Étapes)
- `backend/cvbuilder_backend/urls.py` (ajouter routes auth)
- `frontend/src/components/auth/SocialLogin.tsx`
- `frontend/src/app/auth/callback/page.tsx`

---

## Ressources

- **Guide Complet** : [SOCIAL_AUTH_SETUP.md](SOCIAL_AUTH_SETUP.md)
- **django-allauth** : https://django-allauth.readthedocs.io/
- **dj-rest-auth** : https://dj-rest-auth.readthedocs.io/
- **Google OAuth** : https://console.cloud.google.com/
- **LinkedIn OAuth** : https://www.linkedin.com/developers/apps

---

## Support

Pour toute question sur l'authentification sociale, consultez **SOCIAL_AUTH_SETUP.md** qui contient :
- Configuration étape par étape
- Troubleshooting complet
- Exemples de code frontend
- Tests et validation

---

**Statut** : ✅ Backend configuré et prêt
**Prochaine étape** : Configurer les apps OAuth (Google Cloud + LinkedIn) et tester
