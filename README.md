# CV Builder - Application complète

Application de création de CV professionnels avec backend Django, frontend Next.js 16, paiements Stripe et export multi-formats.

## Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Fonctionnalités](#fonctionnalités)
- [API Documentation](#api-documentation)
- [Déploiement](#déploiement)

## Architecture

### Backend (Django)

```
backend/
├── cvbuilder_backend/      # Configuration Django
│   ├── settings.py         # Settings avec JWT, Stripe, PostgreSQL
│   └── urls.py
├── users/                  # App utilisateurs
│   ├── models.py          # User avec abonnements
│   ├── serializers.py     # Serializers DRF
│   └── views.py           # API endpoints
├── resumes/               # App CV
│   ├── models.py         # Resume, Template, Experience, Education, Skill
│   ├── serializers.py    # Serializers DRF
│   ├── views.py          # ViewSets pour CRUD
│   └── services.py       # Logique métier (PDF, import LinkedIn)
├── payments/             # App paiements
│   ├── models.py        # Payment, Subscription, WebhookEvent
│   ├── serializers.py   # Serializers Stripe
│   └── views.py         # Stripe webhooks et checkout
└── requirements.txt
```

### Frontend (Next.js 16)

```
frontend/
├── src/
│   ├── app/                    # App Router Next.js 16
│   │   ├── layout.tsx         # Layout global
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── builder/           # CV Builder
│   │   │   ├── page.tsx       # Formulaire principal
│   │   │   └── preview/       # Preview avec watermark
│   │   ├── templates/         # Galerie templates
│   │   ├── payment/           # Pages paiement
│   │   └── dashboard/         # Dashboard utilisateur
│   ├── components/
│   │   ├── cv/
│   │   │   ├── CVForm.tsx            # Formulaire CV
│   │   │   ├── CVPreview.tsx         # Preview temps réel
│   │   │   ├── PersonalInfo.tsx      # Section info perso
│   │   │   ├── Experience.tsx        # Section expérience
│   │   │   ├── Education.tsx         # Section éducation
│   │   │   ├── Skills.tsx            # Section compétences
│   │   │   └── TemplateSelector.tsx  # Sélection template
│   │   ├── payment/
│   │   │   ├── StripeCheckout.tsx    # Intégration Stripe
│   │   │   └── PricingTable.tsx      # Tableau de prix
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── api.ts              # Client API
│   │   ├── stripe.ts           # Config Stripe
│   │   └── auth.ts             # Gestion auth JWT
│   ├── store/                  # State management (Zustand/Redux)
│   │   ├── cvStore.ts         # State du CV
│   │   └── authStore.ts       # State auth
│   ├── hooks/
│   │   ├── useCV.ts
│   │   ├── useAuth.ts
│   │   └── usePayment.ts
│   ├── types/
│   │   ├── cv.ts
│   │   ├── user.ts
│   │   └── payment.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── templates/            # Images templates
│   └── watermark/           # Assets watermark
├── package.json
└── next.config.js
```

## Technologies

### Backend
- **Django 5.1** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données
- **djangorestframework-simplejwt** - Authentification JWT
- **Stripe** - Paiements
- **WeasyPrint** - Génération PDF
- **Celery + Redis** - Tâches asynchrones
- **Pillow** - Traitement images

### Frontend
- **Next.js 16** - Framework React avec App Router
- **Material-UI (MUI)** - Composants UI accessibles
- **TypeScript** - Typage statique
- **Zustand/Redux Toolkit** - State management
- **React Hook Form** - Gestion formulaires
- **Axios** - Client HTTP
- **Stripe.js** - Intégration Stripe frontend

## Installation

### Prérequis

- Python 3.11+
- Node.js 20+
- PostgreSQL 14+
- Redis 7+ (pour Celery)

### Backend Setup

```bash
cd backend

# Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Copier .env
cp .env.example .env
# Éditer .env avec vos valeurs

# Créer la base de données PostgreSQL
createdb cvbuilder

# Migrations
python manage.py makemigrations
python manage.py migrate

# Créer superuser
python manage.py createsuperuser

# Charger templates de base (à créer)
python manage.py loaddata templates

# Lancer serveur
python manage.py runserver
```

### Frontend Setup

```bash
# Créer projet Next.js 16
npx create-next-app@latest frontend --typescript --tailwind --app

cd frontend

# Installer dépendances
npm install @mui/material @emotion/react @emotion/styled
npm install @stripe/stripe-js
npm install axios zustand
npm install react-hook-form
npm install @mui/icons-material
npm install jspdf html2canvas  # Pour export PDF côté client

# Variables d'environnement
cp .env.example .env.local
# Éditer .env.local

# Lancer dev server
npm run dev
```

## Configuration

### Backend (.env)

```env
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# Database
DB_NAME=cvbuilder
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# Stripe (obtenir sur dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Prix Stripe (créer produits/prix dans Stripe Dashboard)
STRIPE_SINGLE_CV_PRICE_ID=price_xxx
STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID=price_xxx
STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID=price_xxx

FRONTEND_URL=http://localhost:3000

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=15
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Redis
REDIS_URL=redis://localhost:6379/0
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Développement

### Backend - Compléter les vues

Fichier `backend/resumes/views.py` à créer :

```python
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Template, Resume, Experience, Education, Skill
from .serializers import (
    TemplateSerializer, TemplateDetailSerializer,
    ResumeSerializer, ResumeCreateSerializer, ResumeUpdateSerializer,
    ExperienceSerializer, EducationSerializer, SkillSerializer
)
from .services import PDFGenerator, LinkedInImporter


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    """Templates endpoints - lecture seule"""

    queryset = Template.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TemplateDetailSerializer
        return TemplateSerializer

    @action(detail=False, methods=['get'])
    def free(self, request):
        """Obtenir templates gratuits"""
        templates = self.queryset.filter(is_premium=False)
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def premium(self, request):
        """Obtenir templates premium"""
        templates = self.queryset.filter(is_premium=True)
        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)


class ResumeViewSet(viewsets.ModelViewSet):
    """CV endpoints avec CRUD complet"""

    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ResumeUpdateSerializer
        return ResumeSerializer

    def get_queryset(self):
        """Filtrer par utilisateur ou session"""
        user = self.request.user

        if user.is_authenticated:
            return Resume.objects.filter(user=user)
        else:
            session_id = self.request.session.session_key
            if session_id:
                return Resume.objects.filter(session_id=session_id)
            return Resume.objects.none()

    @action(detail=True, methods=['post'])
    def export_pdf(self, request, pk=None):
        """Exporter CV en PDF avec/sans watermark"""
        resume = self.get_object()
        with_watermark = not resume.can_export_without_watermark

        generator = PDFGenerator()
        pdf_file = generator.generate(resume, watermark=with_watermark)

        return Response({
            'pdf_url': pdf_file.url,
            'has_watermark': with_watermark
        })

    @action(detail=False, methods=['post'])
    def import_linkedin(self, request):
        """Importer CV depuis LinkedIn"""
        linkedin_url = request.data.get('linkedin_url')

        importer = LinkedInImporter()
        data = importer.import_from_url(linkedin_url)

        serializer = ResumeCreateSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        resume = serializer.save()

        return Response(
            ResumeSerializer(resume).data,
            status=status.HTTP_201_CREATED
        )
```

### Services à créer

Fichier `backend/resumes/services.py` :

```python
from io import BytesIO
from django.core.files.base import ContentFile
from weasyprint import HTML, CSS
from django.template.loader import render_to_string


class PDFGenerator:
    """Service de génération PDF"""

    def generate(self, resume, watermark=True):
        """Générer PDF du CV"""

        # Récupérer template HTML/CSS
        template = resume.template

        # Contexte pour le template
        context = {
            'resume': resume,
            'watermark': watermark
        }

        # Render HTML avec données CV
        html_content = self._render_html(template, context)
        css_content = template.template_css

        # Générer PDF avec WeasyPrint
        pdf_file = HTML(string=html_content).write_pdf(
            stylesheets=[CSS(string=css_content)]
        )

        # Sauvegarder et retourner
        return ContentFile(pdf_file)

    def _render_html(self, template, context):
        """Render template HTML avec données"""
        # À implémenter selon format de vos templates
        return render_to_string('cv_template.html', context)


class LinkedInImporter:
    """Service d'import depuis LinkedIn"""

    def import_from_url(self, url):
        """Importer données depuis profil LinkedIn"""
        # Note: LinkedIn API nécessite OAuth 2.0
        # Alternative: utiliser bibliothèque comme linkedin-api

        # Placeholder - à implémenter
        return {
            'full_name': '',
            'email': '',
            'title': '',
            'summary': '',
            'experience_data': [],
            'education_data': [],
            'skills_data': []
        }


class ExportService:
    """Service d'export vers différents formats"""

    def export_to_docx(self, resume):
        """Exporter vers Word .docx"""
        # Utiliser python-docx
        pass

    def export_to_google_docs(self, resume):
        """Créer Google Doc"""
        # Utiliser Google Docs API
        pass

    def export_to_odt(self, resume):
        """Exporter vers OpenOffice .odt"""
        # Utiliser odfpy
        pass
```

### Paiements Stripe

Fichier `backend/payments/views.py` :

```python
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import stripe

from .models import Payment, Subscription, WebhookEvent
from .serializers import CreateCheckoutSessionSerializer, PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """Créer session Stripe Checkout"""

    serializer = CreateCheckoutSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    payment_type = serializer.validated_data['payment_type']
    resume_id = serializer.validated_data.get('resume_id')
    success_url = serializer.validated_data.get('success_url', f"{settings.FRONTEND_URL}/payment/success")
    cancel_url = serializer.validated_data.get('cancel_url', f"{settings.FRONTEND_URL}/payment/cancel")

    try:
        # Déterminer le price_id selon type
        if payment_type == 'single':
            price_id = settings.STRIPE_SINGLE_CV_PRICE_ID
            mode = 'payment'
        elif payment_type == 'monthly':
            price_id = settings.STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID
            mode = 'subscription'
        else:  # yearly
            price_id = settings.STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID
            mode = 'subscription'

        # Créer session Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode=mode,
            success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=cancel_url,
            metadata={
                'payment_type': payment_type,
                'resume_id': resume_id,
                'user_id': request.user.id if request.user.is_authenticated else None
            }
        )

        # Créer Payment record
        Payment.objects.create(
            user=request.user if request.user.is_authenticated else None,
            resume_id=resume_id,
            stripe_checkout_session_id=session.id,
            amount=session.amount_total / 100,
            currency=session.currency.upper(),
            payment_type='single' if payment_type == 'single' else 'subscription',
            status='pending'
        )

        return Response({'url': session.url})

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """Webhook Stripe pour événements paiement"""

    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    # Sauvegarder événement
    WebhookEvent.objects.create(
        event_id=event.id,
        event_type=event.type,
        payload=event.data
    )

    # Traiter selon type événement
    if event.type == 'checkout.session.completed':
        session = event.data.object
        _handle_checkout_completed(session)

    elif event.type == 'customer.subscription.updated':
        subscription = event.data.object
        _handle_subscription_updated(subscription)

    elif event.type == 'customer.subscription.deleted':
        subscription = event.data.object
        _handle_subscription_deleted(subscription)

    return HttpResponse(status=200)


