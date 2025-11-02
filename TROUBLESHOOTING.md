# 🔧 Guide de Dépannage - Authentification Supabase

## Problème: "Je ne suis pas connecté après l'authentification"

### ✅ Corrections Apportées

J'ai corrigé les problèmes suivants:

1. **Store d'authentification** - Ne vérifiait pas correctement l'état connecté
2. **Intercepteur Axios** - Essayait d'utiliser l'ancien endpoint `/auth/refresh/`
3. **Synchronisation** - Ne mettait pas à jour l'utilisateur dans le store

### 🔍 Vérifications à Faire

#### 1. Vérifier les Variables d'Environnement

**Backend (.env):**
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
SUPABASE_JWT_SECRET=xxxxx
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 2. Redémarrer les Serveurs

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
# Effacer le cache
rm -rf .next
npm run dev
```

#### 3. Vider le Cache du Navigateur

1. Ouvrez les outils de développement (F12)
2. Application > Storage > Clear site data
3. Rechargez la page (Cmd+R ou Ctrl+R)

### 📋 Checklist de Dépannage

#### Problème: OAuth Google/LinkedIn ne fonctionne pas

**Symptômes:**
- Redirection vers provider OK
- Retour sur `/auth/callback` OK
- Mais pas connecté

**Solution:**

1. **Vérifier que le provider est activé dans Supabase**
   ```
   Supabase Dashboard > Authentication > Providers
   → Google: Enabled
   → LinkedIn (OIDC): Enabled
   ```

2. **Vérifier les URLs de callback**
   - Dans Supabase: `https://your-project.supabase.co/auth/v1/callback`
   - Dans Google Console: `https://your-project.supabase.co/auth/v1/callback`
   - Dans LinkedIn: `https://your-project.supabase.co/auth/v1/callback`

3. **Vérifier les logs de la console**
   ```javascript
   // Ouvrez la console navigateur (F12)
   // Vous devriez voir:
   [AuthService] Auth state changed: SIGNED_IN
   [AuthService] Syncing with backend...
   [AuthService] Sync response: { user: {...} }
   [AuthService] User set in store: user@example.com
   ```

4. **Vérifier la réponse du backend**
   ```bash
   # Dans le terminal backend, vous devriez voir:
   POST /api/auth/sync/ 200 OK
   ```

#### Problème: Email/Password ne fonctionne pas

**Symptômes:**
- Formulaire de connexion soumis
- Pas d'erreur
- Mais pas connecté

**Solution:**

1. **Vérifier que l'utilisateur existe dans Supabase**
   ```
   Supabase Dashboard > Authentication > Users
   ```

2. **Vérifier les logs**
   ```javascript
   // Console navigateur
   [AuthService] Login successful
   [AuthService] Syncing with backend...
   [AuthService] User set in store
   ```

3. **Test manuel de l'API**
   ```bash
   # 1. Connexion Supabase
   curl -X POST https://your-project.supabase.co/auth/v1/token \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","grant_type":"password"}'

   # 2. Test sync backend
   curl -X POST http://localhost:8000/api/auth/sync/ \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

#### Problème: "Invalid token" dans le backend

**Symptômes:**
- Erreur 401 dans la console
- Backend logs: "Invalid token"

**Solution:**

1. **Vérifier le SUPABASE_JWT_SECRET**
   ```bash
   # Il doit être EXACTEMENT celui de votre projet Supabase
   # Settings > API > JWT Settings > JWT Secret
   ```

2. **Vérifier le format du token**
   ```javascript
   // Console navigateur
   console.log(useAuthStore.getState().accessToken);
   // Devrait commencer par: eyJhbGc...
   ```

3. **Vérifier l'authentification backend**
   ```python
   # backend/cvbuilder_backend/settings.py
   REST_FRAMEWORK = {
       'DEFAULT_AUTHENTICATION_CLASSES': (
           'cvbuilder_backend.authentication.SupabaseAuthentication',
       ),
   }
   ```

### 🐛 Problèmes Courants et Solutions

#### 1. Session Supabase non détectée

**Symptôme:** Page callback timeout

**Solution:**
```typescript
// Vérifier dans /auth/callback/page.tsx
const session = await authService.getSession();
console.log('Session:', session); // Devrait afficher la session

