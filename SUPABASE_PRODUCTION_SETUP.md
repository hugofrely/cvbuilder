# 🚀 Configuration Supabase pour la Production

## ❌ Problème

Après connexion Google/LinkedIn en production (bidly.fr), vous êtes redirigé vers `http://localhost:3000` au lieu de rester sur `https://bidly.fr`.

## ✅ Solution

### Étape 1: Configurer les URLs dans Supabase Dashboard

1. **Allez dans votre Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/yxkhydsttvkkkpqhjwtx

2. **Authentication → URL Configuration**

   Cliquez sur **Authentication** dans la sidebar, puis **URL Configuration**

3. **Site URL** (URL principale)
   ```
   https://bidly.fr
   ```
   ⚠️ Important: Pas de trailing slash, pas de www

4. **Redirect URLs** (URLs autorisées pour les callbacks OAuth)

   Ajoutez ces URLs (une par ligne):
   ```
   https://bidly.fr/auth/callback
   https://www.bidly.fr/auth/callback
   http://localhost:3000/auth/callback
   ```

   📝 Notes:
   - `https://bidly.fr/auth/callback` - Production principale
   - `https://www.bidly.fr/auth/callback` - Avec www (au cas où)
   - `http://localhost:3000/auth/callback` - Pour développement local

5. **Cliquez sur "Save"**

### Étape 2: Vérifier la configuration OAuth des providers

#### Google OAuth

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Google**

2. Vérifiez que **Authorized redirect URIs** dans Google Cloud Console contient:
   ```
   https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback
   ```

3. **Google Cloud Console** → APIs & Services → Credentials → OAuth 2.0 Client

   Authorized redirect URIs devrait avoir:
   ```
   https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback
   ```

   ⚠️ Ne PAS ajouter `https://bidly.fr/auth/callback` ici, c'est Supabase qui gère

#### LinkedIn OAuth

1. **Supabase Dashboard** → **Authentication** → **Providers** → **LinkedIn (OIDC)**

2. Vérifiez que **Authorized redirect URLs** dans LinkedIn Developer Portal contient:
   ```
   https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback
   ```

3. **LinkedIn Developer Portal** → Your App → Auth

   Redirect URLs devrait avoir:
   ```
   https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback
   ```

### Étape 3: Tester

1. **Vider le cache du navigateur**
   ```
   Cmd+Shift+Delete (Mac) ou Ctrl+Shift+Delete (Windows)
   → Supprimer les cookies et données de site
   ```

2. **Tester la connexion Google**
   - Allez sur https://bidly.fr/auth/login
   - Cliquez sur "Continuer avec Google"
   - Après authentification, vous devriez être redirigé vers `https://bidly.fr/auth/callback`
   - Puis automatiquement vers `https://bidly.fr/builder`

3. **Tester la connexion LinkedIn**
   - Même processus avec LinkedIn

## 🔍 Comprendre le Flux OAuth

Voici comment ça fonctionne:

```
1. User clique "Continuer avec Google" sur https://bidly.fr
   ↓
2. Frontend appelle supabase.auth.signInWithOAuth({
     provider: 'google',
     options: { redirectTo: 'https://bidly.fr/auth/callback' }
   })
   ↓
3. Supabase redirige vers Google avec:
   - redirect_uri = https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback
   - final_redirect = https://bidly.fr/auth/callback (stocké par Supabase)
   ↓
4. User se connecte sur Google
   ↓
5. Google redirige vers Supabase:
   https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback?code=...
   ↓
6. Supabase crée la session, puis redirige vers:
   https://bidly.fr/auth/callback#access_token=...
   ↓
7. Page /auth/callback détecte la session et redirige vers /builder
```

## 🐛 Dépannage

### Problème: Toujours redirigé vers localhost

**Causes possibles:**

1. **Site URL mal configuré dans Supabase**
   - Vérifiez que c'est bien `https://bidly.fr` (pas localhost)
   - Pas de trailing slash

2. **Cache du navigateur**
   - Videz le cache et les cookies
   - Essayez en navigation privée

3. **Redirect URL pas autorisée**
   - Vérifiez que `https://bidly.fr/auth/callback` est dans la liste des Redirect URLs

4. **Variables d'environnement frontend**
   - Vérifiez que le frontend build utilise les bonnes variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://yxkhydsttvkkkpqhjwtx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### Problème: Error "redirect_uri_mismatch" depuis Google

**Solution:**
- Dans Google Cloud Console, vérifiez que `https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback` est bien dans les Authorized redirect URIs
- Pas `https://bidly.fr/auth/callback` (c'est Supabase qui gère)

### Problème: Session non détectée sur /auth/callback

**Vérifications:**
1. Ouvrez la console (F12) sur la page /auth/callback
2. Regardez les logs - vous devriez voir:
   ```
   Starting Supabase OAuth callback...
   Waiting for Supabase session...
   Session established, loading user data...
   ```

3. Si "Timeout: Session not established":
   - La redirect URL n'est peut-être pas autorisée dans Supabase
   - Le provider (Google/LinkedIn) n'est peut-être pas activé

## 📋 Checklist Configuration

- [ ] **Supabase Dashboard**
  - [ ] Site URL = `https://bidly.fr`
  - [ ] Redirect URLs contient `https://bidly.fr/auth/callback`
  - [ ] Redirect URLs contient `https://www.bidly.fr/auth/callback`
  - [ ] Redirect URLs contient `http://localhost:3000/auth/callback` (dev)

- [ ] **Google Cloud Console**
  - [ ] Provider Google activé dans Supabase
  - [ ] Authorized redirect URIs = `https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback`

- [ ] **LinkedIn Developer Portal**
  - [ ] Provider LinkedIn (OIDC) activé dans Supabase
  - [ ] Redirect URLs = `https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback`

- [ ] **Frontend Production**
  - [ ] Variables d'environnement correctes dans le build
  - [ ] Image Docker rebuildée après changement des variables
  - [ ] Service redéployé sur Docker Swarm

- [ ] **Tests**
  - [ ] Cache navigateur vidé
  - [ ] Connexion Google fonctionne
  - [ ] Connexion LinkedIn fonctionne
  - [ ] Redirection vers /builder après connexion

## 🔄 Commandes Utiles

### Rebuild et Redeploy Frontend

```bash
# 1. Rebuild l'image avec les bonnes variables
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.bidly.fr \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://yxkhydsttvkkkpqhjwtx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_... \
  -t registry.frely.fr/cvbuilder-frontend:latest \
  ./frontend

# 2. Push l'image
docker push registry.frely.fr/cvbuilder-frontend:latest

# 3. Mettre à jour le service
docker service update --force cvbuilder_frontend
```

### Voir les logs du frontend

```bash
docker service logs -f cvbuilder_frontend --tail 100
```

## 📚 Documentation Supabase

- [Auth Configuration](https://supabase.com/docs/guides/auth/redirect-urls)
- [OAuth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [OAuth with LinkedIn](https://supabase.com/docs/guides/auth/social-login/auth-linkedin)

---

## 🎯 Résumé en 3 Points

1. **Configurer dans Supabase Dashboard**:
   - Site URL: `https://bidly.fr`
   - Redirect URLs: `https://bidly.fr/auth/callback`

2. **Vérifier les OAuth providers**:
   - Google: redirect_uri = `https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback`
   - LinkedIn: redirect_uri = `https://yxkhydsttvkkkpqhjwtx.supabase.co/auth/v1/callback`

3. **Tester**:
   - Vider le cache
   - Se connecter avec Google/LinkedIn
   - Vérifier la redirection vers bidly.fr

---

**Dernière mise à jour:** 2025-11-02
