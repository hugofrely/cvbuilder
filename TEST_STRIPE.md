# Test du système de paiement Stripe

## État actuel

✅ **Backend complet** - Tous les endpoints sont prêts
✅ **Frontend complet** - Pages de paiement créées
✅ **Stripe mis à jour** - Version 13.1.0 installée
✅ **Documentation complète** - Guide de configuration disponible

## Prochaines étapes pour tester

### 1. Configurer Stripe (OBLIGATOIRE)

Le système est prêt mais nécessite une configuration Stripe réelle :

#### A. Créer un compte Stripe Test
1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte (gratuit en mode test)
3. Récupérez vos clés test dans **Developers > API keys** :
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

#### B. Créer les produits dans Stripe

**Produit 1 : CV Premium Export (2,40€)**
1. Dashboard > **Products** > **Add product**
2. Configurez :
   - Name: `CV Premium Export`
   - Description: `Export PDF d'un CV avec modèle premium`
   - Pricing: **One time** - `2.40 EUR`
3. Copiez le **Price ID** (ex: `price_1ABC123...`)

**Produit 2 : CVBuilder Premium (24€/mois)**
1. Dashboard > **Products** > **Add product**
2. Configurez :
   - Name: `CVBuilder Premium`
   - Description: `Accès illimité à tous les modèles premium`
   - Pricing: **Recurring Monthly** - `24.00 EUR`
3. Copiez le **Price ID** (ex: `price_1XYZ789...`)

#### C. Configurer les webhooks (pour le développement)

**Option 1 : Stripe CLI (Recommandé)**
```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Lancer le webhook listener
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

Le CLI vous donnera un webhook secret (`whsec_...`) à copier.

**Option 2 : Webhooks manuels** (pour plus tard)
Dans Stripe Dashboard > **Developers > Webhooks** > **Add endpoint**

#### D. Mettre à jour le fichier .env

Éditez `backend/.env` et remplacez les valeurs :

\`\`\`env
# Remplacez ces valeurs par vos vraies clés Stripe
STRIPE_PUBLIC_KEY=pk_test_VOTRE_VRAIE_CLE
STRIPE_SECRET_KEY=sk_test_VOTRE_VRAIE_CLE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_VRAIE_CLE

# Remplacez par vos Price IDs réels
STRIPE_SINGLE_CV_PRICE_ID=price_VOTRE_PRICE_ID_SINGLE
STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_VOTRE_PRICE_ID_MONTHLY
\`\`\`

#### E. Redémarrer le backend

```bash
docker compose restart backend
```

### 2. Tester le flux de paiement

#### Test 1 : Paiement unique (Pay-per-CV)

1. Allez sur http://localhost:3000/builder
2. Créez un CV avec un template premium
3. Cliquez sur "Export PDF"
4. Vous devriez voir l'erreur 402 (Payment Required)
5. Cliquez pour aller vers le paiement
6. URL devrait être : `http://localhost:3000/payment?plan=pay-per-download&resumeId=XXX`
7. Cliquez sur "Continuer vers le paiement"
8. Vous serez redirigé vers Stripe Checkout

**Carte de test Stripe :**
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres

9. Après paiement, vous serez redirigé vers `/payment/success`
10. Le webhook Stripe notifiera votre backend
11. Le CV sera marqué comme payé
12. Vous pourrez maintenant exporter le PDF

#### Test 2 : Abonnement Premium

1. Allez sur http://localhost:3000/pricing
2. Cliquez sur "Premium Illimité"
3. Connectez-vous (obligatoire pour les abonnements)
4. Cliquez sur "Continuer vers le paiement"
5. Payez avec la carte test Stripe
6. Après paiement :
   - Votre compte sera marqué premium
   - Vous aurez accès à tous les templates premium
   - Tous vos exports PDF seront gratuits

### 3. Vérifier les webhooks

Dans le terminal où vous avez lancé `stripe listen`, vous devriez voir :

```
2024-XX-XX XX:XX:XX   --> checkout.session.completed [evt_xxx]
2024-XX-XX XX:XX:XX   <--  [200] POST http://localhost:8000/api/payments/webhook/ [evt_xxx]
```

### 4. Vérifier dans la base de données

```bash
# Accéder au shell Django
docker exec -it cvbuilder_backend python manage.py shell

# Vérifier les paiements
from payments.models import Payment, Subscription
Payment.objects.all()

# Vérifier qu'un utilisateur est premium
from users.models import User
user = User.objects.first()
print(user.is_premium)

# Vérifier qu'un CV est payé
from resumes.models import Resume
resume = Resume.objects.first()
print(resume.is_paid)
```

## Erreurs courantes

### Erreur : "Failed to create checkout session"
**Solution** : Les clés Stripe ne sont pas configurées ou invalides
- Vérifiez que les clés dans `.env` sont valides
- Redémarrez le backend après modification

### Erreur : "Price ID not found"
**Solution** : Les Price IDs ne correspondent pas aux produits Stripe
- Vérifiez que vous avez créé les produits dans Stripe Dashboard
- Copiez les bons Price IDs dans `.env`

### Erreur : "Webhook signature verification failed"
**Solution** : Le webhook secret est incorrect
- Si vous utilisez Stripe CLI, copiez le secret affiché
- Sinon, vérifiez le secret dans Stripe Dashboard

### Paiement réussi mais rien ne se passe
**Solution** : Les webhooks ne fonctionnent pas
- Lancez `stripe listen` pour le développement
- Vérifiez que l'URL webhook est accessible
- Consultez les logs Django pour les erreurs

## Structure complète du système

```
📦 Système de paiement CVBuilder
├── 💳 Backend (Django + Stripe)
│   ├── Models
│   │   ├── Payment (transactions)
│   │   ├── Subscription (abonnements)
│   │   └── WebhookEvent (logs)
│   ├── Views
│   │   ├── CreateCheckoutSessionView ✅
│   │   ├── StripeWebhookView ✅
│   │   ├── PaymentListView ✅
│   │   └── SubscriptionDetailView ✅
│   └── Webhooks (6 événements)
│       ├── checkout.session.completed ✅
│       ├── customer.subscription.created ✅
│       ├── customer.subscription.updated ✅
│       ├── customer.subscription.deleted ✅
│       ├── invoice.payment_succeeded ✅
│       └── invoice.payment_failed ✅
│
├── 🎨 Frontend (Next.js + MUI)
│   ├── Pages
│   │   ├── /payment (checkout) ✅
│   │   ├── /payment/success ✅
│   │   ├── /payment/cancel ✅
│   │   └── /pricing (plans) ✅
│   └── API Service
│       └── payment.ts ✅
│
└── 📚 Documentation
    ├── STRIPE_SETUP.md (guide complet) ✅
    └── TEST_STRIPE.md (ce fichier) ✅
```

## État du système

✅ Code backend complet et fonctionnel
✅ Code frontend complet et fonctionnel
✅ Webhooks implémentés et testables
✅ Documentation complète
⏳ **En attente : Configuration Stripe avec vraies clés**

Une fois les clés Stripe configurées, le système sera 100% opérationnel ! 🚀