// Si null, vérifier:
// 1. URL de callback correcte dans Supabase
// 2. Provider activé
// 3. Credentials corrects
```

#### 2. User Django non créé

**Symptôme:** Erreur dans `/api/auth/sync/`

**Solution:**
```bash
# Vérifier les logs backend
# Devrait voir: "Creating Django user for email@example.com"

# Si erreur de migration:
cd backend
python manage.py migrate
```

#### 3. Store non mis à jour

**Symptôme:** `useAuthStore.getState().isAuthenticated === false`

**Solution:**
```javascript
// Console navigateur
import { useAuthStore } from '@/lib/stores/useAuthStore';

// Vérifier l'état
console.log(useAuthStore.getState());
// Devrait afficher: { user: {...}, accessToken: "...", isAuthenticated: true }

// Si user est null:
// 1. Vérifier que syncWithBackend() est appelé
// 2. Vérifier que setUser() est appelé
// 3. Vérifier les logs de la console
```

### 🔄 Flux Complet d'Authentification

#### OAuth (Google/LinkedIn)

```
1. Clic sur bouton OAuth
   → authService.signInWithGoogle()

2. Redirection vers Google
   → User se connecte

3. Callback vers Supabase
   → Supabase crée session

4. Redirection vers /auth/callback
   → Page attend session (max 5s)

5. Session détectée
   → authService.getSession() retourne session

6. Sync avec backend
   → POST /api/auth/sync/ avec access_token

7. Backend valide token
   → SupabaseAuthentication vérifie JWT
   → Crée/met à jour user Django

8. Frontend reçoit user
   → setUser() dans store
   → isAuthenticated = true

9. Redirection vers /builder
   → User connecté ✅
```

#### Email/Password

```
1. Soumission formulaire
   → authService.login()

2. Appel Supabase
   → supabase.auth.signInWithPassword()

3. Supabase retourne session
   → avec access_token

4. Sync avec backend
   → syncWithBackend(access_token)

5. Store mis à jour
   → setUser()
   → isAuthenticated = true

6. User connecté ✅
```

### 📊 Debugging Checklist

Cochez ce qui fonctionne:

**Frontend:**
- [ ] Variables d'environnement définies
- [ ] Supabase client initialisé
- [ ] Formulaire de connexion s'affiche
- [ ] Boutons OAuth s'affichent
- [ ] Clic sur OAuth redirige vers provider
- [ ] Retour sur /auth/callback
- [ ] Session Supabase détectée
- [ ] Store mis à jour (accessToken présent)
- [ ] User défini dans store
- [ ] isAuthenticated = true
- [ ] Redirection vers /builder

**Backend:**
- [ ] Variables d'environnement définies
- [ ] Serveur démarre sans erreur
- [ ] Endpoint /api/auth/sync/ existe
- [ ] JWT_SECRET correct
- [ ] SupabaseAuthentication configurée
- [ ] Token validé correctement
- [ ] User créé/trouvé dans Django
- [ ] Réponse 200 OK

### 🆘 Toujours Bloqué ?

1. **Activer le mode debug complet**

   **Frontend (.env.local):**
   ```bash
   NEXT_PUBLIC_DEBUG=true
   ```

   **Backend (.env):**
   ```bash
   DEBUG=True
   ```

2. **Vérifier les logs Supabase**
   ```
   Supabase Dashboard > Logs > Auth Logs
   ```

3. **Tester directement l'API Supabase**
   ```bash
   # Test auth
   curl -X POST https://your-project.supabase.co/auth/v1/token \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","grant_type":"password"}'
   ```

4. **Recréer le projet Supabase**
   - Si les credentials ne fonctionnent vraiment pas
   - Créer un nouveau projet
   - Mettre à jour les clés

### 📝 Rapporter un Problème

Si le problème persiste, collectez ces informations:

1. **Logs console navigateur** (F12 > Console)
2. **Logs serveur backend**
3. **Variables d'environnement** (sans les valeurs sensibles)
4. **Étape où ça bloque** (selon le flux ci-dessus)
5. **Erreurs exactes** (screenshots/copier-coller)

---

**Dernière mise à jour:** 2025-11-02
