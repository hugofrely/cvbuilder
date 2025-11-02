# Changelog - Migration Supabase

## Date : 2025-11-02

### 🎯 Objectif
Migration complète du système d'authentification de django-allauth vers Supabase.

---

## ✨ Changements Majeurs

### Backend (Django)

#### Dépendances
**Supprimées:**
- `djangorestframework-simplejwt==5.3.1`
- `dj-rest-auth==5.0.2`
- `django-allauth==0.57.0`
- `dj-rest-auth[with_social]==5.0.2`

**Ajoutées:**
- `supabase==2.16.0`
- `pyjwt==2.10.1`

#### Nouveaux Fichiers
- `users/supabase_auth.py` - Service d'authentification Supabase
- `users/supabase_views.py` - Vues API pour Supabase
- `backend/.env.example` - Exemple de configuration (mis à jour)

#### Fichiers Modifiés
- `cvbuilder_backend/settings.py`
  - Suppression de toutes les configurations allauth
  - Ajout des variables Supabase
  - Mise à jour de `REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']`
  - Suppression de `SIMPLE_JWT`, `SOCIALACCOUNT_PROVIDERS`, `REST_AUTH`

- `cvbuilder_backend/authentication.py`
  - Remplacement de `CsrfExemptSessionAuthentication` par `SupabaseAuthentication`
  - Validation des tokens JWT Supabase
  - Synchronisation automatique des utilisateurs Supabase avec Django

- `cvbuilder_backend/urls.py`
  - Suppression de `path('accounts/', include('allauth.urls'))`

- `users/urls.py`
  - Simplification drastique des URLs
  - Suppression des endpoints: `/login/`, `/register/`, `/refresh/`, `/verify/`
  - Conservation : `/profile/`, `/logout/`
  - Ajout : `/sync/`

#### Fichiers Supprimés (logiquement)
- `users/oauth_views.py` - N'est plus utilisé
- `users/linkedin_oauth.py` - N'est plus utilisé
- `users/adapters.py` - N'est plus nécessaire (si existait)

---

### Frontend (Next.js + React)

#### Dépendances
**Ajoutées:**
- `@supabase/supabase-js@^2.49.2`

#### Nouveaux Fichiers
- `lib/supabase/client.ts` - Client Supabase configuré
- `frontend/.env.example` - Exemple de configuration

#### Fichiers Modifiés
- `lib/api/auth.ts`
  - Réécriture complète pour utiliser Supabase
  - Méthodes `login()` et `register()` utilisent `supabase.auth`
  - Nouvelles méthodes: `signInWithGoogle()`, `signInWithLinkedIn()`
  - Ajout de `setupAuthListener()` pour écouter les changements d'auth
  - Méthode `syncWithBackend()` pour synchroniser avec Django

- `context/AuthContext.tsx`
  - Intégration du listener Supabase auth state
  - Mise à jour de `loadUser()` pour utiliser les sessions Supabase
  - Simplification de `login()` et `register()`

- `components/auth/OAuthButtons.tsx`
  - Appel direct à `authService.signInWithGoogle()`
  - Appel direct à `authService.signInWithLinkedIn()`
  - Ajout d'états de chargement
  - Pas de redirection backend nécessaire

---

## 📋 Endpoints API

### Avant (django-allauth)
```
POST /api/auth/login/           # Login email/password
POST /api/auth/register/        # Register
POST /api/auth/refresh/         # Refresh token
POST /api/auth/verify/          # Verify token
GET  /api/auth/social/google/   # Initiate Google OAuth
GET  /api/auth/social/linkedin/ # Initiate LinkedIn OAuth
GET  /api/auth/social/callback/ # OAuth callback
GET  /api/auth/profile/         # Get user profile
POST /api/auth/logout/          # Logout
```

### Après (Supabase)
```
# Auth handled client-side by Supabase
GET  /api/auth/profile/         # Get user profile (synced)
POST /api/auth/sync/            # Sync Supabase user with Django
POST /api/auth/logout/          # Logout (notification only)
```

---

## 🔄 Flux d'Authentification

### Email/Password

**Avant:**
1. Frontend → POST `/api/auth/login/` avec credentials
2. Backend vérifie avec Django User
3. Backend génère JWT
4. Frontend stocke JWT