def _handle_checkout_completed(session):
    """Traiter checkout complété"""

    payment = Payment.objects.get(stripe_checkout_session_id=session.id)
    payment.status = 'succeeded'
    payment.stripe_payment_intent_id = session.payment_intent
    payment.save()

    # Si achat unique CV, marquer comme payé
    if payment.payment_type == 'single' and payment.resume:
        payment.resume.is_paid = True
        payment.resume.payment_type = 'single'
        payment.resume.save()

    # Si abonnement, activer premium
    elif payment.payment_type == 'subscription' and payment.user:
        payment.user.is_premium = True
        payment.user.save()


def _handle_subscription_updated(subscription):
    """Traiter mise à jour abonnement"""
    # Implémenter logique
    pass


def _handle_subscription_deleted(subscription):
    """Traiter suppression abonnement"""
    # Implémenter logique
    pass
```

### URLs Backend

Fichier `backend/cvbuilder_backend/urls.py` :

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserRegistrationView, UserProfileView, ChangePasswordView
from resumes.views import TemplateViewSet, ResumeViewSet
from payments.views import create_checkout_session, stripe_webhook

router = DefaultRouter()
router.register(r'templates', TemplateViewSet, basename='template')
router.register(r'resumes', ResumeViewSet, basename='resume')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth endpoints
    path('api/auth/register/', UserRegistrationView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', UserProfileView.as_view(), name='profile'),
    path('api/auth/change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Payment endpoints
    path('api/payments/create-checkout/', create_checkout_session, name='create_checkout'),
    path('api/payments/webhook/', stripe_webhook, name='stripe_webhook'),

    # REST API
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Frontend - Structure Next.js 16

### Installation et configuration initiale

```bash
cd frontend

