# CV Builder - Spécifications Détaillées du Projet

## Vue d'ensemble du Projet

**Nom** : CV Builder
**Type** : Application web de création de CV professionnels
**Objectif** : Permettre aux utilisateurs de créer facilement des CV professionnels avec différents templates, avec un modèle freemium (gratuit + premium)

---

## 1. Technologies Utilisées

### Backend
- **Framework** : Django 5.1 (Python)
- **API** : Django REST Framework (DRF)
- **Base de données** : PostgreSQL 14+
- **Authentification** : JWT (JSON Web Tokens) via djangorestframework-simplejwt
- **Paiements** : Stripe (checkout sessions + webhooks)
- **Génération PDF** : WeasyPrint / ReportLab
- **Tâches asynchrones** : Celery + Redis
- **Images** : Pillow (traitement photos de profil)

### Frontend
- **Framework** : Next.js 16 (React avec App Router)
- **Langage** : TypeScript
- **UI Components** : Material-UI (MUI)
- **Styling** : Emotion (via MUI) + Tailwind CSS
- **State Management** : Zustand
- **Formulaires** : React Hook Form
- **HTTP Client** : Axios
- **Paiements** : Stripe.js / React Stripe.js
- **Export PDF** : jsPDF + html2canvas

### DevOps & Outils
- **Containerisation** : Docker + Docker Compose
- **Cache** : Redis
- **Variables d'environnement** : python-dotenv
- **Tests Backend** : pytest + pytest-django
- **Tests Frontend** : Jest + React Testing Library
- **Code Quality** : Black, Flake8 (Python) / ESLint, Prettier (TypeScript)

---

## 2. Parcours Utilisateur Détaillé

### Phase 1 : Arrivée et Découverte (Utilisateur Anonyme)

#### Étape 1.1 : Page d'accueil
**URL** : `https://cvbuilder.com/`

**Contenu** :
- **Hero Section** :
  - Titre accrocheur : "Créez votre CV professionnel en 5 minutes"
  - Sous-titre : "Simple, rapide, et professionnel"
  - CTA principal : **"Créer mon CV gratuitement"** (bouton accessible, 48px minimum)

- **Bénéfices clés** (3 colonnes) :
  1. "Sans inscription requise" - Commencez immédiatement
  2. "Templates professionnels" - 1 gratuit + bibliothèque premium
  3. "Export facile" - PDF, Google Docs, OpenOffice

- **Aperçu templates** : Galerie de 4-6 templates avec tags "Gratuit" / "Premium"

- **Section "Comment ça marche"** :
  1. Remplissez vos informations
  2. Choisissez un template
  3. Prévisualisez en temps réel
  4. Téléchargez ou payez pour plus de templates

**Actions possibles** :
- Clic sur **"Créer mon CV"** → Redirect vers `/builder`
- Clic sur **"Voir les templates"** → Redirect vers `/templates`
- Clic sur **"Se connecter"** (header) → Modal de connexion/inscription

**Design** :
- Header fixe avec logo, navigation (Accueil, Templates, Tarifs), boutons Connexion/Inscription
- Footer avec liens légaux (CGU, Politique de confidentialité, Contact)
- Responsive : mobile-first, breakpoints MUI (xs, sm, md, lg, xl)

---

### Phase 2 : Création du CV (Sans Authentification)

#### Étape 2.1 : Accès au formulaire
**URL** : `https://cvbuilder.com/builder`

**Comportement** :
- **PAS de login requis** : L'utilisateur peut commencer immédiatement
- **Session tracking** :
  - Le système génère un `session_id` unique côté backend
  - Stocké dans un cookie de session
  - Utilisé pour sauvegarder temporairement les données du CV

**Interface** :
- **Layout en 2 colonnes** (desktop) :
  - **Gauche (50%)** : Formulaire de saisie
  - **Droite (50%)** : Preview en temps réel

- **Layout mobile** :
  - Onglets "Formulaire" / "Preview" avec bouton de switch
  - Bouton flottant pour basculer entre les deux vues

#### Étape 2.2 : Formulaire de saisie (Sections)

**Section 1 : Informations Personnelles**
Champs :
- ✅ Nom complet* (requis)
- ✅ Email* (requis, validation format email)
- ✅ Téléphone (optionnel)
- ✅ Adresse (optionnel, textarea)
- ✅ Site web (optionnel, URL)
- ✅ LinkedIn (optionnel, URL)
- ✅ GitHub (optionnel, URL)
- ✅ Photo de profil (optionnel, upload image, max 5MB)

**Fonctionnalités** :
- **Import LinkedIn** : Bouton "Importer depuis LinkedIn"
  - OAuth LinkedIn
  - Récupération automatique : nom, email, titre, résumé, expériences, formations
  - Pré-remplissage du formulaire

