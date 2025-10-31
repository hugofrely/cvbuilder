# Mise à jour : Paiement Lifetime (Accès à vie)

## Changement effectué

Le système de paiement a été modifié pour supporter **deux paiements uniques** au lieu d'avoir un abonnement récurrent :

### Avant
- ❌ Paiement unique (2,40€) pour 1 CV
- ❌ Abonnement mensuel récurrent (24€/mois)

### Après
- ✅ Paiement unique (2,40€) pour 1 CV premium
- ✅ **Paiement unique (24€) pour accès Premium à vie**

## 🔧 Modifications techniques

### Backend

1. **`backend/payments/views.py`**
   - Remplacé `payment_type == 'monthly'` par `payment_type == 'lifetime'`
   - Le mode Stripe est maintenant `'payment'` (au lieu de `'subscription'`)
   - Webhook `checkout.session.completed` active directement `user.is_premium = True` et `subscription_type = 'lifetime'`

2. **`backend/payments/serializers.py`**
   - Choices: `['single', 'lifetime']` (au lieu de `['single', 'monthly', 'yearly']`)

3. **`backend/cvbuilder_backend/settings.py`**
   - Remplacé `STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID` par `STRIPE_LIFETIME_PREMIUM_PRICE_ID`
   - C'est maintenant un Price ID pour paiement unique

4. **`backend/users/models.py`**
   - Ajouté `'lifetime'` dans les choices de `subscription_type`
   - Migration créée et appliquée

### Frontend

1. **`frontend/app/payment/page.tsx`**
   - Titre: "Premium à Vie" (au lieu de "Premium Illimité")
   - Description: "Accès illimité permanent" avec mention "Paiement unique"
   - Type de paiement: `'lifetime'` (au lieu de `'monthly'`)
   - Texte: "Accès permanent • Aucun abonnement"

2. **`frontend/lib/api/payment.ts`**
   - Type: `'single' | 'lifetime'`

## 📋 Configuration Stripe

### Produits à créer dans Stripe Dashboard

**Produit 1 : CV Premium Export (inchangé)**
- Type : **One-time payment**
- Prix : 2,40 EUR
- Description : "Export PDF d'un CV avec modèle premium"

**Produit 2 : CVBuilder Premium Lifetime (NOUVEAU)**
- Type : **One-time payment** (⚠️ pas subscription!)
- Prix : 24,00 EUR
- Description : "Accès Premium à vie pour CVBuilder"

### Variables d'environnement à mettre à jour

```env
# Ancienne config (À SUPPRIMER)
# STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_xxx
# STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID=price_xxx

# Nouvelle config (À AJOUTER)
STRIPE_LIFETIME_PREMIUM_PRICE_ID=price_xxx  # Votre Price ID du produit lifetime
```

## 🎯 Flux de paiement Lifetime

```
┌─────────────────┐
│ Pricing Page    │
│                 │
│ Premium à Vie   │
│ 24€ (une fois)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Login Required  │
│ (si pas connecté)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Payment Page    │
│ ?plan=premium   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Stripe Checkout │
│ Mode: payment   │
│ (pas subscription)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Webhook         │
│ checkout.       │
│ session.        │
│ completed       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Backend         │
│ user.is_premium │
│ = True          │
│ subscription_   │
│ type='lifetime' │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Success Page    │
│ Accès Premium   │
│ activé À VIE    │
└─────────────────┘
```

## ✅ Avantages du paiement lifetime

### Pour l'utilisateur
- ✅ Paiement unique, aucun abonnement récurrent
- ✅ Pas de surprise sur le compte bancaire
- ✅ Accès permanent garanti
- ✅ Meilleure perception de la valeur (24€ vs 24€/mois)

### Pour le développeur
- ✅ Plus simple : Pas de gestion d'abonnements récurrents
- ✅ Pas de renouvellements automatiques
- ✅ Pas de gestion de période d'essai
- ✅ Pas d'annulation d'abonnement
- ✅ Moins de webhooks à gérer

### Pour Stripe
- ✅ Mode `payment` au lieu de `subscription`
- ✅ Moins de webhooks nécessaires
- ✅ Transaction plus simple

## 🔄 Webhooks simplifiés

### Webhooks utilisés (Lifetime)
- ✅ `checkout.session.completed` : Active le premium à vie
- ✅ `payment_intent.succeeded` : Confirme le paiement (optionnel)

### Webhooks NON utilisés (supprimés)
- ❌ `customer.subscription.created`
- ❌ `customer.subscription.updated`
- ❌ `customer.subscription.deleted`
- ❌ `invoice.payment_succeeded`
- ❌ `invoice.payment_failed`

**Note** : Les fonctions de webhook pour les abonnements sont toujours présentes dans le code pour compatibilité future, mais ne seront jamais appelées avec le système lifetime.

## 🗄️ Base de données

### Modèle User

```python
user.is_premium = True              # Actif
user.subscription_type = 'lifetime' # Type d'accès
user.subscription_start_date = now() # Date d'activation
user.subscription_end_date = None   # Pas de fin (à vie)
```

### Modèle Payment

```python
payment.payment_type = 'lifetime'   # Type de paiement
payment.status = 'succeeded'        # Statut
payment.amount = 24.00              # Montant
```

## 🧪 Test

Après avoir créé le produit dans Stripe Dashboard :

1. Allez sur `/pricing`
2. Cliquez sur "Premium à Vie" (24€)
3. Connectez-vous
4. Payez avec carte test : `4242 4242 4242 4242`
5. Vérifiez dans la base :
   ```python
   user = User.objects.get(email='votre@email.com')
   print(user.is_premium)  # True
   print(user.subscription_type)  # 'lifetime'
   ```

## 📝 Documentation mise à jour

Les fichiers de documentation suivants devront être mis à jour :
- ✅ `STRIPE_SETUP.md` - Mise à jour avec lifetime
- ✅ `TEST_STRIPE.md` - Mise à jour des instructions
- ✅ `.env.example` - Nouvelles variables

## ✅ Checklist de migration

- [x] Backend : Modifier `views.py` pour `lifetime`
- [x] Backend : Modifier `serializers.py`
- [x] Backend : Modifier `settings.py`
- [x] Backend : Ajouter 'lifetime' au modèle User
- [x] Backend : Créer et appliquer migration
- [x] Frontend : Modifier `payment/page.tsx`
- [x] Frontend : Modifier `lib/api/payment.ts`
- [x] Redémarrer le backend
- [ ] **Créer le produit Stripe Lifetime** (one-time payment)
- [ ] **Mettre à jour `.env`** avec `STRIPE_LIFETIME_PREMIUM_PRICE_ID`
- [ ] Tester le flux complet

---

**Date de modification** : 30 Octobre 2025
**Type de changement** : Subscription → One-time payment (Lifetime)
**Impact** : Simplification majeure du système de paiement
