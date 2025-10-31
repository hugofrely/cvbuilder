# Configuration Stripe - CVBuilder

Ce guide explique comment configurer Stripe pour le système de paiement de CVBuilder.

## Vue d'ensemble

CVBuilder utilise Stripe pour gérer deux types de paiements :

1. **Paiement unique (Pay-per-CV)** : 2,40€ pour un export PDF premium
2. **Abonnement Premium** : 24€/mois pour un accès illimité

## Prérequis

- Compte Stripe (https://stripe.com)
- Clés API Stripe (test et production)

## 1. Créer un compte Stripe

1. Allez sur https://stripe.com et créez un compte
2. Activez votre compte Stripe (vérification d'identité pour le mode production)
3. Récupérez vos clés API dans Dashboard > Developers > API keys

## 2. Créer les produits dans Stripe Dashboard

### Produit 1 : Paiement par CV Premium

1. Allez dans **Products** > **Add product**
2. Configurez :
   - **Name** : "CV Premium - Export PDF"
   - **Description** : "Export PDF d'un CV avec modèle premium"
   - **Pricing** :
     - Type: **One time**
     - Price: **2.40 EUR**
   - Cliquez sur **Save product**
3. **Copiez le Price ID** (commence par `price_...`)

### Produit 2 : Abonnement Premium

1. Allez dans **Products** > **Add product**
2. Configurez :
   - **Name** : "CVBuilder Premium"
   - **Description** : "Accès illimité à tous les modèles premium"
   - **Pricing** :
     - Type: **Recurring**
     - Billing period: **Monthly**
     - Price: **24.00 EUR**
   - Cliquez sur **Save product**
3. **Copiez le Price ID** (commence par `price_...`)

## 3. Configurer les webhooks

Les webhooks permettent à Stripe de notifier votre application des événements de paiement.

### Configuration locale (développement)

1. Installez Stripe CLI : https://stripe.com/docs/stripe-cli
2. Connectez-vous : `stripe login`
3. Lancez le tunnel :
   ```bash
   stripe listen --forward-to localhost:8000/api/payments/webhook/
   ```
4. Copiez le **webhook signing secret** (commence par `whsec_...`)

### Configuration production

1. Allez dans **Developers** > **Webhooks** > **Add endpoint**
2. Configurez :
   - **Endpoint URL** : `https://votredomaine.com/api/payments/webhook/`
   - **Events to send** :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Cliquez sur **Add endpoint**
4. **Copiez le webhook signing secret** (commence par `whsec_...`)

## 4. Variables d'environnement

Créez ou mettez à jour le fichier `.env` dans le dossier `backend/` :

```env
# Stripe Keys (Test Mode)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_SINGLE_CV_PRICE_ID=price_...        # ID du produit "CV Premium"
STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_... # ID du produit "Premium Monthly"
STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID=price_...  # (optionnel) pour yearly

# Frontend URL (pour les redirections)
FRONTEND_URL=http://localhost:3000
```

### Mode Production

Remplacez les clés de test par les clés de production :
- `pk_test_...` → `pk_live_...`
- `sk_test_...` → `sk_live_...`
- Webhook secret de production

## 5. Structure du système de paiement

### Backend

- **Models** (`backend/payments/models.py`) :
  - `Payment` : Enregistre toutes les transactions
  - `Subscription` : Gère les abonnements actifs
  - `WebhookEvent` : Logs des événements webhook (débogage)

- **Views** (`backend/payments/views.py`) :
  - `CreateCheckoutSessionView` : Crée une session Stripe Checkout
  - `StripeWebhookView` : Traite les événements webhook
  - `PaymentListView` : Historique des paiements utilisateur
  - `SubscriptionDetailView` : Détails de l'abonnement
  - `CancelSubscriptionView` : Annulation d'abonnement

- **Endpoints** :
  - `POST /api/payments/create-checkout/` : Créer une session de paiement
  - `POST /api/payments/webhook/` : Webhook Stripe
  - `GET /api/payments/payments/` : Liste des paiements
  - `GET /api/payments/subscription/` : Détails de l'abonnement
  - `POST /api/payments/subscription/cancel/` : Annuler l'abonnement

### Frontend

- **Service** (`frontend/lib/api/payment.ts`) :
  - `createCheckoutSession()` : Démarre le processus de paiement
  - `getPayments()` : Récupère l'historique
  - `getSubscription()` : Récupère l'abonnement actif
  - `cancelSubscription()` : Annule l'abonnement

- **Pages** :
  - `/payment` : Page de sélection de paiement
  - `/payment/success` : Confirmation de paiement réussi
  - `/payment/cancel` : Paiement annulé
  - `/pricing` : Page des tarifs

## 6. Flux de paiement

### Paiement unique (CV Premium)

1. Utilisateur clique sur "Export PDF" d'un CV premium
2. Redirection vers `/payment?plan=pay-per-download&resumeId=123`
3. Frontend appelle `POST /api/payments/create-checkout/`
4. Backend crée une session Stripe Checkout
5. Utilisateur redirigé vers Stripe pour payer
6. Après paiement, Stripe redirige vers `/payment/success`
7. Webhook Stripe notifie le backend (`checkout.session.completed`)
8. Backend marque le CV comme payé (`resume.is_paid = True`)
9. Utilisateur peut maintenant exporter le PDF

### Abonnement Premium

1. Utilisateur choisit "Premium" sur `/pricing`
2. Redirection vers `/payment?plan=premium`
3. Frontend appelle `POST /api/payments/create-checkout/`
4. Backend crée une session Stripe Checkout (mode subscription)
5. Utilisateur redirigé vers Stripe pour payer
6. Après paiement, Stripe redirige vers `/payment/success`
7. Webhook Stripe notifie le backend (`customer.subscription.created`)
8. Backend crée un objet `Subscription` et active `user.is_premium = True`
9. Utilisateur a maintenant accès à tous les templates premium

## 7. Vérification du paiement dans l'export PDF

Le endpoint `/api/resumes/{id}/export_pdf/` vérifie automatiquement :

```python
if template.is_premium:
    # Vérifier si l'utilisateur est premium OU si le CV est payé
    user_is_premium = request.user.is_premium if request.user.is_authenticated else False
    cv_is_paid = resume.is_paid

    if not user_is_premium and not cv_is_paid:
        return Response(status=402)  # Payment Required
```

## 8. Tester le système

### Mode Test Stripe

Utilisez les cartes de test Stripe :
- **Succès** : `4242 4242 4242 4242`
- **Décliné** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`
- Date d'expiration : N'importe quelle date future
- CVC : N'importe quel 3 chiffres

### Vérifier les webhooks

1. Lancez Stripe CLI : `stripe listen --forward-to localhost:8000/api/payments/webhook/`
2. Effectuez un paiement test
3. Vérifiez les logs dans Stripe CLI
4. Vérifiez dans Django admin que :
   - Un objet `Payment` a été créé
   - Le status est "succeeded"
   - Pour les CV uniques : `resume.is_paid = True`
   - Pour les abonnements : `user.is_premium = True`

## 9. Déploiement en production

### Checklist avant production

- [ ] Remplacer les clés de test par les clés de production
- [ ] Configurer le webhook de production avec l'URL correcte
- [ ] Tester avec une vraie carte en mode production (petit montant)
- [ ] Vérifier que les webhooks arrivent correctement
- [ ] Activer les emails de confirmation Stripe
- [ ] Configurer la facturation automatique
- [ ] Tester le flow complet de bout en bout

### Variables d'environnement production

```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Secret du webhook de production
STRIPE_SINGLE_CV_PRICE_ID=price_...
STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_...
FRONTEND_URL=https://votredomaine.com
```

## 10. Monitoring et maintenance

### Dashboard Stripe

- Consultez régulièrement le Dashboard Stripe
- Vérifiez les paiements et abonnements
- Surveillez les échecs de paiement
- Consultez les logs des webhooks

### Logs Django

Les événements webhook sont enregistrés dans le modèle `WebhookEvent` pour audit et débogage.

```python
# Voir les webhooks reçus
WebhookEvent.objects.all().order_by('-created_at')

# Voir les webhooks en erreur
WebhookEvent.objects.filter(processed=False)
```

## 11. Support et documentation

- Documentation Stripe : https://stripe.com/docs
- Stripe CLI : https://stripe.com/docs/stripe-cli
- API Reference : https://stripe.com/docs/api
- Testing : https://stripe.com/docs/testing

## Résumé des commandes

```bash
# Installation Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login Stripe CLI
stripe login

# Écouter les webhooks localement
stripe listen --forward-to localhost:8000/api/payments/webhook/

# Déclencher un événement test
stripe trigger checkout.session.completed

# Voir les logs
stripe logs tail
```

---

Le système de paiement est maintenant configuré et prêt à être utilisé ! 🎉