# MUI Setup
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Formulaires
npm install react-hook-form @hookform/resolvers zod

# HTTP Client
npm install axios

# State Management
npm install zustand

# Stripe
npm install @stripe/stripe-js @stripe/react-stripe-js

# PDF
npm install jspdf html2canvas
```

### Configuration MUI avec Next.js 16

Fichier `frontend/src/app/layout.tsx` :

```typescript
import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@/lib/theme'

export const metadata: Metadata = {
  title: 'CV Builder',
  description: 'Créez votre CV professionnel en quelques minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
```

Fichier `frontend/src/lib/theme.ts` :

```typescript
'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // Accessibilité
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 44, // Touch target WCAG
        },
      },
    },
  },
})

export default theme
```

### Store Zustand pour CV

Fichier `frontend/src/store/cvStore.ts` :

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CVData {
  full_name: string
  email: string
  phone: string
  address: string
  website: string
  linkedin_url: string
  github_url: string
  title: string
  summary: string
  experience_data: any[]
  education_data: any[]
  skills_data: any[]
  template: number | null
}

interface CVStore {
  cv: CVData
  sessionId: string | null
  updateCV: (data: Partial<CVData>) => void
  resetCV: () => void
  setSessionId: (id: string) => void
}

const initialCV: CVData = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  linkedin_url: '',
  github_url: '',
  title: '',
  summary: '',
  experience_data: [],
  education_data: [],
  skills_data: [],
  template: null,
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: initialCV,
      sessionId: null,
      updateCV: (data) => set((state) => ({
        cv: { ...state.cv, ...data }
      })),
      resetCV: () => set({ cv: initialCV }),
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'cv-storage',
    }
  )
)
```

