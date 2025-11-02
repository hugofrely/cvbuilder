# 📁 Structure des Fichiers - Authentification Supabase

## 📖 Vue d'ensemble

Voici tous les fichiers impliqués dans le système d'authentification Supabase.

---

## 🔧 Backend (Django)

### Fichiers Principaux

```
backend/
├── cvbuilder_backend/
│   ├── settings.py                      ⭐ Configuration Supabase
│   ├── authentication.py                ⭐ SupabaseAuthentication class
│   └── urls.py                          ✏️ URLs simplifiées
│
├── users/
│   ├── supabase_auth.py                 ⭐ Service Supabase (NOUVEAU)
│   ├── supabase_views.py                ⭐ Vues API Supabase (NOUVEAU)
│   ├── urls.py                          ✏️ URLs simplifiées
│   ├── models.py                        ✅ User model (inchangé)
│   └── serializers.py                   ✅ Serializers (inchangés)
│
├── requirements.txt                     ✏️ Dépendances mises à jour
└── .env.example                         ✏️ Variables Supabase ajoutées
```

### Détails des Fichiers Backend

#### `cvbuilder_backend/settings.py`
**Rôle:** Configuration Django et Supabase

**Changements:**
```python
# Supprimé
- INSTALLED_APPS: allauth, dj-rest-auth, rest_framework_simplejwt
- SIMPLE_JWT configuration
- SOCIALACCOUNT_PROVIDERS configuration
- REST_AUTH configuration

# Ajouté
+ SUPABASE_URL
+ SUPABASE_ANON_KEY
+ SUPABASE_SERVICE_KEY
+ SUPABASE_JWT_SECRET

# Modifié
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = [
    'cvbuilder_backend.authentication.SupabaseAuthentication'
]
```

#### `cvbuilder_backend/authentication.py`
**Rôle:** Authentification DRF personnalisée pour Supabase

**Fonctions:**
- Valide les tokens JWT Supabase
- Synchronise les utilisateurs Supabase avec Django
- Crée automatiquement les utilisateurs Django

#### `users/supabase_auth.py` ⭐ NOUVEAU
**Rôle:** Service d'authentification Supabase

**Fonctions:**
- `verify_token()` - Vérifie un JWT Supabase
- `get_user_from_token()` - Extrait les données utilisateur du token
- `create_user()` - Crée un utilisateur dans Supabase
- `update_user_metadata()` - Met à jour les métadonnées
- `get_user_by_id()` - Récupère un utilisateur

#### `users/supabase_views.py` ⭐ NOUVEAU
**Rôle:** Vues API pour Supabase

**Endpoints:**
- `GET/PATCH/PUT /api/auth/profile/` - Profil utilisateur
- `POST /api/auth/sync/` - Sync Supabase → Django
- `POST /api/auth/logout/` - Déconnexion

#### `users/urls.py`
**Avant:**
```python
urlpatterns = [
    path('login/', ...),           # Supprimé
    path('register/', ...),        # Supprimé
    path('refresh/', ...),         # Supprimé
    path('verify/', ...),          # Supprimé
    path('social/google/', ...),   # Supprimé
    path('social/linkedin/', ...),  # Supprimé
    path('profile/', ...),         # Conservé
    path('logout/', ...),          # Conservé
]
```

**Après:**
```python
urlpatterns = [
    path('profile/', UserProfileView.as_view()),
    path('sync/', UserSyncView.as_view()),      # Nouveau
    path('logout/', LogoutView.as_view()),
]
```

#### `requirements.txt`
**Supprimé:**
- `djangorestframework-simplejwt==5.3.1`
- `dj-rest-auth==5.0.2`
- `django-allauth==0.57.0`
- `dj-rest-auth[with_social]==5.0.2`

**Ajouté:**
- `supabase==2.16.0`
- `pyjwt==2.10.1`

---

## 🎨 Frontend (Next.js + React)

### Fichiers Principaux

```
frontend/
├── lib/
│   ├── supabase/
│   │   └── client.ts                    ⭐ Client Supabase (NOUVEAU)
│   │
│   ├── api/
│   │   └── auth.ts                      ✏️ Service auth mis à jour
│   │
│   └── stores/
│       └── useAuthStore.ts              ✅ Store (inchangé)
│
├── context/
│   └── AuthContext.tsx                  ✏️ Context mis à jour
│
├── components/
│   └── auth/
│       └── OAuthButtons.tsx             ✏️ Boutons OAuth mis à jour
│
├── app/
│   └── auth/
│       └── callback/
│           └── page.tsx                 ✏️ Page callback mise à jour
│
├── package.json                         ✏️ Dépendance ajoutée
└── .env.example                         ⭐ Variables Supabase (NOUVEAU)
```

### Détails des Fichiers Frontend

#### `lib/supabase/client.ts` ⭐ NOUVEAU
**Rôle:** Client Supabase configuré

```typescript
export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
```

#### `lib/api/auth.ts`
**Rôle:** Service d'authentification

**Avant (django-allauth):**
```typescript
async login(credentials) {
  // POST /api/auth/login/
  const response = await apiClient.post('/api/auth/login/', credentials);
  this.setTokens(response.data);
}
```

**Après (Supabase):**
```typescript
async login(credentials) {
  // Appel direct à Supabase
  const { data } = await supabase.auth.signInWithPassword(credentials);
  await this.syncWithBackend(data.session.access_token);
}

async signInWithGoogle() {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
}

async signInWithLinkedIn() {
  await supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc' });
}
```