**Après:**
1. Frontend → `supabase.auth.signInWithPassword()`
2. Supabase valide et retourne JWT
3. Frontend → POST `/api/auth/sync/` avec JWT
4. Backend vérifie JWT et synchronise l'utilisateur

### OAuth (Google/LinkedIn)

**Avant:**
1. Frontend → Redirection vers `/api/auth/social/google/`
2. Backend → Redirection vers Google
3. Google → Callback vers backend `/accounts/google/callback/`
4. Backend génère JWT et redirige vers frontend
5. Frontend extrait JWT de l'URL

**Après:**
1. Frontend → `supabase.auth.signInWithOAuth({ provider: 'google' })`
2. Supabase → Redirection vers Google
3. Google → Callback vers Supabase
4. Supabase → Redirection vers `/auth/callback` frontend
5. Frontend → Auto-sync avec backend via listener

---

## 🔑 Variables d'Environnement

### Backend

**Supprimées:**
```bash
JWT_ACCESS_TOKEN_LIFETIME_MINUTES
JWT_REFRESH_TOKEN_LIFETIME_DAYS
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
```

**Ajoutées:**
```bash
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
SUPABASE_JWT_SECRET
```

### Frontend

**Ajoutées:**
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## ✅ Avantages de la Migration

1. **Simplicité**
   - Moins de code backend à maintenir
   - OAuth géré entièrement par Supabase
   - Pas de gestion manuelle des tokens JWT

2. **Sécurité**
   - JWT générés et validés par Supabase
   - Pas de secrets OAuth dans le backend Django
   - Gestion automatique du refresh des tokens

3. **Performance**
   - Authentification côté client (moins de requêtes serveur)
   - Sessions persistantes automatiques
   - Listeners en temps réel pour les changements d'auth

4. **Fonctionnalités**
   - Dashboard Supabase pour gérer les utilisateurs
   - Email templates personnalisables
   - MFA prêt à l'emploi (si besoin futur)
   - Analytics d'authentification

5. **Coût**
   - Plan gratuit : 50 000 utilisateurs actifs/mois
   - Pas d'infrastructure d'auth à gérer

---

## 🔧 Migration des Utilisateurs Existants

Les utilisateurs existants dans la base Django :
- ❌ Ne peuvent **PAS** se connecter directement
- ✅ Doivent créer un compte Supabase (même email)
- ✅ Leurs données de profil Django seront préservées
- ✅ Synchronisation automatique email → profil Django

**Solution recommandée :** Email de notification aux utilisateurs pour se reconnecter.

---

## 📚 Documentation Créée

1. **SUPABASE_SETUP.md** - Guide rapide de configuration
2. **MIGRATION_GUIDE.md** - Guide détaillé de migration
3. **CHANGELOG_SUPABASE.md** - Ce fichier

---

## 🧪 Tests à Effectuer

### Fonctionnel
- [ ] Inscription email/password
- [ ] Connexion email/password
- [ ] Connexion Google OAuth
- [ ] Connexion LinkedIn OAuth
- [ ] Déconnexion
- [ ] Persistance de session (refresh page)
- [ ] Accès aux pages protégées
- [ ] Récupération du profil utilisateur

### Technique
- [ ] Validation des tokens JWT Supabase
- [ ] Synchronisation user Supabase ↔ Django
- [ ] Gestion des erreurs d'auth
- [ ] Expiration des tokens
- [ ] Callbacks OAuth

---

## ⚠️ Points d'Attention

1. **Production**
   - Configurer les URLs de callback OAuth en production
   - Utiliser HTTPS obligatoire
   - Configurer les domaines autorisés dans Supabase

2. **Email**
   - Configurer SMTP dans Supabase pour les emails de confirmation
   - Personnaliser les templates d'emails

3. **Données**
   - Sauvegarder la base avant migration
   - Prévoir la migration des utilisateurs existants

---

## 📞 Support

Pour toute question :
- Lire [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Consulter [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- Documentation Supabase : https://supabase.com/docs

---

**Migration réalisée le** : 2025-11-02
**Durée estimée** : ~2h
**Status** : ✅ Complète