**Section 2 : Titre Professionnel & Résumé**
- ✅ Titre / Poste recherché (ex: "Développeur Full Stack Senior")
- ✅ Résumé professionnel (textarea, 300 caractères recommandés)

**Section 3 : Expériences Professionnelles**
Liste dynamique (add/remove) :
Pour chaque expérience :
- ✅ Poste* (requis)
- ✅ Entreprise* (requis)
- ✅ Lieu (optionnel)
- ✅ Date de début* (date picker)
- ✅ Date de fin (date picker, ou checkbox "Poste actuel")
- ✅ Description (rich text editor simple : gras, italique, listes)

**Boutons** :
- "+ Ajouter une expérience"
- "Supprimer" (icône poubelle sur chaque item)
- Drag & drop pour réordonner

**Section 4 : Formation**
Liste dynamique :
Pour chaque formation :
- ✅ Diplôme* (requis)
- ✅ Établissement* (requis)
- ✅ Domaine d'étude (optionnel)
- ✅ Lieu (optionnel)
- ✅ Date de début* (date picker)
- ✅ Date de fin (ou "En cours")
- ✅ Mention (optionnel)
- ✅ Description (optionnel)

**Section 5 : Compétences**
Liste dynamique :
Pour chaque compétence :
- ✅ Nom de la compétence* (ex: "JavaScript", "Gestion de projet")
- ✅ Niveau (Débutant / Intermédiaire / Avancé / Expert)
- ✅ Catégorie (optionnel : Programmation, Design, Langues, etc.)

**Boutons** :
- "+ Ajouter une compétence"
- Possibilité de grouper par catégorie dans le preview

**Section 6 : Langues** (optionnel)
Liste dynamique :
- ✅ Langue* (ex: "Français", "Anglais")
- ✅ Niveau* (Débutant / Intermédiaire / Courant / Bilingue / Langue maternelle)

**Section 7 : Certifications** (optionnel)
Liste dynamique :
- ✅ Nom de la certification
- ✅ Organisme délivrant
- ✅ Date d'obtention
- ✅ URL de vérification (optionnel)

**Section 8 : Projets** (optionnel)
Liste dynamique :
- ✅ Nom du projet
- ✅ Description
- ✅ Technologies utilisées
- ✅ URL du projet (optionnel)

**Section 9 : Sections Personnalisées** (optionnel)
Permet d'ajouter des sections custom :
- ✅ Titre de la section
- ✅ Contenu (textarea ou rich text)

**Exemples** : Bénévolat, Publications, Centres d'intérêt, etc.

#### Étape 2.3 : Sauvegarde Automatique

**Comportement** :
- **Auto-save** toutes les 3 secondes après modification
- Requête AJAX vers `/api/resumes/{id}/` (PATCH)
- Indicateur visuel : "Sauvegardé ✓" / "Sauvegarde en cours..."
- Persistance via `session_id` pour utilisateurs non connectés

**Stockage Backend** :
```json
{
  "session_id": "unique-session-id",
  "user": null,  // null car pas encore connecté
  "template": 1,  // ID du template sélectionné (par défaut : template gratuit)
  "full_name": "Jean Dupont",
  "email": "jean@example.com",
  "experience_data": [
    {
      "company": "TechCorp",
      "position": "Développeur",
      "start_date": "2020-01-01",
      "end_date": null,
      "is_current": true,
      "description": "Développement d'applications web..."
    }
  ],
  // ... autres données JSON
}
```

#### Étape 2.4 : Preview en Temps Réel

**Comportement** :
- **Mise à jour immédiate** à chaque modification (debounced 300ms)
- **Watermark** : "PREVIEW" en diagonale (grande taille, opacité 5%)
- **Responsive** : S'adapte à la taille de la fenêtre
- **Zoom** : Boutons +/- pour ajuster la taille du preview

**Rendu** :
- Template HTML avec données injectées
- Style CSS du template appliqué
- Watermark superposé en CSS

**Interactions** :
- Scroll synchronisé : clic sur une section du formulaire → scroll vers cette section dans le preview
- Bouton "Mode plein écran" pour voir le preview en grand

---

### Phase 3 : Sélection du Template

#### Étape 3.1 : Galerie de Templates
**URL** : `https://cvbuilder.com/templates` ou section dans `/builder`

**Affichage** :
- **Grid responsive** : 3 colonnes (desktop), 2 (tablet), 1 (mobile)
- Pour chaque template :
  - Miniature (screenshot du template)
  - Nom du template
  - Badge "Gratuit" ou "Premium"
  - Bouton "Utiliser ce template"

**Templates Disponibles** :

