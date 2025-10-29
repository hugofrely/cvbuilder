# CV Builder - Guide de Démarrage Rapide

## Installation et Configuration

### 1. Backend Django

```bash
cd backend

# Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Configurer .env
cp .env.example .env
# Éditer .env avec vos configurations
```

### 2. Base de données PostgreSQL

```bash
# Créer la base de données
createdb cvbuilder

# Ou avec psql
psql -U postgres
CREATE DATABASE cvbuilder;
\q
```

### 3. Migrations Django

```bash
# Depuis backend/ avec venv activé
python manage.py makemigrations
python manage.py migrate

# Créer superuser
python manage.py createsuperuser

# Créer templates par défaut
python manage.py create_templates
```

### 4. Frontend Next.js

```bash
# Créer projet Next.js 16
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# Installer dépendances MUI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Installer autres dépendances
npm install axios zustand react-hook-form
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install jspdf html2canvas

# Configurer .env.local
cp .env.example .env.local
# Éditer avec vos variables
```

## Lancement de l'Application

### Option 1: Sans Docker

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 3 - Celery (optionnel):
```bash
cd backend
source venv/bin/activate
celery -A cvbuilder_backend worker -l info
```

### Option 2: Avec Docker

```bash
# Démarrer tous les services
docker-compose up

# En arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## URLs de l'Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/docs (à configurer)

## Configuration Stripe

### 1. Créer compte Stripe

1. Aller sur https://dashboard.stripe.com/register
2. Créer un compte test
3. Obtenir les clés API:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

### 2. Créer Produits et Prix

Dans le Stripe Dashboard:

1. **Produits** → Créer 3 produits:

   **a. Achat CV unique**
   - Nom: "Single CV Purchase"
   - Prix: 9.99 EUR (one-time)
   - Copier le Price ID: `price_xxx`

   **b. Abonnement Mensuel**
   - Nom: "Monthly Subscription"
   - Prix: 14.99 EUR/mois (recurring)
   - Copier le Price ID: `price_xxx`

   **c. Abonnement Annuel**
   - Nom: "Yearly Subscription"
   - Prix: 149.99 EUR/an (recurring)
   - Copier le Price ID: `price_xxx`

2. Ajouter ces Price IDs dans `.env`:
   ```
   STRIPE_SINGLE_CV_PRICE_ID=price_xxx
   STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_xxx
   STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID=price_xxx
   ```

### 3. Configurer Webhooks

1. Dans Stripe Dashboard → Developers → Webhooks
2. Ajouter endpoint: `http://localhost:8000/api/payments/webhook/`
3. Sélectionner événements:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copier le Webhook Secret: `whsec_xxx`
5. Ajouter dans `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### 4. Tester localement avec Stripe CLI

```bash
# Installer Stripe CLI
brew install stripe/stripe-brew/stripe  # macOS
# ou télécharger depuis https://stripe.com/docs/stripe-cli

# Se connecter
stripe login

# Écouter les webhooks localement
stripe listen --forward-to localhost:8000/api/payments/webhook/

# Dans un autre terminal, tester
stripe trigger checkout.session.completed
```

## LinkedIn OAuth (Optionnel)

### 1. Créer une App LinkedIn

1. Aller sur https://www.linkedin.com/developers/apps
2. Créer une nouvelle app
3. Configurer OAuth 2.0:
   - Redirect URL: `http://localhost:8000/api/auth/linkedin/callback`
4. Obtenir:
   - Client ID
   - Client Secret
5. Ajouter dans `.env`:
   ```
   LINKEDIN_CLIENT_ID=your-client-id
   LINKEDIN_CLIENT_SECRET=your-client-secret
   ```

## Tester l'Application

### 1. Créer un CV sans authentification

```bash
# POST /api/resumes/
curl -X POST http://localhost:8000/api/resumes/ \
  -H "Content-Type: application/json" \
  -d '{
    "template": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "title": "Software Engineer",
    "summary": "Experienced developer...",
    "experience_data": [{
      "company": "Tech Corp",
      "position": "Senior Developer",
      "start_date": "2020-01-01",
      "is_current": true,
      "description": "Developed amazing apps"
    }]
  }'
```