### API Client

Fichier `frontend/src/lib/api.ts` :

```typescript
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour sessions
})

// Intercepteur pour JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// CV APIs
export const cvAPI = {
  getTemplates: () => api.get('/templates/'),
  getFreeTemplates: () => api.get('/templates/free/'),
  getPremiumTemplates: () => api.get('/templates/premium/'),

  createResume: (data: any) => api.post('/resumes/', data),
  updateResume: (id: number, data: any) => api.patch(`/resumes/${id}/`, data),
  getResume: (id: number) => api.get(`/resumes/${id}/`),
  listResumes: () => api.get('/resumes/'),

  exportPDF: (id: number) => api.post(`/resumes/${id}/export_pdf/`),
  importLinkedIn: (url: string) => api.post('/resumes/import_linkedin/', { linkedin_url: url }),
}

// Payment APIs
export const paymentAPI = {
  createCheckout: (data: {
    payment_type: 'single' | 'monthly' | 'yearly'
    resume_id?: number
  }) => api.post('/payments/create-checkout/', data),
}

// Auth APIs
export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  refresh: (refresh: string) =>
    api.post('/auth/refresh/', { refresh }),
  profile: () => api.get('/auth/profile/'),
}
```

### Composant Formulaire CV

Fichier `frontend/src/components/cv/CVForm.tsx` :

```typescript
'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material'
import { useCVStore } from '@/store/cvStore'
import { cvAPI } from '@/lib/api'

export default function CVForm() {
  const { cv, updateCV } = useCVStore()
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: cv,
  })

  const [saving, setSaving] = useState(false)

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      updateCV(data)

      // Sauvegarder côté serveur
      const response = await cvAPI.createResume(data)
      console.log('CV saved:', response.data)
    } catch (error) {
      console.error('Error saving CV:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Informations personnelles
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Controller
              name="full_name"
              control={control}
              rules={{ required: 'Le nom complet est requis' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom complet"
                  fullWidth
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  inputProps={{
                    'aria-required': 'true',
                    'aria-invalid': !!errors.full_name,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  inputProps={{
                    'aria-required': 'true',
                    'aria-invalid': !!errors.email,
                  }}
                />
              )}
            />
          </Grid>

          {/* Ajouter autres champs... */}
        </Grid>
      </Paper>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={saving}
        sx={{ minHeight: 48 }} // WCAG touch target
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>
    </Box>
  )
}
```

### Composant Preview avec Watermark

Fichier `frontend/src/components/cv/CVPreview.tsx` :

```typescript
'use client'
import { Box, Paper, Typography } from '@mui/material'
import { useCVStore } from '@/store/cvStore'

interface CVPreviewProps {
  showWatermark?: boolean
}

export default function CVPreview({ showWatermark = true }: CVPreviewProps) {
  const { cv } = useCVStore()

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        position: 'relative',
        minHeight: '842px', // A4 height
        backgroundColor: 'white',
      }}
    >
      {showWatermark && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.05)',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          PREVIEW
        </Box>
      )}

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h3" gutterBottom>
          {cv.full_name || 'Votre nom'}
        </Typography>

        <Typography variant="h5" color="text.secondary" gutterBottom>
          {cv.title || 'Titre professionnel'}
        </Typography>

        <Typography variant="body1" paragraph>
          {cv.email} {cv.phone && `• ${cv.phone}`}
        </Typography>

        {cv.summary && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Résumé
            </Typography>
            <Typography variant="body1" paragraph>
              {cv.summary}
            </Typography>
          </>
        )}

        {/* Ajouter sections expérience, éducation, etc. */}
      </Box>
    </Paper>
  )
}
```

