# 🧹 Nettoyage des Références django-allauth

## ❌ Problème

Lors du déploiement en production, l'erreur suivante apparaissait:

```
ModuleNotFoundError: No module named 'allauth'
```

**Cause:** Bien que `django-allauth` ait été supprimé de `requirements.txt` lors de la migration vers Supabase, certains fichiers Python continuaient à importer ce module.

## ✅ Solution Appliquée

### Fichiers Modifiés

#### 1. [backend/users/signals.py](backend/users/signals.py)

**Avant:**
```python
from allauth.socialaccount.signals import pre_social_login
from allauth.account.signals import user_signed_up

@receiver(pre_social_login)
def link_anonymous_resumes_on_social_login(...):
    ...

@receiver(user_signed_up)
def link_anonymous_resumes_on_signup(...):
    ...
```

**Après:**
```python
# Note: With Supabase authentication, user login/signup is handled on the frontend.
# Anonymous resume linking is now done via the /api/resumes/migrate-anonymous/ endpoint
# which is called from the frontend after successful authentication.

# Seul le signal post_save pour update_user_premium_status est conservé
```

**Justification:** Avec Supabase, l'authentification se fait côté frontend. Les signaux allauth pour lier les CV anonymes ne sont plus nécessaires car cette logique est maintenant gérée par l'endpoint `/api/resumes/migrate-anonymous/` appelé depuis le frontend.

#### 2. [backend/users/apps.py](backend/users/apps.py)

**Avant:**
```python
def ready(self):
    import users.signals

    # Patch allauth models to use UUID
    from allauth.socialaccount import models as socialaccount_models
    from allauth.account import models as account_models

    def replace_id_field_with_uuid(model_class):
        ...

    replace_id_field_with_uuid(socialaccount_models.SocialAccount)
    ...
```

**Après:**
```python
def ready(self):
    """Import signals when app is ready"""
    import users.signals  # noqa
```

**Justification:** Le patching des modèles allauth pour utiliser des UUID n'est plus nécessaire car allauth n'est plus utilisé.

### Fichiers Supprimés

#### 1. `backend/users/adapters.py` ❌ SUPPRIMÉ

**Contenu (avant suppression):**
```python
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    ...

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    ...
```

**Justification:** Ces adapters personnalisés étaient utilisés pour customiser le comportement d'allauth. Avec Supabase, toute la logique d'authentification est gérée côté frontend et ces adapters ne sont plus nécessaires.

#### 2. `backend/users/oauth_views.py` ❌ SUPPRIMÉ

**Contenu (avant suppression):**
```python
class GoogleLoginView(APIView):
    """Initiate Google OAuth login"""
    ...

class LinkedInLoginView(APIView):
    """Initiate LinkedIn OAuth login"""
    ...
```

**Justification:** Ces vues Django géraient l'OAuth côté backend. Avec Supabase, l'OAuth est géré directement par Supabase et appelé depuis le frontend via `supabase.auth.signInWithOAuth()`.

### Fichiers Non Modifiés (OK)

Les migrations dans `backend/users/migrations/` qui mentionnent allauth ont été **conservées** car:
- Les migrations sont historiques et ne doivent pas être modifiées
- Elles ne causent pas d'erreur car elles ne sont pas réexécutées
- Elles documentent l'évolution de la base de données

## 🔄 Flux d'Authentification

### Avant (django-allauth)

```
Frontend → Backend OAuth Views → Google/LinkedIn
                ↓
        Django Session créée
                ↓
        JWT tokens générés
                ↓
        Signaux allauth déclenchés
                ↓
        CV anonymes liés
```

### Après (Supabase)

```
Frontend → Supabase Auth → Google/LinkedIn
                ↓
        Session Supabase créée
                ↓
        Frontend sync avec Backend
                ↓
        User Django créé/mis à jour
                ↓
        Frontend appelle /resumes/migrate-anonymous/
                ↓
        CV anonymes liés
```

## 📋 Checklist de Vérification

- [x] **Supprimé les imports allauth** de `signals.py`
- [x] **Supprimé le code allauth** de `apps.py`
- [x] **Supprimé** `adapters.py`
- [x] **Supprimé** `oauth_views.py`
- [x] **Vérifié** que `python manage.py check` passe sans erreur
- [x] **Migrations** conservées (historique)
- [x] **Documenté** les changements

## 🚀 Déploiement

Après ces modifications, le backend peut être déployé sans erreur `ModuleNotFoundError: No module named 'allauth'`.

### Commandes de Déploiement

```bash
# 1. Build l'image backend
docker build -t registry.frely.fr/cvbuilder-backend:latest ./backend

# 2. Push l'image
docker push registry.frely.fr/cvbuilder-backend:latest

# 3. Mettre à jour le service
docker service update --force cvbuilder_backend
docker service update --force cvbuilder_celery

# 4. Vérifier les logs
docker service logs -f cvbuilder_backend --tail 50
```

## 🐛 Dépannage

### Erreur: "No module named 'allauth'"

**Solution:** Vérifiez qu'aucun fichier Python n'importe allauth:

```bash
cd backend
grep -r "from allauth" --include="*.py" --exclude-dir=migrations .
grep -r "import allauth" --include="*.py" --exclude-dir=migrations .
```

Si des fichiers sont trouvés, supprimez les imports et adaptez le code.

### Erreur: "Cannot import name 'X' from 'users.adapters'"

**Solution:** Si d'autres fichiers importaient depuis `adapters.py`, supprimez ces imports. Ce fichier n'existe plus.

### Les migrations échouent

**Solution:** Les migrations mentionnant allauth sont normales et ne devraient pas échouer. Si elles échouent:
1. Vérifiez que la base de données est à jour
2. Les tables allauth peuvent rester en base (elles sont juste inutilisées)
3. Vous pouvez éventuellement les supprimer manuellement si nécessaire

## 📚 Fichiers de Documentation Connexes

- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guide complet de la migration Supabase
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Configuration de Supabase
- [SUPABASE_PRODUCTION_SETUP.md](SUPABASE_PRODUCTION_SETUP.md) - Configuration production
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Dépannage authentification

## ✅ Résultat

Le backend peut maintenant démarrer en production sans dépendre de `django-allauth`. L'authentification est entièrement gérée par Supabase côté frontend, avec synchronisation des utilisateurs vers Django via l'endpoint `/api/auth/sync/`.

---

**Dernière mise à jour:** 2025-11-02