1. **Simple** (Gratuit)
   - Design épuré, sobre
   - Colonnes simple
   - Idéal pour tous secteurs

2. **Modern** (Premium)
   - Sidebar colorée (gradient)
   - Photo de profil circulaire
   - Design moderne et créatif

3. **Professional** (Premium)
   - Layout classique deux colonnes
   - Typographie élégante
   - Parfait pour secteur corporate

4. **Creative** (Premium - à créer)
   - Design original avec formes géométriques
   - Couleurs vives
   - Pour secteurs créatifs

5. **Minimal** (Premium - à créer)
   - Ultra épuré
   - Beaucoup d'espace blanc
   - Typographie comme focus principal

#### Étape 3.2 : Comportement selon Statut

**Cas 1 : Utilisateur sélectionne template GRATUIT (Simple)**
- ✅ Preview **SANS watermark**
- ✅ Export PDF **SANS watermark** possible immédiatement
- ✅ Pas de paiement requis

**Cas 2 : Utilisateur sélectionne template PREMIUM**
- ⚠️ Preview **AVEC watermark "PREVIEW"**
- ⚠️ Message : "Ce template est premium. Achetez ce CV ou abonnez-vous pour retirer le watermark."
- 🔒 Export PDF désactivé (ou avec watermark si export permis)

**Boutons d'action** :
- "Utiliser ce template" : Applique le template au CV
- "Aperçu" : Ouvre un modal avec preview du template (avec données exemple)

---

### Phase 4 : Paiement (Monétisation)

#### Étape 4.1 : Déclenchement du Paiement

**Moments où le paiement est proposé** :

1. **Sélection d'un template premium** :
   - Message : "Ce template nécessite un paiement"
   - CTA : "Débloquer ce template"

2. **Tentative d'export avec template premium** :
   - Message : "Retirez le watermark en achetant ce CV"
   - CTA : "Acheter maintenant"

3. **Page dédiée `/pricing`** :
   - Tableau comparatif des offres

#### Étape 4.2 : Options de Paiement

**Interface** : Modal ou page `/payment`

**3 Options proposées** :

**Option 1 : Achat CV Unique**
- **Prix** : 9,99 € (one-time)
- **Avantages** :
  - ✅ 1 CV sans watermark
  - ✅ Export illimité de CE CV
  - ✅ 1 template premium au choix
  - ✅ Modifications illimitées de CE CV
- **CTA** : "Acheter ce CV - 9,99 €"
- **Stripe Product** : `price_single_cv_999`

**Option 2 : Abonnement Mensuel**
- **Prix** : 14,99 € / mois (recurring)
- **Avantages** :
  - ✅ Accès illimité à TOUS les templates premium
  - ✅ Création de CV illimités
  - ✅ Export illimité sans watermark
  - ✅ Nouvelles fonctionnalités en priorité
  - ✅ Support prioritaire
- **Badge** : "Le plus flexible"
- **CTA** : "S'abonner - 14,99 €/mois"
- **Stripe Product** : `price_subscription_monthly_1499`

**Option 3 : Abonnement Annuel**
- **Prix** : 149,99 € / an (recurring, économie de ~17%)
- **Avantages** :
  - ✅ Tous les avantages de l'abonnement mensuel
  - ✅ Économie de 30 € / an
  - ✅ Accès prioritaire aux nouveaux templates
- **Badge** : "Meilleure offre - 17% d'économie"
- **CTA** : "S'abonner - 149,99 €/an"
- **Stripe Product** : `price_subscription_yearly_14999`

#### Étape 4.3 : Flux de Paiement Stripe

**Étape 1 : Clic sur CTA de paiement**
```javascript
// Frontend
onClick={() => {
  // Appel API backend pour créer Checkout Session
  const response = await fetch('/api/payments/create-checkout/', {
    method: 'POST',
    body: JSON.stringify({
      payment_type: 'single', // ou 'monthly', 'yearly'
      resume_id: currentResumeId, // Pour achat unique
    })
  });

  const { url } = await response.json();

  // Redirection vers Stripe Checkout
  window.location.href = url;
}
```

**Étape 2 : Redirection vers Stripe Checkout**
- Page hébergée par Stripe (sécurisée, PCI-compliant)
- Formulaire de paiement par carte
- Support 3D Secure

**Cartes de test Stripe** :
- Succès : `4242 4242 4242 4242`
- 3D Secure : `4000 0027 6000 3184`
- Refusée : `4000 0000 0000 0002`

**Étape 3 : Paiement réussi**
- Stripe envoie webhook `checkout.session.completed` au backend
- Backend traite le webhook :
  ```python
  # Si achat unique
  resume.is_paid = True
  resume.payment_type = 'single'
  resume.save()

  # Si abonnement
  user.is_premium = True
  user.subscription_type = 'monthly' # ou 'yearly'
  user.subscription_end_date = now + timedelta(days=30)
  user.save()
  ```