### 2. Tester l'authentification

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!"
  }'

# Login (obtenir JWT)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Tester Stripe Checkout

Depuis le frontend:
1. Aller sur http://localhost:3000
2. Créer un CV
3. Cliquer "Acheter template premium"
4. Utiliser carte de test Stripe: `4242 4242 4242 4242`
   - Expiration: n'importe quelle date future
   - CVC: n'importe quel 3 chiffres

## Structure des Fichiers Créés

```
cvbuilder/
├── backend/
│   ├── cvbuilder_backend/       # ✅ Configuration Django
│   │   ├── settings.py          # ✅ Configuré avec JWT, Stripe, PostgreSQL
│   │   └── urls.py              # ⏳ À finaliser
│   ├── users/                   # ✅ App utilisateurs
│   │   ├── models.py            # ✅ User avec abonnements
│   │   ├── serializers.py       # ✅ DRF serializers
│   │   └── views.py             # ✅ API endpoints
│   ├── resumes/                 # ✅ App CV
│   │   ├── models.py            # ✅ Resume, Template, etc.
│   │   ├── serializers.py       # ✅ DRF serializers
│   │   ├── views.py             # ⏳ À créer (voir README)
│   │   ├── services.py          # ⏳ À créer
│   │   └── management/commands/ # ✅ create_templates.py
│   ├── payments/                # ✅ App paiements
│   │   ├── models.py            # ✅ Payment, Subscription
│   │   ├── serializers.py       # ✅ DRF serializers
│   │   └── views.py             # ⏳ À créer (voir README)
│   ├── templates/               # ✅ Templates CV
│   │   ├── cv_template_simple.html  # ✅
│   │   └── cv_template_simple.css   # ✅
│   ├── requirements.txt         # ✅
│   ├── .env.example             # ✅
│   └── Dockerfile               # ✅
├── frontend/                    # ⏳ À créer
│   └── (voir README pour structure complète)
├── docker-compose.yml           # ✅
├── .gitignore                   # ✅
├── start.sh                     # ✅ Script de démarrage
├── README.md                    # ✅ Documentation complète
└── QUICKSTART.md                # ✅ Ce fichier

✅ = Créé
⏳ = À créer (exemples fournis dans README.md)
```

## Prochaines Étapes

### Backend
1. Finaliser `resumes/views.py` (exemples dans README)
2. Créer `resumes/services.py` pour PDF et import LinkedIn
3. Finaliser `payments/views.py` pour Stripe
4. Compléter `cvbuilder_backend/urls.py`
5. Tester les API endpoints

### Frontend
1. Créer projet Next.js avec structure décrite dans README
2. Implémenter composants CV (CVForm, CVPreview, etc.)
3. Intégrer Stripe Checkout
4. Créer pages (accueil, builder, templates, dashboard)
5. Tester accessibilité (WCAG)

### Tests
1. Backend: pytest avec pytest-django
2. Frontend: Jest + React Testing Library
3. E2E: Playwright ou Cypress

### Déploiement
1. Backend: Railway, Render ou Heroku
2. Frontend: Vercel ou Netlify
3. Base de données: PostgreSQL managé
4. Fichiers: AWS S3 ou Cloudinary

## Ressources

- **Django REST Framework**: https://www.django-rest-framework.org/
- **Next.js 16**: https://nextjs.org/docs
- **MUI**: https://mui.com/material-ui/getting-started/
- **Stripe**: https://stripe.com/docs
- **WeasyPrint**: https://doc.courtbouillon.org/weasyprint/

## Aide et Support

Si vous rencontrez des problèmes:

1. Vérifier les logs:
   ```bash
   # Backend
   tail -f backend/logs/django.log

   # Docker
   docker-compose logs -f backend
   ```

2. Vérifier la configuration:
   ```bash
   # Variables d'environnement
   cat backend/.env

   # Base de données
   python manage.py dbshell
   ```

3. Réinitialiser la base:
   ```bash
   python manage.py flush
   python manage.py migrate
   python manage.py create_templates
   ```

Bon développement ! 🚀
