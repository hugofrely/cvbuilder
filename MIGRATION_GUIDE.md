# Guide de Migration vers Supabase

Ce guide explique comment migrer l'authentification de votre application vers Supabase.

## Vue d'ensemble

L'authentification a été complètement migrée de django-allauth vers Supabase. Supabase gère maintenant:
- Authentification email/password
- OAuth Google
- OAuth LinkedIn (via LinkedIn OIDC)

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet
3. Notez les informations suivantes dans Project Settings > API:
   - `Project URL` (SUPABASE_URL)
   - `anon public key` (SUPABASE_ANON_KEY)
   - `service_role key` (SUPABASE_SERVICE_KEY)
4. Dans Project Settings > API > JWT Settings, notez:
   - `JWT Secret` (SUPABASE_JWT_SECRET)

### 2. Configurer les providers OAuth dans Supabase

#### Google OAuth

1. Dans votre projet Supabase, allez dans Authentication > Providers
2. Activez le provider "Google"
3. Entrez vos Google OAuth credentials (Client ID et Client Secret)
4. Ajoutez l'URL de redirection autorisée: `https://your-project-id.supabase.co/auth/v1/callback`

#### LinkedIn OAuth

1. Dans Authentication > Providers, activez "LinkedIn (OIDC)"
2. Créez une application LinkedIn sur [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
3. Configurez les redirections OAuth:
   - Ajoutez: `https://your-project-id.supabase.co/auth/v1/callback`
4. Entrez le Client ID et Client Secret dans Supabase

### 3. Configurer les variables d'environnement

#### Backend (.env)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

#### Frontend (.env.local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Installer les dépendances

#### Backend

```bash
cd backend
pip install -r requirements.txt
```

Les nouvelles dépendances incluent:
- `supabase==2.16.0`
- `pyjwt==2.10.1`

Les anciennes dépendances suivantes ont été supprimées:
- `djangorestframework-simplejwt`
- `dj-rest-auth`
- `django-allauth`

#### Frontend

```bash
cd frontend
npm install
```

La nouvelle dépendance:
- `@supabase/supabase-js@^2.49.2`

### 5. Exécuter les migrations Django

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 6. Configurer l'URL de redirection OAuth

Dans votre application frontend, l'URL de callback OAuth est configurée à:
```
http://localhost:3000/auth/callback (développement)
https://your-domain.com/auth/callback (production)
```

Assurez-vous que cette page existe et gère correctement le callback Supabase.

## Changements importants

### Backend

1. **Authentification**:
   - Remplacé `rest_framework_simplejwt.authentication.JWTAuthentication` par `cvbuilder_backend.authentication.SupabaseAuthentication`
   - Les tokens JWT sont maintenant générés et validés par Supabase

2. **Endpoints API**:
   - Supprimés: `/api/auth/login/`, `/api/auth/register/`, `/api/auth/refresh/`
   - L'authentification se fait maintenant côté client avec Supabase
   - Conservé: `/api/auth/profile/` (synchronisé avec Supabase)
   - Nouveau: `/api/auth/sync/` (pour synchroniser l'utilisateur Supabase avec Django)

3. **Settings Django**:
   - Suppression de toutes les configurations allauth
   - Ajout des variables Supabase

### Frontend

1. **Service d'authentification** (`lib/api/auth.ts`):
   - Les méthodes utilisent maintenant le client Supabase
   - `login()` et `register()` utilisent Supabase Auth
   - OAuth se fait via `supabase.auth.signInWithOAuth()`

2. **AuthContext**:
   - Écoute les changements d'état d'authentification Supabase
   - Synchronise automatiquement avec le backend Django

3. **OAuth Buttons**:
   - Les boutons déclenchent maintenant `authService.signInWithGoogle()` et `authService.signInWithLinkedIn()`
   - Pas besoin de redirection backend

## Migration des utilisateurs existants

Si vous avez des utilisateurs existants dans votre base de données Django, vous devrez les migrer vers Supabase:

1. Les utilisateurs devront se reconnecter ou réinitialiser leur mot de passe
2. Leurs données de profil seront conservées dans Django et synchronisées automatiquement
3. L'email est utilisé comme identifiant unique entre Supabase et Django

## Vérification

1. Démarrez le backend:
```bash
cd backend
python manage.py runserver
```

2. Démarrez le frontend:
```bash
cd frontend
npm run dev
```

3. Testez:
   - Inscription avec email/password
   - Connexion avec email/password
   - Connexion avec Google
   - Connexion avec LinkedIn
   - Déconnexion

## Dépannage

### Erreur "Missing Supabase environment variables"

Assurez-vous que toutes les variables Supabase sont définies dans vos fichiers `.env`.

### OAuth ne fonctionne pas

1. Vérifiez que les URLs de redirection sont correctement configurées dans:
   - Supabase Dashboard
   - Google Developer Console
   - LinkedIn Developer Portal

2. Assurez-vous que les providers sont activés dans Supabase

### Erreur "Invalid token"

1. Vérifiez que le `SUPABASE_JWT_SECRET` est correct
2. Assurez-vous que le token n'est pas expiré
3. Vérifiez que l'utilisateur existe dans Supabase

## Support

Pour toute question ou problème, consultez:
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
