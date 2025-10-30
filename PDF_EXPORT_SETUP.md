# Configuration de l'Export PDF avec Playwright

## Vue d'ensemble

L'export PDF utilise **Playwright** pour générer des PDF à partir de templates HTML/CSS avec support JavaScript. Cela permet d'utiliser des templates dynamiques (Handlebars, React, etc.).

## Installation

### Installation Automatique (Docker)

Si vous utilisez Docker (recommandé), Playwright est déjà installé dans le Dockerfile :

```bash
# Rebuild le container backend avec Playwright
docker compose build backend
docker compose up -d backend
```

Le Dockerfile inclut :
- Toutes les dépendances système nécessaires pour Playwright
- Installation automatique de Playwright via pip
- Installation automatique du navigateur Chromium

**Status** : ✅ Installation complète et fonctionnelle dans Docker

### Installation Manuelle (Développement Local)

Si vous développez en local sans Docker :

#### 1. Installer les dépendances Python

```bash
cd backend
source venv/bin/activate  # Activer l'environnement virtuel
pip install -r requirements.txt
```

#### 2. Installer les navigateurs Playwright

**IMPORTANT** : Après avoir installé le package Python, vous devez installer les navigateurs :

```bash
playwright install chromium
```

Ou pour installer tous les navigateurs :

```bash
playwright install
```

#### 3. Dépendances système (Linux uniquement)

Sur Linux, vous aurez besoin de dépendances système :

```bash
# Ubuntu/Debian
playwright install-deps

# Ou manuellement
apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2
```

**Note** : Sur macOS, aucune dépendance système supplémentaire n'est nécessaire.

## Architecture

### Fichiers créés

1. **`backend/resumes/pdf_service.py`** - Service de génération PDF
   - Classe `PDFGenerationService`
   - Méthode `generate_pdf()` (async)
   - Méthode `generate_pdf_sync()` (sync wrapper)

2. **`backend/resumes/views.py`** - Endpoint modifié
   - `export_pdf()` utilise maintenant Playwright
   - Support des templates JavaScript
   - Vérification premium/paiement

### Flux de génération PDF

```
Client (Frontend)
    ↓
POST /api/resumes/{id}/export_pdf/
    ↓
Django View (export_pdf)
    ↓
Vérification des permissions (premium/paiement)
    ↓
PDFGenerationService.generate_pdf_sync()
    ↓
Playwright (Chromium headless)
    ↓
- Injecte window.cvData
    ↓
- Charge HTML + CSS
    ↓
- Exécute JavaScript
    ↓
- Génère PDF
    ↓
Retourne PDF au client
```

## Utilisation

### Format des données CV

Les données sont injectées dans `window.cvData` avec la structure suivante :

```javascript
window.cvData = {
  personalInfo: {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue Example",
    city: "Paris",
    postalCode: "75001",
    website: "https://jeandupont.com",
    linkedin: "linkedin.com/in/jeandupont",
    github: "github.com/jeandupont",
    jobTitle: "Développeur Full Stack",
    dateOfBirth: "1990-01-15",
    nationality: "Française",
    drivingLicense: "Permis B"
  },
  professionalSummary: "5 ans d'expérience...",
  experiences: [
    {
      position: "Senior Developer",
      company: "TechCorp",
      startDate: "2020-01",
      endDate: "Présent",
      description: "Développement d'applications web..."
    }
  ],
  education: [
    {
      degree: "Master Informatique",
      school: "Université de Paris",
      startDate: "2015",
      endDate: "2017",
      description: "Spécialisation en développement web"
    }
  ],
  skills: [
    { name: "JavaScript", level: "Expert" },
    { name: "Python", level: "Avancé" }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Courant" }
  ],
  hobbies: [],
  references: []
};
```

### Exemple de template HTML

```html
<div id="cv-container">
  <h1 id="name"></h1>
  <h2 id="title"></h2>
  <div id="contact"></div>
  <div id="summary"></div>
  <div id="experiences"></div>
</div>

<script>
  // Accès aux données
  const data = window.cvData;

  // Remplir le template
  document.getElementById('name').textContent =
    `${data.personalInfo.firstName} ${data.personalInfo.lastName}`;

  document.getElementById('title').textContent =
    data.personalInfo.jobTitle;

  // ... etc
</script>
```

### Template avec Handlebars

```html
<div id="cv-container"></div>

<script id="cv-template" type="text/x-handlebars-template">
  <div class="cv">
    <h1>{{personalInfo.firstName}} {{personalInfo.lastName}}</h1>
    <h2>{{personalInfo.jobTitle}}</h2>

    {{#if professionalSummary}}
    <section class="summary">
      <h3>Résumé</h3>
      <p>{{professionalSummary}}</p>
    </section>
    {{/if}}

    {{#if experiences}}
    <section class="experiences">
      <h3>Expérience</h3>
      {{#each experiences}}
      <div class="experience">
        <h4>{{position}}</h4>
        <p>{{company}} | {{startDate}} - {{endDate}}</p>
        <p>{{description}}</p>
      </div>
      {{/each}}
    </section>
    {{/if}}
  </div>
</script>

<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js"></script>
<script>
  const source = document.getElementById('cv-template').innerHTML;
  const template = Handlebars.compile(source);
  const html = template(window.cvData);
  document.getElementById('cv-container').innerHTML = html;
</script>
```