**Nouvelles méthodes:**
- `signInWithGoogle()` - OAuth Google
- `signInWithLinkedIn()` - OAuth LinkedIn
- `getSession()` - Session Supabase
- `getSupabaseUser()` - Utilisateur Supabase
- `setupAuthListener()` - Écoute les changements d'auth

#### `context/AuthContext.tsx`
**Rôle:** Context d'authentification React

**Changements:**
```typescript
// Ajout du listener Supabase
useEffect(() => {
  const unsubscribe = authService.setupAuthListener(
    async (session) => {
      if (session) {
        await loadUser();
      } else {
        storeLogout();
      }
    }
  );

  return () => unsubscribe();
}, []);
```

#### `components/auth/OAuthButtons.tsx`
**Rôle:** Boutons de connexion OAuth

**Avant:**
```typescript
const handleGoogleAuth = () => {
  window.location.href = authService.getGoogleAuthUrl();
  // Redirige vers le backend Django
};
```

**Après:**
```typescript
const handleGoogleAuth = async () => {
  await authService.signInWithGoogle();
  // Appel direct à Supabase, pas de backend
};
```

#### `app/auth/callback/page.tsx`
**Rôle:** Page de callback OAuth

**Avant:**
```typescript
// Récupère les tokens de l'URL (envoyés par Django)
const access = searchParams.get('access');
const refresh = searchParams.get('refresh');
authService.setTokens({ access, refresh });
```

**Après:**
```typescript
// Attend que Supabase établisse la session
const session = await authService.getSession();
// La session est automatique via le listener
```

#### `package.json`
**Ajouté:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.2"
  }
}
```

---

## 📄 Documentation

### Fichiers de Documentation Créés

```
/
├── QUICKSTART.md                        ⭐ Guide rapide 15 min
├── SUPABASE_SETUP.md                    ⭐ Guide de configuration
├── MIGRATION_GUIDE.md                   ⭐ Guide technique détaillé
├── CHANGELOG_SUPABASE.md                ⭐ Liste des changements
├── README_SUPABASE.md                   ⭐ Vue d'ensemble
└── FILES_STRUCTURE.md                   ⭐ Ce fichier
```

### Utilisation des Docs

| Fichier | Quand l'utiliser |
|---------|------------------|
| **QUICKSTART.md** | Première utilisation, démarrage rapide |
| **SUPABASE_SETUP.md** | Configuration initiale de Supabase |
| **MIGRATION_GUIDE.md** | Comprendre les changements techniques |
| **CHANGELOG_SUPABASE.md** | Voir la liste complète des modifications |
| **README_SUPABASE.md** | Vue d'ensemble générale |
| **FILES_STRUCTURE.md** | Comprendre la structure (ce fichier) |

---

## 🗑️ Fichiers Obsolètes (à supprimer)

Ces fichiers ne sont plus utilisés et peuvent être supprimés :

```
backend/
└── users/
    ├── oauth_views.py                   ❌ Plus utilisé
    └── linkedin_oauth.py                ❌ Plus utilisé
```

**Commande pour supprimer:**
```bash
cd backend/users
rm oauth_views.py linkedin_oauth.py
```

---

## 🔄 Flux de Données

### Connexion Email/Password

```
Frontend (auth.ts)
    ↓ supabase.auth.signInWithPassword()
Supabase
    ↓ JWT Token
Frontend (auth.ts)
    ↓ POST /api/auth/sync/ avec JWT
Backend (SupabaseAuthentication)
    ↓ Vérifie JWT
    ↓ Crée/Met à jour User Django
Frontend
    ← User Django data
```

### OAuth (Google/LinkedIn)

```
Frontend (OAuthButtons.tsx)
    ↓ supabase.auth.signInWithOAuth()
Supabase
    ↓ Redirige vers Provider
Provider (Google/LinkedIn)
    ↓ Callback vers Supabase
Supabase
    ↓ Établit session + JWT
    ↓ Redirige vers /auth/callback
Frontend (callback/page.tsx)
    ↓ Attend session
    ↓ POST /api/auth/sync/
Backend
    ↓ Vérifie JWT + Sync User
Frontend
    ← User data + Redirection
```

---

## 💾 Variables d'Environnement

### Backend (`.env`)
```bash
# Supabase
SUPABASE_URL=                # URL du projet Supabase
SUPABASE_ANON_KEY=           # Clé publique anon
SUPABASE_SERVICE_KEY=        # Clé privée service_role
SUPABASE_JWT_SECRET=         # Secret JWT

# Django
SECRET_KEY=                  # Secret Django
DEBUG=True
ALLOWED_HOSTS=

# Database
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```bash
# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🔍 Résumé

### Fichiers Créés
- ✅ 6 fichiers backend
- ✅ 1 fichier frontend
- ✅ 6 fichiers de documentation

### Fichiers Modifiés
- ✅ 5 fichiers backend
- ✅ 4 fichiers frontend

### Fichiers Supprimés (logiquement)
- ❌ 2 fichiers backend obsolètes

### Total
- **12** nouveaux fichiers
- **9** fichiers modifiés
- **2** fichiers à supprimer

---

**Navigation rapide:**
- [← Retour au guide de démarrage](./QUICKSTART.md)
- [→ Guide de configuration](./SUPABASE_SETUP.md)
