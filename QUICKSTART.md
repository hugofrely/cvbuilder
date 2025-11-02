# 🚀 Démarrage Rapide - Supabase Auth

## ⏱️ 15 minutes pour être opérationnel

### 1. Créer un projet Supabase (3 min)

```bash
# Allez sur https://supabase.com
# Créez un compte
# Créez un nouveau projet
# Attendez 2-3 minutes que le projet soit prêt
```

### 2. Récupérer les clés (1 min)

Dans votre projet Supabase :
- **Settings > API**
  - Copiez `Project URL`
  - Copiez `anon public key`
  - Copiez `service_role key`
- **Settings > API > JWT Settings**
  - Copiez `JWT Secret`

### 3. Configurer les variables d'environnement (2 min)

#### Backend (`backend/.env`)
```bash
# Copiez backend/.env.example vers backend/.env
cp backend/.env.example backend/.env

# Éditez backend/.env et ajoutez vos clés Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=votre-secret-ici
```

#### Frontend (`frontend/.env.local`)
```bash
# Créez frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Installer les dépendances (3 min)

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 5. Lancer l'application (1 min)

```bash
# Terminal 1 - Backend
cd backend
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Tester (2 min)

Allez sur http://localhost:3000

✅ **Test basique (sans OAuth):**
- Créez un compte avec email/password
- Connectez-vous
- Déconnectez-vous

✅ **Tout fonctionne !** (pour l'instant, sans OAuth)

---

## 🔐 Configurer OAuth (Optionnel - 10 min)

### Google OAuth (5 min)

1. **Dans Supabase:**
   - Authentication > Providers > Google
   - Activez le provider

2. **Dans Google Cloud Console:**
   - Allez sur https://console.cloud.google.com/apis/credentials
   - Créez un projet ou utilisez un existant
   - Créez des credentials OAuth 2.0
   - Ajoutez l'URL de redirection: `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez Client ID et Client Secret

3. **Retour dans Supabase:**
   - Collez Client ID et Client Secret
   - Sauvegardez

4. **Testez:**
   - Cliquez sur "Sign in with Google"
   - Ça devrait fonctionner !

### LinkedIn OAuth (5 min)

1. **Dans Supabase:**
   - Authentication > Providers > LinkedIn (OIDC)
   - Activez le provider

2. **Dans LinkedIn Developers:**
   - Allez sur https://www.linkedin.com/developers/apps
   - Créez une application ou utilisez une existante
   - Dans "Auth" > "OAuth 2.0 settings"
   - Ajoutez l'URL de redirection: `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez Client ID et Client Secret

3. **Retour dans Supabase:**
   - Collez Client ID et Client Secret
   - Sauvegardez

4. **Testez:**
   - Cliquez sur "Sign in with LinkedIn"
   - Ça devrait fonctionner !

---

## ✅ Vérification Complète

### Test Email/Password
```bash
# 1. Inscription
- Allez sur http://localhost:3000/auth/register
- Créez un compte
- ✅ Devrait vous rediriger vers /builder

# 2. Connexion
- Déconnectez-vous
- Allez sur /auth/login
- Connectez-vous
- ✅ Devrait vous rediriger vers /builder
```

### Test Google OAuth
```bash
- Cliquez sur "Sign in with Google"
- ✅ Devrait ouvrir une popup Google
- ✅ Après autorisation, devrait vous connecter
```

### Test LinkedIn OAuth
```bash
- Cliquez sur "Sign in with LinkedIn"
- ✅ Devrait ouvrir une popup LinkedIn
- ✅ Après autorisation, devrait vous connecter
```

---

## 🐛 Problèmes Courants

### "Missing Supabase environment variables"
```bash
# Vérifiez que toutes les variables sont dans vos fichiers .env
cat backend/.env | grep SUPABASE
cat frontend/.env.local | grep SUPABASE
```

### "Invalid token" ou "Token expired"
```bash
# Vérifiez le SUPABASE_JWT_SECRET
# Il doit être exactement celui de votre projet Supabase
```

### OAuth ne fonctionne pas
```bash
# 1. Vérifiez que les providers sont activés dans Supabase
# 2. Vérifiez les URLs de redirection
# 3. Vérifiez que vous avez bien copié/collé Client ID et Secret
```

### Erreur de migration Django
```bash
cd backend
python manage.py migrate --fake-initial
```

---

## 📚 Documentation Complète

| Document | Usage |
|----------|-------|
| **QUICKSTART.md** (ce fichier) | Démarrage rapide |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Guide de configuration détaillé |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Guide technique complet |
| [CHANGELOG_SUPABASE.md](./CHANGELOG_SUPABASE.md) | Liste des changements |
| [README_SUPABASE.md](./README_SUPABASE.md) | Vue d'ensemble |

---

## 🎯 Prochaines Étapes

Une fois que tout fonctionne en local :

1. ⏳ **Personnaliser les emails** (Supabase > Auth > Email Templates)
2. ⏳ **Configurer le domaine** pour la production
3. ⏳ **Mettre à jour les URLs OAuth** en production
4. ⏳ **Tester en production**

---

**C'est tout ! Vous êtes prêt à développer. 🚀**

Des questions ? Consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