- Redirection vers `/payment/success?session_id={CHECKOUT_SESSION_ID}`

**Étape 4 : Page de succès**
- Message de confirmation : "Paiement réussi ! ✓"
- Récapitulatif :
  - Montant payé
  - Type d'achat (CV unique / Abonnement)
  - Numéro de transaction
- CTA : "Retour à mon CV" → Redirect vers `/builder` ou `/dashboard`

**Étape 5 : Paiement échoué**
- Redirection vers `/payment/cancel`
- Message : "Le paiement a été annulé"
- CTA : "Réessayer" → Retour vers options de paiement

#### Étape 4.4 : Webhooks Stripe (Backend)

**Événements écoutés** :

1. **`checkout.session.completed`**
   - Déclenché : Paiement réussi (one-time ou abonnement)
   - Action : Mettre à jour statut du CV ou user

2. **`customer.subscription.created`**
   - Déclenché : Nouvel abonnement créé
   - Action : Activer premium pour l'utilisateur

3. **`customer.subscription.updated`**
   - Déclenché : Renouvellement ou modification abonnement
   - Action : Prolonger subscription_end_date

4. **`customer.subscription.deleted`**
   - Déclenché : Annulation abonnement
   - Action : Désactiver premium (à la fin de la période payée)

5. **`invoice.payment_succeeded`**
   - Déclenché : Paiement récurrent réussi
   - Action : Envoyer email de confirmation

6. **`invoice.payment_failed`**
   - Déclenché : Paiement récurrent échoué
   - Action : Envoyer email d'alerte, grace period de 7 jours

**Endpoint** : `POST /api/payments/webhook/`

**Sécurité** :
- Vérification signature Stripe avec `STRIPE_WEBHOOK_SECRET`
- Log de tous les événements dans table `WebhookEvent`

---

### Phase 5 : Export du CV

#### Étape 5.1 : Accès à l'Export

**Localisation** :
- Bouton "Télécharger" dans `/builder` (header ou sidebar)
- Page dédiée `/export` avec options

**Vérification avant export** :

**Cas 1 : Template gratuit**
- ✅ Export autorisé sans paiement

**Cas 2 : Template premium + CV payé**
- ✅ Export sans watermark autorisé

**Cas 3 : Template premium + Utilisateur abonné actif**
- ✅ Export sans watermark autorisé

**Cas 4 : Template premium + Non payé**
- ⚠️ Export avec watermark (ou modal de paiement)

#### Étape 5.2 : Formats d'Export

**Format 1 : PDF (Prioritaire)**

**Méthode Backend (Recommandée)** :
```python
# Backend - resumes/services.py
from weasyprint import HTML, CSS
from django.template.loader import render_to_string

def generate_pdf(resume, watermark=False):
    # Récupérer template HTML/CSS
    template_html = resume.template.template_html
    template_css = resume.template.template_css

    # Contexte pour le template
    context = {
        'resume': resume,
        'watermark': watermark
    }

    # Render HTML
    html_content = render_to_string('cv_template.html', context)

    # Générer PDF avec WeasyPrint
    pdf = HTML(string=html_content).write_pdf(
        stylesheets=[CSS(string=template_css)]
    )

    return pdf
```

**Endpoint** : `POST /api/resumes/{id}/export_pdf/`

**Réponse** :
```json
{
  "pdf_url": "https://cvbuilder.com/media/resumes/cv_jean_dupont.pdf",
  "has_watermark": false,
  "filename": "Jean_Dupont_CV.pdf"
}
```

**Méthode Frontend (Alternative)** :
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function exportToPDF() {
  const element = document.getElementById('cv-preview');
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  pdf.save('CV_Jean_Dupont.pdf');
}
```

**Format 2 : Google Docs**

**Méthode** :
- Utiliser Google Docs API
- Créer un nouveau document
- Injecter le contenu du CV (texte formaté)
- Retourner lien partageable

**Endpoint** : `POST /api/resumes/{id}/export_google_docs/`

**Format 3 : Microsoft Word (.docx)**

**Méthode** :
```python
from docx import Document
from docx.shared import Pt, RGBColor

def export_to_docx(resume):
    doc = Document()

    # En-tête
    doc.add_heading(resume.full_name, 0)
    doc.add_paragraph(resume.title)

    # Informations de contact
    doc.add_paragraph(f"{resume.email} | {resume.phone}")

    # Résumé
    doc.add_heading('Résumé professionnel', level=1)
    doc.add_paragraph(resume.summary)

    # Expériences
    doc.add_heading('Expérience professionnelle', level=1)
    for exp in resume.experience_data:
        doc.add_heading(f"{exp['position']} - {exp['company']}", level=2)
        doc.add_paragraph(exp['description'])

    # ... etc

    doc.save('CV_Jean_Dupont.docx')
    return doc
