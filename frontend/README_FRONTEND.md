# CV Builder - Frontend

## Vue d'ensemble

Application Next.js 16 avec TypeScript pour créer des CV professionnels. Utilise Material-UI, Zustand pour la gestion d'état, et React Hook Form pour les formulaires.

## Technologies

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **UI**: Material-UI (MUI) + Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Formulaires**: React Hook Form
- **Paiements**: Stripe.js (à implémenter)
- **Export PDF**: jsPDF + html2canvas (à implémenter)

## Structure du projet

```
frontend/
├── app/
│   ├── layout.tsx          # Layout principal avec Header/Footer
│   ├── page.tsx            # Page d'accueil
│   └── builder/
│       └── page.tsx        # Page du builder de CV
├── components/
│   ├── common/
│   │   ├── ThemeRegistry.tsx   # Provider Material-UI
│   │   └── SaveIndicator.tsx   # Indicateur de sauvegarde
│   ├── forms/              # Composants de formulaire
│   │   ├── ResumeForm.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ProfessionalSummaryForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── EducationForm.tsx
│   │   ├── SkillsForm.tsx
│   │   ├── LanguagesForm.tsx
│   │   ├── CertificationsForm.tsx
│   │   └── ProjectsForm.tsx
│   ├── layout/
│   │   ├── Header.tsx      # Header avec navigation
│   │   └── Footer.tsx      # Footer avec liens
│   └── preview/
│       └── ResumePreview.tsx   # Preview en temps réel du CV
├── lib/
│   ├── api/
│   │   ├── axios.ts        # Configuration Axios avec intercepteurs
│   │   └── resume.ts       # API calls pour les CVs
│   ├── hooks/
│   │   └── useAutoSave.ts  # Hook pour auto-save avec debounce
│   ├── stores/
│   │   ├── useResumeStore.ts   # Store Zustand pour le CV
│   │   └── useAuthStore.ts     # Store Zustand pour l'authentification
│   └── theme.ts            # Thème Material-UI
└── types/
    └── resume.ts           # Types TypeScript pour les données

## Fonctionnalités implémentées

### ✅ Complété

1. **Page d'accueil**
   - Hero section avec CTA
   - Présentation des fonctionnalités
   - Section "Comment ça marche"
   - Design responsive

2. **Builder de CV (/builder)**
   - Layout 2 colonnes (formulaire + preview)
   - Layout mobile avec bouton de switch
   - Formulaire en accordéon avec 8 sections:
     - Informations personnelles
     - Titre & résumé professionnel
     - Expériences professionnelles
     - Formation
     - Compétences
     - Langues
     - Certifications
     - Projets

3. **Preview en temps réel**
   - Mise à jour instantanée
   - Watermark "PREVIEW"
   - Contrôles de zoom
   - Design professionnel

4. **Auto-save**
   - Sauvegarde automatique après 3 secondes
   - Indicateur visuel de statut
   - Gestion des erreurs

5. **State Management**
   - Store Zustand pour le CV
   - Store Zustand pour l'authentification
   - Persistance de l'authentification

6. **API Client**
   - Configuration Axios
   - Intercepteurs pour les tokens JWT
   - Refresh automatique des tokens
   - Support des sessions anonymes

### 🚧 À implémenter

1. **Authentification**
   - Modal de connexion/inscription
   - OAuth (Google, LinkedIn)
   - Gestion des sessions

2. **Templates**
   - Page `/templates`
   - Galerie de templates
   - Sélection de template premium/gratuit
   - Preview des templates

3. **Paiements**
   - Page `/pricing`
   - Intégration Stripe Checkout
   - Gestion des abonnements
   - Modal de paiement

4. **Export**
   - Export PDF (backend et frontend)
   - Export Google Docs
   - Export Word (.docx)
   - Export OpenOffice (.odt)

5. **Dashboard**
   - Page `/dashboard`
   - Liste des CVs
   - Gestion du profil
   - Historique des paiements

6. **Import LinkedIn**
   - OAuth LinkedIn
   - Parsing des données
   - Pré-remplissage du formulaire

7. **Fonctionnalités avancées**
   - Drag & drop pour réordonner
   - Rich text editor pour descriptions
   - Upload de photo de profil
   - Sections personnalisées

## Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier .env.local et configurer
cp .env.local.example .env.local

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Scripts

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Créer le build de production
npm run start        # Démarrer en mode production
npm run lint         # Vérifier le code avec ESLint
```

## Architecture

### State Management

L'application utilise Zustand pour la gestion d'état global:

- **useResumeStore**: Gère les données du CV, le statut de sauvegarde, et le template sélectionné
- **useAuthStore**: Gère l'authentification, les tokens JWT, et les informations utilisateur

### Auto-save

Le hook `useAutoSave` surveille les changements du CV et déclenche une sauvegarde automatique après 3 secondes d'inactivité. Il utilise debouncing pour éviter trop de requêtes API.

### API Client

Axios est configuré avec des intercepteurs pour:
- Ajouter automatiquement le token JWT aux requêtes
- Gérer le refresh automatique des tokens expirés
- Supporter les cookies de session pour les utilisateurs anonymes

### Responsive Design

- Desktop: Layout 2 colonnes (formulaire + preview)
- Mobile: Onglets avec bouton flottant pour switch
- Breakpoints Material-UI: xs, sm, md, lg, xl

## Bonnes pratiques

1. **Composants**
   - Utiliser 'use client' pour les composants interactifs
   - Séparer la logique métier des composants UI
   - Créer des composants réutilisables

2. **Types**
   - Typer toutes les interfaces
   - Utiliser les types génériques quand nécessaire
   - Éviter `any`

3. **Performance**
   - Utiliser React.memo pour les composants lourds
   - Debounce pour les opérations coûteuses
   - Lazy loading des composants non critiques

4. **Accessibilité**
   - Labels sur tous les champs de formulaire
   - Navigation au clavier
   - Contraste des couleurs WCAG AA

## Prochaines étapes

1. Implémenter les pages manquantes (templates, pricing, dashboard)
2. Intégrer Stripe pour les paiements
3. Connecter au backend Django via les API
4. Ajouter les tests (Jest + React Testing Library)
5. Implémenter l'export PDF
6. Ajouter l'import LinkedIn
7. Optimiser les performances (code splitting, image optimization)
8. Déployer sur Vercel

## Support

Pour toute question ou problème, consultez les spécifications dans `/docs/SPECIFICATIONS.md`
