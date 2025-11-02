# Configuration Supabase - Guide Rapide

## Résumé de la Migration

Votre application utilise maintenant **Supabase** pour toute l'authentification :
- ✅ Email/Password
- ✅ OAuth Google
- ✅ OAuth LinkedIn

## Prochaines Étapes

### 1. Créer un Projet Supabase (5 minutes)

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Choisissez une région proche de vos utilisateurs
5. Attendez que le projet soit prêt (2-3 minutes)

### 2. Récupérer les Clés API (2 minutes)

Dans votre projet Supabase, allez dans **Project Settings > API** :

Copiez ces valeurs:
- **Project URL** → `SUPABASE_URL`
- **anon public key** → `SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_KEY`

Dans **Project Settings > API > JWT Settings**:
- **JWT Secret** → `SUPABASE_JWT_SECRET`

### 3. Configurer les Variables d'Environnement

#### Backend (.env)
```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=votre-jwt-secret-ici
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurer Google OAuth (5 minutes)

1. Dans Supabase: **Authentication > Providers > Google**
2. Activez le provider Google
3. Utilisez vos credentials Google existants ou créez-en de nouveaux:
   - [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Ajoutez l'URL de callback autorisée:
   ```
   https://votre-projet.supabase.co/auth/v1/callback
   ```
5. Entrez le **Client ID** et **Client Secret** dans Supabase

### 5. Configurer LinkedIn OAuth (5 minutes)

1. Dans Supabase: **Authentication > Providers > LinkedIn (OIDC)**
2. Activez le provider
3. Créez une app LinkedIn ou utilisez celle existante:
   - [LinkedIn Developers](https://www.linkedin.com/developers/apps)
4. Dans les paramètres OAuth de LinkedIn, ajoutez:
   ```
   https://votre-projet.supabase.co/auth/v1/callback
   ```
5. Entrez le **Client ID** et **Client Secret** dans Supabase

### 6. Installer les Dépendances

#### Backend
```bash
cd backend
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

### 7. Lancer l'Application

#### Backend
```bash
cd backend
python manage.py migrate
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Test de l'Authentification

Allez sur http://localhost:3000 et testez:

1. **Inscription** avec email/password
2. **Connexion** avec email/password
3. **Connexion** avec Google
4. **Connexion** avec LinkedIn
5. **Déconnexion**

## Fichiers Modifiés

### Backend
- ✅ `requirements.txt` - Nouvelles dépendances Supabase
- ✅ `cvbuilder_backend/settings.py` - Configuration Supabase
- ✅ `cvbuilder_backend/authentication.py` - Authentication Supabase
- ✅ `users/supabase_auth.py` - Service d'auth Supabase (NOUVEAU)
- ✅ `users/supabase_views.py` - Vues d'auth Supabase (NOUVEAU)
- ✅ `users/urls.py` - URLs simplifiées
- ✅ `.env.example` - Variables Supabase

### Frontend
- ✅ `package.json` - Dépendance @supabase/supabase-js
- ✅ `lib/supabase/client.ts` - Client Supabase (NOUVEAU)
- ✅ `lib/api/auth.ts` - Service d'auth mis à jour
- ✅ `context/AuthContext.tsx` - Context mis à jour
- ✅ `components/auth/OAuthButtons.tsx` - Boutons OAuth mis à jour
- ✅ `.env.example` - Variables Supabase

## Avantages de Supabase

- 🚀 **Plus simple** : Pas besoin de gérer OAuth côté backend
- 🔒 **Plus sécurisé** : Tokens JWT gérés par Supabase
- ⚡ **Plus rapide** : Auth côté client, moins de requêtes serveur
- 📊 **Dashboard** : Interface pour gérer les utilisateurs
- 🆓 **Gratuit** : 50 000 utilisateurs actifs/mois sur le plan gratuit

## Documentation

- 📖 [Guide de Migration Complet](./MIGRATION_GUIDE.md)
- 📘 [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- 🔑 [Configuration OAuth](https://supabase.com/docs/guides/auth/social-login)

## Support

Si vous rencontrez des problèmes :

1. Vérifiez que toutes les variables d'environnement sont correctement définies
2. Vérifiez que les URLs de callback sont correctes
3. Consultez les logs Supabase dans le dashboard
4. Lisez le fichier [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) pour plus de détails

## Notes Importantes

⚠️ **Migration des utilisateurs existants** : Les utilisateurs devront se reconnecter ou réinitialiser leur mot de passe. Leurs données de profil seront conservées.

✅ **Production** : N'oubliez pas de mettre à jour les URLs de callback OAuth avec votre domaine de production dans Supabase, Google et LinkedIn.