```

**Format 4 : OpenOffice (.odt)**

**Méthode** :
```python
from odf.opendocument import OpenDocumentText
from odf.text import P, H

def export_to_odt(resume):
    doc = OpenDocumentText()

    # Titre
    h = H(outlinelevel=1, text=resume.full_name)
    doc.text.addElement(h)

    # Contenu
    p = P(text=resume.summary)
    doc.text.addElement(p)

    # ... etc

    doc.save('CV_Jean_Dupont.odt')
    return doc
```

#### Étape 5.3 : Interface d'Export

**Modal ou Page `/export`** :

```
┌─────────────────────────────────────────┐
│  Exporter votre CV                      │
├─────────────────────────────────────────┤
│                                         │
│  Choisissez un format :                 │
│                                         │
│  [📄 PDF]    [📘 Google Docs]          │
│  [📝 Word]   [📋 OpenOffice]            │
│                                         │
│  Options :                              │
│  ☐ Inclure la photo de profil          │
│  ☐ Version couleur / noir et blanc      │
│                                         │
│  [Télécharger]    [Annuler]             │
└─────────────────────────────────────────┘
```

---

### Phase 6 : Authentification (Optionnelle)

#### Étape 6.1 : Connexion / Inscription

**Déclencheurs** :
- Utilisateur clique "Se connecter" dans le header
- Tentative d'accéder au dashboard (`/dashboard`)
- Après paiement : proposition de créer un compte

**Modal de Connexion** :

**Onglet 1 : Connexion**
```
Email : [___________________]
Mot de passe : [___________________]

[Mot de passe oublié ?]

[Se connecter]

Ou se connecter avec :
[Google] [LinkedIn]
```

**Onglet 2 : Inscription**
```
Nom d'utilisateur : [___________________]
Email : [___________________]
Mot de passe : [___________________]
Confirmer mot de passe : [___________________]

☐ J'accepte les CGU et la politique de confidentialité