## Configuration des templates

### Modèle Template (Django)

```python
class Template(models.Model):
    name = models.CharField(max_length=255)
    template_html = models.TextField()  # Code HTML
    template_css = models.TextField()   # Code CSS
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
```

### Exemple de CSS

```css
@page {
  size: A4;
  margin: 0;
}

body {
  margin: 0;
  padding: 20mm;
  font-family: 'Arial', sans-serif;
  font-size: 11pt;
  line-height: 1.4;
}

.cv {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24pt;
  margin-bottom: 5px;
}

h2 {
  font-size: 14pt;
  color: #666;
  font-weight: normal;
  margin-top: 0;
}

/* ... */
```

## Vérification des permissions

L'endpoint vérifie automatiquement :

### Templates gratuits
✅ Exportables par tous (authentifiés ou anonymes)

### Templates premium
- ✅ Utilisateurs premium (payé 24€)
- ✅ CV payé individuellement (payé 2,40€)
- ❌ Autres utilisateurs → Erreur 402 Payment Required

```python
if template.is_premium:
    user_is_premium = request.user.is_premium if request.user.is_authenticated else False
    cv_is_paid = resume.is_paid

    if not user_is_premium and not cv_is_paid:
        return Response({
            'error': 'Payment required',
            'message': 'Ce modèle est premium...',
            'payment_options': {
                'per_cv': 2.40,
                'premium_unlimited': 24.00
            }
        }, status=402)
```

## Performance

### Optimisations

1. **Headless mode** : Le navigateur tourne en mode headless (pas d'interface graphique)
2. **No sandbox** : Pour les environnements Docker
3. **Wait for networkidle** : Attend que toutes les ressources soient chargées
4. **Timeout de 1s** : Laisse le temps au JavaScript de s'exécuter

### Considérations

- **Temps de génération** : ~2-3 secondes par PDF
- **Mémoire** : ~100-200 MB par instance Chromium
- **Parallélisme** : Chaque requête lance un nouveau navigateur

### Pour la production

Pour améliorer les performances en production :

1. **Utiliser Celery** : Générer les PDF en async
2. **Pool de navigateurs** : Réutiliser les instances Chromium
3. **Cache** : Mettre en cache les PDF générés
4. **CDN** : Servir les PDF depuis un CDN

```python
# Exemple avec Celery (futur)
from celery import shared_task

@shared_task
def generate_pdf_async(resume_id):
    # Génération asynchrone
    pass
```

## Debugging

### Logs

Les logs sont activés automatiquement :

```python
logger.info(f'Starting PDF export for resume {resume.id}')
logger.info(f'Using template {template.id} (premium: {template.is_premium})')
logger.info('Generating PDF with Playwright')
logger.info(f'PDF generated successfully: {len(pdf_content)} bytes')
```

### Erreurs courantes

1. **`playwright not installed`**
   ```bash
   pip install playwright
   playwright install chromium
   ```

2. **`Error: Browser closed`**
   - Vérifier les dépendances système
   - Essayer `playwright install-deps`

3. **`TimeoutError`**
   - Augmenter le timeout dans `pdf_service.py`
   - Vérifier que le HTML ne charge pas de ressources externes lentes

4. **PDF vide ou mal formaté**
   - Vérifier que le JavaScript s'exécute correctement
   - Ajouter `console.log()` dans le template
   - Utiliser `page.screenshot()` pour débugger visuellement

### Mode debug

Pour activer le mode non-headless (voir le navigateur) :

```python
# Dans pdf_service.py
browser = await p.chromium.launch(
    headless=False,  # Changé à False
    args=['--no-sandbox']
)
```

## Tests

### Test manuel

```bash
# Dans Django shell
python manage.py shell

from resumes.models import Resume
from resumes.pdf_service import PDFGenerationService

resume = Resume.objects.first()
# Tester la génération
```

### Test via API

```bash
curl -X POST \
  http://localhost:8000/api/resumes/1/export_pdf/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output cv.pdf
```

## Mise en production

### Docker

```dockerfile
FROM python:3.11

# Install Playwright dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    # ... autres dépendances

# Install Python packages
RUN pip install playwright
RUN playwright install chromium

# ...
```

### Variables d'environnement

```env
# Pour désactiver le sandbox (Docker)
PLAYWRIGHT_NO_SANDBOX=1
```

## Prochaines améliorations

- [ ] Support des fonts personnalisées
- [ ] Watermark pour templates non payés
- [ ] Génération asynchrone avec Celery
- [ ] Pool de navigateurs réutilisables
- [ ] Cache des PDF générés
- [ ] Support des images uploadées
- [ ] Templates React/Vue
