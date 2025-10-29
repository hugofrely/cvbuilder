# Variables de Template CV - Référence Complète

Ce document liste toutes les variables disponibles dans les templates HTML pour créer des CV.

## Informations Personnelles

### Variables Simples

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{full_name}}` | String | Nom complet (prénom + nom) | "Jean Dupont" |
| `{{email}}` | String | Adresse email | "jean.dupont@email.com" |
| `{{phone}}` | String | Numéro de téléphone | "+33 6 12 34 56 78" |
| `{{address}}` | String | Adresse postale | "15 rue de la Paix" |
| `{{city}}` | String | Ville | "Paris" |
| `{{postal_code}}` | String | Code postal | "75001" |
| `{{title}}` | String | Titre du poste / profession | "Développeur Full-Stack" |
| `{{photo}}` | String | URL de la photo (base64 ou URL) | "data:image/jpeg;base64,..." |
| `{{date_of_birth}}` | String | Date de naissance (format YYYY-MM-DD) | "1990-05-15" |
| `{{nationality}}` | String | Nationalité | "Française" |
| `{{driving_license}}` | String | Type de permis de conduire | "Permis B" |
| `{{linkedin_url}}` | String | URL du profil LinkedIn | "https://linkedin.com/in/jean-dupont" |
| `{{website}}` | String | Site web / Portfolio | "https://jeandupont.dev" |
| `{{summary}}` | String | Résumé professionnel (texte multiligne) | "Développeur passionné avec 5 ans d'expérience..." |

### Exemples d'utilisation

```html
<!-- En-tête du CV -->
<div class="header">
  <img src="{{photo}}" alt="{{full_name}}" />
  <h1>{{full_name}}</h1>
  <h2>{{title}}</h2>
  <p>{{email}} | {{phone}}</p>
  <p>{{address}}, {{postal_code}} {{city}}</p>
  {% if linkedin_url %}
    <a href="{{linkedin_url}}">LinkedIn</a>
  {% endif %}
  {% if website %}
    <a href="{{website}}">Portfolio</a>
  {% endif %}
</div>

<!-- Informations complémentaires -->
<div class="personal-details">
  {% if date_of_birth %}
    <p>Date de naissance: {{date_of_birth}}</p>
  {% endif %}
  {% if nationality %}
    <p>Nationalité: {{nationality}}</p>
  {% endif %}
  {% if driving_license %}
    <p>Permis: {{driving_license}}</p>
  {% endif %}
</div>

<!-- Résumé professionnel -->
{% if summary %}
  <section class="summary">
    <h3>Profil</h3>
    <p style="white-space: pre-wrap;">{{summary}}</p>
  </section>
{% endif %}
```

## Expériences Professionnelles

### Structure de données

`experience_data` est un array d'objets. Utilisez `{% for exp in experience_data %}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{exp.position}}` | String | Titre du poste | "Développeur Full-Stack" |
| `{{exp.company}}` | String | Nom de l'entreprise | "TechCorp SARL" |
| `{{exp.location}}` | String | Ville de l'entreprise | "Lyon" |
| `{{exp.start_date}}` | String | Date de début (YYYY-MM-DD) | "2020-01-15" |
| `{{exp.end_date}}` | String | Date de fin (YYYY-MM-DD ou vide si poste actuel) | "2022-12-31" ou "" |
| `{{exp.is_current}}` | Boolean | Indique si c'est le poste actuel | true ou false |
| `{{exp.description}}` | String | Description des missions (multiligne) | "- Développement d'APIs REST\n- Gestion de base de données" |
| `{{exp.work_mode}}` | String | Mode de travail (optionnel) | "remote", "onsite", "hybrid" ou "" |

### Exemples d'utilisation

```html
<!-- Liste des expériences -->
<section class="experience">
  <h3>Expérience Professionnelle</h3>
  {% for exp in experience_data %}
    <div class="experience-item">
      <h4>{{exp.position}}</h4>
      <p class="company">{{exp.company}} - {{exp.location}}</p>
      <p class="dates">
        {{exp.start_date[:4]}} -
        {% if exp.is_current %}
          Présent
        {% else %}
          {{exp.end_date[:4]}}
        {% endif %}
        {% if exp.work_mode %}
          • {% if exp.work_mode == 'remote' %}Télétravail{% elif exp.work_mode == 'onsite' %}Sur site{% else %}Hybride{% endif %}
        {% endif %}
      </p>
      <p style="white-space: pre-wrap;">{{exp.description}}</p>
    </div>
  {% endfor %}
</section>