### Intégration Stripe

Fichier `frontend/src/components/payment/StripeCheckout.tsx` :

```typescript
'use client'
import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { paymentAPI } from '@/lib/api'

interface StripeCheckoutProps {
  paymentType: 'single' | 'monthly' | 'yearly'
  resumeId?: number
  label: string
}

export default function StripeCheckout({
  paymentType,
  resumeId,
  label
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await paymentAPI.createCheckout({
        payment_type: paymentType,
        resume_id: resumeId,
      })

      // Rediriger vers Stripe Checkout
      window.location.href = response.data.url
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleCheckout}
      disabled={loading}
      sx={{ minHeight: 48 }}
    >
      {loading ? <CircularProgress size={24} /> : label}
    </Button>
  )
}
```

## Fonctionnalités

### Backend

- ✅ Models Django complets (User, Resume, Template, Payment, Subscription)
- ✅ Authentification JWT
- ✅ API REST avec DRF
- ✅ Support sessions anonymes
- ⏳ Génération PDF avec watermark (à implémenter dans services.py)
- ⏳ Import LinkedIn (à implémenter avec OAuth)
- ⏳ Webhooks Stripe (squelette créé)
- ⏳ Export multi-formats (DOCX, ODT, Google Docs)

### Frontend

- ⏳ Page d'accueil
- ⏳ Formulaire CV avec validation
- ⏳ Preview temps réel
- ⏳ Sélecteur de templates
- ⏳ Intégration Stripe Checkout
- ⏳ Dashboard utilisateur
- ⏳ Export PDF
- ⏳ Import LinkedIn

## API Documentation

### Endpoints principaux

#### Auth
```
POST /api/auth/register/          - Inscription
POST /api/auth/login/              - Connexion (JWT)
POST /api/auth/refresh/            - Refresh token
GET  /api/auth/profile/            - Profil utilisateur
POST /api/auth/change-password/    - Changer mot de passe
```

#### Templates
```
GET /api/templates/                - Liste templates
GET /api/templates/{id}/           - Détail template
GET /api/templates/free/           - Templates gratuits
GET /api/templates/premium/        - Templates premium
```

#### Resumes
```
GET    /api/resumes/               - Liste CV utilisateur/session
POST   /api/resumes/               - Créer CV
GET    /api/resumes/{id}/          - Détail CV
PATCH  /api/resumes/{id}/          - Mettre à jour CV
DELETE /api/resumes/{id}/          - Supprimer CV
POST   /api/resumes/{id}/export_pdf/ - Exporter PDF
POST   /api/resumes/import_linkedin/ - Importer LinkedIn
```

#### Payments
```
POST /api/payments/create-checkout/ - Créer session Stripe
POST /api/payments/webhook/         - Webhook Stripe
```

## Déploiement

### Backend (Heroku / Railway / Render)

```bash
# Installer gunicorn
pip install gunicorn

# Créer Procfile
echo "web: gunicorn cvbuilder_backend.wsgi" > Procfile

# Collectstatic
python manage.py collectstatic --noinput

# Variables d'environnement production
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://...
SECRET_KEY=...
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend (Vercel / Netlify)

```bash
# Build
npm run build

# Variables d'environnement
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### PostgreSQL

```sql
-- Créer DB production
CREATE DATABASE cvbuilder_production;
CREATE USER cvbuilder_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE cvbuilder_production TO cvbuilder_user;
```

## Prochaines étapes

1. **Backend**
   - [ ] Implémenter PDFGenerator avec WeasyPrint
   - [ ] Configurer LinkedIn OAuth
   - [ ] Finaliser webhooks Stripe
   - [ ] Ajouter export DOCX/ODT
   - [ ] Tests unitaires

2. **Frontend**
   - [ ] Créer toutes les pages Next.js
   - [ ] Composants MUI pour toutes sections CV
   - [ ] Tests accessibilité WCAG
   - [ ] Optimisation images
   - [ ] Tests E2E

3. **DevOps**
   - [ ] CI/CD GitHub Actions
   - [ ] Docker Compose
   - [ ] Monitoring (Sentry)
   - [ ] Analytics

## Support

Pour toute question : [votre-email@example.com]

## License

MIT