[S'inscrire]

Ou s'inscrire avec :
[Google] [LinkedIn]
```

**Backend API** :
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion (retourne access + refresh tokens JWT)
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/profile/` - Profil utilisateur

#### Étape 6.2 : Associer CV Anonyme au Compte

**Comportement** :
Quand un utilisateur s'inscrit/connecte :
1. Vérifier si `session_id` existe
2. Récupérer les CV créés avec ce `session_id`
3. Mettre à jour `user_id` de ces CV
4. Détacher `session_id`

```python
# Backend - après connexion/inscription
session_id = request.session.session_key
if session_id:
    # Associer les CV de la session à l'utilisateur
    Resume.objects.filter(session_id=session_id).update(
        user=request.user,
        session_id=None
    )
```

---

### Phase 7 : Dashboard Utilisateur (Après Connexion)

#### Étape 7.1 : Accès au Dashboard
**URL** : `https://cvbuilder.com/dashboard`

**Authentification requise** : Oui (JWT)

#### Étape 7.2 : Contenu du Dashboard

**Section 1 : Informations de l'Utilisateur**
```
┌──────────────────────────────────────────┐
│  [Photo]  Jean Dupont                    │
│           jean@example.com               │
│                                          │
│  Statut : Premium ✓ (Abonnement mensuel) │
│  Renouvellement : 15 janvier 2026        │
│                                          │
│  [Gérer mon abonnement]                  │
└──────────────────────────────────────────┘
```

**Section 2 : Mes CV**
```
┌──────────────────────────────────────────┐
│  Mes CV (3)                              │
├──────────────────────────────────────────┤
│  [Miniature]  CV Développeur Full Stack  │
│              Template : Modern            │
│              Modifié : Il y a 2 jours    │
│              [Modifier] [Télécharger]    │
├──────────────────────────────────────────┤
│  [Miniature]  CV Data Scientist          │
│              Template : Simple            │
│              Modifié : Il y a 1 semaine  │
│              [Modifier] [Télécharger]    │
├──────────────────────────────────────────┤
│  [+ Créer un nouveau CV]                 │
└──────────────────────────────────────────┘
```

**Section 3 : Historique des Paiements**
```
┌──────────────────────────────────────────┐
│  Historique des paiements                │
├──────────────────────────────────────────┤
│  15/12/2025  Abonnement mensuel  14,99 € │
│  15/11/2025  Abonnement mensuel  14,99 € │
│  10/10/2025  CV unique           9,99 €  │
│                                          │
│  [Télécharger la facture]                │
└──────────────────────────────────────────┘
```

**Section 4 : Paramètres**
- Modifier profil (nom, email, téléphone)
- Changer mot de passe
- Supprimer compte

#### Étape 7.3 : Gestion de l'Abonnement

**Stripe Customer Portal** :
- Bouton "Gérer mon abonnement"
- Redirection vers portail Stripe hébergé
- Actions possibles :
  - Mettre à jour mode de paiement
  - Télécharger factures
  - Annuler abonnement
  - Modifier plan (mensuel ↔ annuel)

**Endpoint** : `GET /api/payments/customer-portal/`

---

### Phase 8 : Import depuis LinkedIn

#### Étape 8.1 : Déclenchement de l'Import

**Localisation** :
- Bouton "Importer depuis LinkedIn" dans `/builder` (section Informations Personnelles)

**Interface** :
```
┌─────────────────────────────────────────┐
│  Importer depuis LinkedIn               │
├─────────────────────────────────────────┤
│  Gagnez du temps en important vos       │
│  informations professionnelles depuis   │
│  votre profil LinkedIn.                 │
│                                         │
│  Informations importées :               │
│  ✓ Nom et prénom                        │
│  ✓ Titre professionnel                 │
│  ✓ Résumé                               │
│  ✓ Expériences professionnelles         │
│  ✓ Formations                           │
│  ✓ Compétences                          │
│                                         │
│  [Se connecter à LinkedIn]              │
└─────────────────────────────────────────┘
```

#### Étape 8.2 : Flux OAuth LinkedIn

**Étape 1 : Autorisation**
- Clic sur "Se connecter à LinkedIn"
- Redirect vers LinkedIn OAuth :
  ```
  https://www.linkedin.com/oauth/v2/authorization?
    response_type=code&
    client_id={LINKEDIN_CLIENT_ID}&
    redirect_uri=http://localhost:8000/api/auth/linkedin/callback&
    scope=r_liteprofile r_emailaddress
  ```

**Étape 2 : Callback**
- LinkedIn redirige vers `/api/auth/linkedin/callback?code=xxx`
- Backend échange le code contre un access token
- Backend appelle LinkedIn API pour récupérer données

**Étape 3 : Parsing des Données**
```python
# Backend - resumes/services.py
class LinkedInImporter:
    def import_profile(self, access_token):
        # Récupérer profil
        profile = self._fetch_profile(access_token)

        # Extraire données
        data = {
            'full_name': f"{profile['firstName']} {profile['lastName']}",
            'email': profile['emailAddress'],
            'title': profile['headline'],
            'summary': profile['summary'],

            'experience_data': self._parse_positions(profile['positions']),
            'education_data': self._parse_education(profile['educations']),
            'skills_data': self._parse_skills(profile['skills']),
        }

        return data
```

**Étape 4 : Pré-remplissage du Formulaire**
- Les données importées remplissent le formulaire
- L'utilisateur peut modifier avant sauvegarde
- Message de confirmation : "Données importées depuis LinkedIn ✓"

---

## 3. Logique Métier et Règles

### Règles de Watermark

| Situation                                  | Watermark ? |
|--------------------------------------------|-------------|
| Template gratuit (Simple)                  | ❌ NON      |
| Template premium + CV payé (achat unique)  | ❌ NON      |
| Template premium + Utilisateur premium     | ❌ NON      |
| Template premium + Non payé                | ✅ OUI      |

### Règles de Paiement

**Achat unique (9,99 €)** :
- ✅ Débloque 1 CV avec 1 template premium
- ✅ Modifications illimitées de CE CV
- ✅ Export illimité de CE CV
- ❌ Pas d'accès aux autres templates premium

**Abonnement (14,99 €/mois ou 149,99 €/an)** :
- ✅ Accès à TOUS les templates premium
- ✅ Création de CV illimités
- ✅ Export illimité sans watermark
- ✅ Priorité support et nouvelles fonctionnalités
- ⚠️ Annulation possible à tout moment (fin de période payée)

### Gestion des Sessions Anonymes

**Durée de vie** :
- Session Django : 2 semaines (configurable)
- Cookie : `SESSION_COOKIE_AGE = 1209600` (14 jours)

**Expiration** :
- Après 14 jours d'inactivité : suppression de la session
- CV associés à `session_id` : conservés 30 jours puis supprimés automatiquement (tâche Celery)

**Migration vers compte** :
- Si utilisateur crée compte dans les 14 jours : CV transférés
- Sinon : CV perdus (inciter à créer compte)

---

## 4. Sécurité et Conformité

### Authentification & Autorisation

**JWT (JSON Web Tokens)** :
- Access token : 15 minutes
- Refresh token : 7 jours
- Rotation des refresh tokens activée
- Stockage sécurisé (httpOnly cookies recommandé)

**Permissions API** :
- `/api/resumes/` : AllowAny (lecture + création anonyme)
- `/api/auth/profile/` : IsAuthenticated
- `/api/payments/` : AllowAny (pour checkout), IsAuthenticated (pour historique)

### Protection des Données (RGPD)

**Consentement** :
- Checkbox CGU + Politique de confidentialité à l'inscription
- Cookie banner pour analytics (si implémenté)

**Droit à l'oubli** :
- Bouton "Supprimer mon compte" dans Dashboard
- Suppression de tous les CV associés
- Conservation des paiements pour obligations légales (10 ans)

**Portabilité** :
- Export de toutes les données utilisateur en JSON

**Sécurité** :
- HTTPS obligatoire en production
- CORS configuré strictement
- Validation de tous les inputs
- Protection CSRF (Django)
- Rate limiting sur API sensibles (login, register)

### Stripe - Sécurité Paiements

**PCI Compliance** :
- Utilisation de Stripe Checkout (hosted)
- Aucune donnée de carte stockée côté backend

**Webhooks** :
- Vérification signature avec `STRIPE_WEBHOOK_SECRET`
- Validation de l'origine des événements

---

## 5. Performance et Scalabilité

### Optimisations Backend

**Database** :
- Index sur `session_id`, `user_id`, `email`
- `select_related()` et `prefetch_related()` pour requêtes complexes
- Pagination des listes (10 items par page)

**Cache** :
- Redis pour sessions
- Cache des templates de CV (rarement modifiés)
- Cache des requêtes API fréquentes

**Async Tasks (Celery)** :
- Génération PDF en arrière-plan
- Envoi d'emails (confirmations, factures)
- Import LinkedIn (peut être long)
- Nettoyage des sessions expirées (tâche périodique)

### Optimisations Frontend

**Next.js 16** :
- Server Components pour contenu statique
- Client Components pour interactivité
- Image optimization (`next/image`)
- Code splitting automatique

**MUI** :
- Tree shaking activé
- Import sélectif : `import Button from '@mui/material/Button'`
- Utilisation du CDN pour fonts

**Performance** :
- Lazy loading des sections du formulaire
- Debounce sur auto-save (300ms)
- Virtual scrolling pour listes longues (si >50 items)

---

## 6. Accessibilité (WCAG 2.1 AA)

### Normes Respectées

**Contraste** :
- Ratio minimum 4.5:1 pour texte normal
- Ratio minimum 3:1 pour texte large et éléments UI

**Navigation au clavier** :
- Tab order logique
- Focus visible sur tous les éléments interactifs
- Escape pour fermer modals
- Entrée pour soumettre formulaires

**ARIA** :
- Labels sur tous les champs de formulaire
- `aria-invalid` sur champs en erreur
- `aria-describedby` pour messages d'aide/erreur
- `role="alert"` pour notifications

**Touch Targets** :
- Minimum 44x44px (WCAG) ou 48x48px (Material Design)
- Espacement entre éléments cliquables

**Responsive** :
- Zoom jusqu'à 200% sans perte de fonctionnalité
- Pas de scroll horizontal
- Réorganisation du contenu en mobile

---

## 7. Roadmap Fonctionnalités Futures

### Phase 1 (MVP) - Mois 1-2 ✅
- ✅ Formulaire CV complet
- ✅ 1 template gratuit
- ✅ 2-3 templates premium
- ✅ Paiement Stripe (achat unique + abonnements)
- ✅ Export PDF
- ✅ Preview en temps réel
- ✅ Watermark system

### Phase 2 - Mois 3-4
- Import LinkedIn
- Export Google Docs, Word, OpenOffice
- Dashboard utilisateur complet
- Système de templates dynamiques (éditeur de templates)
- Analytics (tracking conversions)

### Phase 3 - Mois 5-6
- Editor de templates en drag & drop (pour admins)
- Suggestions IA pour résumé et descriptions
- Vérification orthographe et grammaire
- Partage de CV par lien unique
- QR code sur CV

### Phase 4 - Mois 7+
- Import CV depuis PDF (parsing)
- Templates pour lettres de motivation
- Portfolio en ligne généré automatiquement
- Intégration job boards (Indeed, LinkedIn Jobs)
- Traduction multilingue des CV
- A/B testing de templates (taux de conversion)

---

## 8. Indicateurs de Succès (KPIs)

### Métriques d'Acquisition
- **Visiteurs uniques** : >10,000 / mois (objectif 6 mois)
- **Taux de conversion visiteur → créateur CV** : >40%
- **Taux de complétion formulaire** : >70%

### Métriques de Monétisation
- **Taux de conversion gratuit → payant** : >5%
- **MRR (Monthly Recurring Revenue)** : >5,000 € (objectif 6 mois)
- **ARPU (Average Revenue Per User)** : >12 €

### Métriques d'Engagement
- **Temps moyen sur site** : >10 minutes
- **Nombre moyen de modifications par CV** : >5
- **Taux de retour (utilisateurs connectés)** : >30%

### Métriques Techniques
- **Temps de chargement** : <3s (Lighthouse score >90)
- **Disponibilité** : >99.5% uptime
- **Taux d'erreur API** : <1%

---

## 9. Contraintes et Limitations

### Techniques
- **Taille max photo de profil** : 5 MB
- **Nombre max de CV par utilisateur gratuit** : 3
- **Nombre max de CV par utilisateur premium** : Illimité
- **Rétention des CV anonymes** : 30 jours après dernière modification

### Légales
- **RGPD** : Conformité obligatoire (EU)
- **PCI-DSS** : Délégué à Stripe
- **CGU** : Acceptation requise à l'inscription

### Business
- **Commission Stripe** : ~2.9% + 0.25 € par transaction
- **Coût hébergement** : ~50-100 € / mois (début)
- **Budget marketing** : À définir

---

## 10. Diagrammes

### Diagramme de Flux Utilisateur

```
[Page d'accueil]
      |
      v
[Clic "Créer mon CV"]
      |
      v
[Formulaire CV] ←→ [Preview temps réel avec watermark]
      |
      v
[Sélection template]
      |
      ├─→ [Template gratuit] → [Export PDF sans watermark]
      |
      └─→ [Template premium]
                |
                v
          [Paiement requis]
                |
                ├─→ [Achat unique 9,99€] → [CV sans watermark]
                |
                ├─→ [Abonnement 14,99€/mois] → [Tous templates débloqués]
                |
                └─→ [Abonnement 149,99€/an] → [Tous templates débloqués]
```

### Schéma Base de Données (simplifié)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │       │   Resume     │       │  Template   │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id          │<──┐   │ id           │   ┌──>│ id          │
│ email       │   │   │ session_id   │   │   │ name        │
│ is_premium  │   └───│ user_id      │   │   │ is_premium  │
│ stripe_id   │       │ template_id  │───┘   │ html        │
└─────────────┘       │ full_name    │       │ css         │
       │              │ email        │       └─────────────┘
       │              │ is_paid      │
       │              └──────────────┘
       │
       │              ┌──────────────┐
       │              │  Payment     │
       │              ├──────────────┤
       └──────────────│ user_id      │
                      │ resume_id    │
                      │ amount       │
                      │ stripe_id    │
                      └──────────────┘
```

---

## 11. Stack Technique Récapitulatif

```
┌─────────────────────────────────────────────┐
│              FRONTEND (Client)              │
│                                             │
│  Next.js 16 + TypeScript                   │
│  MUI Components + Tailwind CSS             │
│  Zustand (State) + React Hook Form         │
│  Axios + Stripe.js                         │
└─────────────────────────────────────────────┘
                     ↕ HTTPS / REST API
┌─────────────────────────────────────────────┐
│              BACKEND (Serveur)              │
│                                             │
│  Django 5.1 + DRF                          │
│  JWT Authentication                         │
│  PostgreSQL (données)                       │
│  Redis (cache + Celery)                    │
│  WeasyPrint (PDF)                          │
│  Stripe (paiements)                         │
└─────────────────────────────────────────────┘
                     ↕
┌─────────────────────────────────────────────┐
│         SERVICES EXTERNES                   │
│                                             │
│  Stripe (Paiements + Webhooks)             │
│  LinkedIn (OAuth + API)                     │
│  AWS S3 / Cloudinary (Stockage fichiers)   │
│  SendGrid / Mailgun (Emails)               │
└─────────────────────────────────────────────┘
```

---

## Conclusion

Ce projet CV Builder est conçu pour offrir une **expérience utilisateur fluide** sans friction :
- ✅ **Pas de login requis** pour commencer
- ✅ **Preview en temps réel** pour feedback immédiat
- ✅ **Modèle freemium équitable** : 1 template gratuit de qualité
- ✅ **Monétisation claire** : achat unique ou abonnement
- ✅ **Export multi-formats** pour compatibilité maximale
- ✅ **Accessibilité WCAG** pour inclusion
- ✅ **Performance optimisée** avec Next.js 16 et caching

Le MVP peut être développé en **6-8 semaines** avec les fonctionnalités essentielles, puis itéré avec les fonctionnalités avancées (IA, import LinkedIn, etc.).

**Prochaine étape** : Finaliser le backend (vues + services) puis créer le frontend Next.js en suivant les exemples du README.md.