<!-- Vérifier si des expériences existent -->
{% if experience_data %}
  <p>Nombre d'expériences: {{experience_data.length}}</p>
{% endif %}
```

## Formation

### Structure de données

`education_data` est un array d'objets. Utilisez `{% for edu in education_data %}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{edu.degree}}` | String | Diplôme / Formation | "Master Informatique" |
| `{{edu.institution}}` | String | Nom de l'établissement | "Université Paris-Saclay" |
| `{{edu.location}}` | String | Ville de l'établissement | "Orsay" |
| `{{edu.start_date}}` | String | Date de début (YYYY-MM-DD) | "2018-09-01" |
| `{{edu.end_date}}` | String | Date de fin (YYYY-MM-DD ou vide si en cours) | "2020-06-30" ou "" |
| `{{edu.is_current}}` | Boolean | Indique si la formation est en cours | true ou false |
| `{{edu.description}}` | String | Description de la formation (multiligne) | "Spécialisation en IA et Big Data" |
| `{{edu.work_mode}}` | String | Mode de formation (optionnel) | "remote", "onsite", "hybrid" ou "" |

### Exemples d'utilisation

```html
<section class="education">
  <h3>Formation</h3>
  {% for edu in education_data %}
    <div class="education-item">
      <h4>{{edu.degree}}</h4>
      <p class="institution">{{edu.institution}} - {{edu.location}}</p>
      <p class="dates">
        {{edu.start_date[:4]}} -
        {% if edu.is_current %}
          En cours
        {% else %}
          {{edu.end_date[:4]}}
        {% endif %}
        {% if edu.work_mode %}
          • {% if edu.work_mode == 'remote' %}À distance{% elif edu.work_mode == 'onsite' %}Sur site{% else %}Hybride{% endif %}
        {% endif %}
      </p>
      {% if edu.description %}
        <p style="white-space: pre-wrap;">{{edu.description}}</p>
      {% endif %}
    </div>
  {% endfor %}
</section>
```

## Compétences

### Structure de données

`skills_data` est un array d'objets. Utilisez `{% for skill in skills_data %}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{skill.name}}` | String | Nom de la compétence | "JavaScript" |
| `{{skill.level}}` | String | Niveau (texte) | "expert", "advanced", "intermediate", "beginner" |
| `{{skill.level_percentage}}` | Number | Niveau en pourcentage (0-100) | 80 (pour 4/5) |

**Correspondance niveau/texte:**
- 1/5 → "beginner"
- 2/5 → "intermediate"
- 3-4/5 → "advanced"
- 5/5 → "expert"

### Exemples d'utilisation

```html
<!-- Liste simple -->
<section class="skills">
  <h3>Compétences</h3>
  <ul>
    {% for skill in skills_data %}
      <li>{{skill.name}} - {{skill.level}}</li>
    {% endfor %}
  </ul>
</section>

<!-- Barres de progression -->
<section class="skills">
  <h3>Compétences</h3>
  {% for skill in skills_data %}
    <div class="skill-item">
      <span>{{skill.name}}</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {{skill.level_percentage}}%;"></div>
      </div>
    </div>
  {% endfor %}
</section>

<!-- Grille de compétences -->
<section class="skills">
  <h3>Compétences</h3>
  <div class="skills-grid">
    {% for skill in skills_data %}
      <span class="skill-badge">{{skill.name}}</span>
    {% endfor %}
  </div>
</section>
```

## Langues

### Structure de données

`languages_data` est un array d'objets. Utilisez `{% for lang in languages_data %}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{lang.name}}` | String | Nom de la langue | "Anglais" |
| `{{lang.level}}` | String | Niveau | "Courant", "Langue maternelle", "Avancé", "Intermédiaire", "Débutant" |

### Exemples d'utilisation

```html
<section class="languages">
  <h3>Langues</h3>
  <ul>
    {% for lang in languages_data %}
      <li>{{lang.name}} - {{lang.level}}</li>
    {% endfor %}
  </ul>
</section>
```

## Sections Personnalisées

### Structure de données

`custom_sections` est un array d'objets contenant les centres d'intérêt et références.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{section.title}}` | String | Titre de la section | "Centres d'intérêt" ou "Références" |
| `{{section.content}}` | String | Contenu de la section (multiligne) | "Photographie, Randonnée, Lecture" |

### Exemples d'utilisation

```html
<!-- Afficher toutes les sections personnalisées -->
{% for section in custom_sections %}
  <section class="custom-section">
    <h3>{{section.title}}</h3>
    <p style="white-space: pre-wrap;">{{section.content}}</p>
  </section>
{% endfor %}
```

**Note:** Les centres d'intérêt (hobbies) et références sont automatiquement convertis en sections personnalisées.

## Données Non Utilisées (Disponibles mais vides)

Ces arrays sont actuellement vides mais disponibles pour extensions futures:

| Variable | Description |
|----------|-------------|
| `certifications_data` | Array de certifications (vide) |
| `projects_data` | Array de projets (vide) |

## Helpers et Fonctions

### Extraction de sous-chaînes (Syntaxe Python)

```html
<!-- Extraire l'année d'une date -->
{{exp.start_date[:4]}}  <!-- Résultat: "2020" -->
{{edu.end_date[:4]}}    <!-- Résultat: "2022" -->

<!-- Autres syntaxes disponibles -->
{{text[4:]}}     <!-- Du 4ème caractère à la fin -->
{{text[-4:]}}    <!-- Les 4 derniers caractères -->
```

### Helper `year`

```html
<!-- Extraire l'année d'une date -->
{{year exp.start_date}}  <!-- Résultat: "2020" -->
```

### Helper `percentage`

```html
<!-- Calculer un pourcentage personnalisé -->
<div style="width: {{percentage skill.level 5}}%;"></div>
<!-- Si skill.level = 4 et max = 5, résultat: 80% -->
```

### Préservation des sauts de ligne

```html
<!-- Méthode 1: CSS inline -->
<p style="white-space: pre-wrap;">{{summary}}</p>

<!-- Méthode 2: Helper nl2br (convertit \n en <br>) -->
<p>{{{nl2br summary}}}</p>

<!-- Méthode 3: Helper preserveWhitespace -->
{{{preserveWhitespace description}}}
```

**Note:** Utilisez `{{{triple accolades}}}` pour afficher du HTML non-échappé.

## Conditions et Boucles

### Vérifier si une variable existe

```html
{% if variable %}
  <p>{{variable}}</p>
{% endif %}
```

### Vérifier si un array a des éléments

```html
{% if experience_data %}
  <section>
    {% for exp in experience_data %}
      <!-- ... -->
    {% endfor %}
  </section>
{% endif %}
```

### Boucles

```html
{% for item in array %}
  <p>{{item.property}}</p>
{% endfor %}
```

## Exemple Complet de Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV - {{full_name}}</title>
</head>
<body>
  <!-- En-tête -->
  <header>
    {% if photo %}
      <img src="{{photo}}" alt="{{full_name}}" class="profile-photo">
    {% endif %}
    <h1>{{full_name}}</h1>
    <h2>{{title}}</h2>
    <div class="contact">
      <span>{{email}}</span> | <span>{{phone}}</span>
      {% if city %} | <span>{{city}}</span>{% endif %}
    </div>
  </header>

  <!-- Résumé -->
  {% if summary %}
    <section>
      <h3>Profil</h3>
      <p style="white-space: pre-wrap;">{{summary}}</p>
    </section>
  {% endif %}

  <!-- Expériences -->
  {% if experience_data %}
    <section>
      <h3>Expérience Professionnelle</h3>
      {% for exp in experience_data %}
        <div class="item">
          <h4>{{exp.position}}</h4>
          <p><strong>{{exp.company}}</strong> - {{exp.location}}</p>
          <p>{{exp.start_date[:4]}} - {{exp.is_current ? "Présent" : exp.end_date[:4]}}</p>
          <p style="white-space: pre-wrap;">{{exp.description}}</p>
        </div>
      {% endfor %}
    </section>
  {% endif %}

  <!-- Formation -->
  {% if education_data %}
    <section>
      <h3>Formation</h3>
      {% for edu in education_data %}
        <div class="item">
          <h4>{{edu.degree}}</h4>
          <p>{{edu.institution}} - {{edu.location}}</p>
          <p>{{edu.start_date[:4]}} - {{edu.end_date[:4]}}</p>
        </div>
      {% endfor %}
    </section>
  {% endif %}

  <!-- Compétences -->
  {% if skills_data %}
    <section>
      <h3>Compétences</h3>
      {% for skill in skills_data %}
        <div class="skill">
          <span>{{skill.name}}</span>
          <div class="bar" style="width: {{skill.level_percentage}}%;"></div>
        </div>
      {% endfor %}
    </section>
  {% endif %}

  <!-- Langues -->
  {% if languages_data %}
    <section>
      <h3>Langues</h3>
      {% for lang in languages_data %}
        <p>{{lang.name}} - {{lang.level}}</p>
      {% endfor %}
    </section>
  {% endif %}

  <!-- Sections personnalisées -->
  {% for section in custom_sections %}
    <section>
      <h3>{{section.title}}</h3>
      <p style="white-space: pre-wrap;">{{section.content}}</p>
    </section>
  {% endfor %}
</body>
</html>
```

## Conseils d'Utilisation

1. **Toujours vérifier l'existence des données** avec `{% if variable %}`
2. **Préserver les sauts de ligne** avec `style="white-space: pre-wrap;"`
3. **Utiliser la syntaxe slice** pour extraire les années: `{{date[:4]}}`
4. **Triple accolades** pour le HTML non-échappé: `{{{nl2br text}}}`
5. **Dans les boucles**, utilisez `{{this.property}}` pour accéder aux propriétés

## Ressources

- [TEMPLATE_REFERENCE.md](TEMPLATE_REFERENCE.md) - Guide de syntaxe Handlebars
- [templateRenderer.ts](frontend/lib/services/templateRenderer.ts) - Code source du moteur de rendu
