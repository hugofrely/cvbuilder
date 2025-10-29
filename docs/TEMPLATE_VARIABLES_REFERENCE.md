# Référence des Variables pour Templates CV

Ce document liste toutes les variables disponibles pour créer des templates HTML de CV. Tous les templates utilisent la syntaxe **Handlebars**.

---

## Table des matières

1. [Informations Personnelles](#informations-personnelles)
2. [Expériences Professionnelles](#expériences-professionnelles)
3. [Formation](#formation)
4. [Compétences](#compétences)
5. [Langues](#langues)
6. [Certifications](#certifications)
7. [Projets](#projets)
8. [Sections Personnalisées](#sections-personnalisées)
9. [Syntaxe Handlebars](#syntaxe-handlebars)
10. [Helpers Personnalisés](#helpers-personnalisés)

---

## Informations Personnelles

### Variables simples

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{full_name}}` | String | Nom complet | "Jean Dupont" |
| `{{title}}` | String | Titre du poste / profession | "Développeur Full-Stack" |
| `{{email}}` | String | Adresse email | "jean.dupont@email.com" |
| `{{phone}}` | String | Numéro de téléphone | "+33 6 12 34 56 78" |
| `{{address}}` | String | Adresse postale complète | "15 rue de la Paix" |
| `{{city}}` | String | Ville | "Paris" |
| `{{postal_code}}` | String | Code postal | "75001" |
| `{{photo}}` | String | URL de la photo (base64 ou URL) | "data:image/jpeg;base64,..." |
| `{{date_of_birth}}` | String | Date de naissance (YYYY-MM-DD) | "1990-05-15" |
| `{{nationality}}` | String | Nationalité | "Française" |
| `{{driving_license}}` | String | Type de permis de conduire | "Permis B" |
| `{{summary}}` | String | Résumé professionnel (multiligne) | "Développeur passionné..." |

### Liens professionnels

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{linkedin_url}}` | String | URL du profil LinkedIn | "https://linkedin.com/in/jean-dupont" |
| `{{github_url}}` | String | URL du profil GitHub | "https://github.com/jeandupont" |
| `{{website}}` | String | Site web / Portfolio | "https://jeandupont.dev" |

### Exemple d'utilisation

```handlebars
<header class="header">
  {{#if photo}}
  <img src="{{photo}}" alt="{{full_name}}" class="profile-photo">
  {{/if}}

  <h1>{{full_name}}</h1>
  {{#if title}}<h2>{{title}}</h2>{{/if}}

  <div class="contact">
    {{#if email}}<a href="mailto:{{email}}">{{email}}</a>{{/if}}
    {{#if phone}}<span>{{phone}}</span>{{/if}}
    {{#if city}}{{#if postal_code}}
    <span>{{postal_code}} {{city}}</span>
    {{/if}}{{/if}}
  </div>

  <div class="links">
    {{#if linkedin_url}}<a href="{{linkedin_url}}">LinkedIn</a>{{/if}}
    {{#if github_url}}<a href="{{github_url}}">GitHub</a>{{/if}}
    {{#if website}}<a href="{{website}}">Portfolio</a>{{/if}}
  </div>
</header>

{{#if summary}}
<section class="summary">
  <h3>Profil</h3>
  <p style="white-space: pre-wrap;">{{summary}}</p>
</section>
{{/if}}
```

---

## Expériences Professionnelles

### Structure de données

`experience_data` est un **array d'objets**. Utilisez `{{#each experience_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.position}}` | String | Titre du poste | "Développeur Full-Stack" |
| `{{this.company}}` | String | Nom de l'entreprise | "TechCorp SARL" |
| `{{this.location}}` | String | Ville de l'entreprise | "Lyon" |
| `{{this.start_date}}` | String | Date de début (YYYY-MM-DD) | "2020-01-15" |
| `{{this.end_date}}` | String | Date de fin (YYYY-MM-DD) | "2022-12-31" |
| `{{this.is_current}}` | Boolean | Poste actuel ? | true ou false |
| `{{this.description}}` | String | Description des missions (multiligne) | "- Développement APIs\n- BDD" |
| `{{this.work_mode}}` | String | Mode de travail | "remote", "onsite", "hybrid" |

### Exemple d'utilisation

```handlebars
{{#if experience_data}}
<section>
  <h2>Expérience Professionnelle</h2>

  {{#each experience_data}}
  <div class="exp-item">
    <div class="exp-header">
      <h3>{{this.position}} @ {{this.company}}</h3>
      <span class="dates">
        {{first this.start_date 4}} -
        {{#if this.is_current}}Present{{else}}{{first this.end_date 4}}{{/if}}
      </span>
    </div>

    {{#if this.location}}
    <p class="location">📍 {{this.location}}
      {{#if this.work_mode}} • {{this.work_mode}}{{/if}}
    </p>
    {{/if}}

    {{#if this.description}}
    <p class="description" style="white-space: pre-wrap;">{{this.description}}</p>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}
```

---

## Formation

### Structure de données

`education_data` est un **array d'objets**. Utilisez `{{#each education_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.degree}}` | String | Diplôme / Formation | "Master Informatique" |
| `{{this.field_of_study}}` | String | Domaine d'études | "Intelligence Artificielle" |
| `{{this.institution}}` | String | Nom de l'établissement | "Université Paris-Saclay" |
| `{{this.location}}` | String | Ville de l'établissement | "Orsay" |
| `{{this.start_date}}` | String | Date de début (YYYY-MM-DD) | "2018-09-01" |
| `{{this.end_date}}` | String | Date de fin (YYYY-MM-DD) | "2020-06-30" |
| `{{this.is_current}}` | Boolean | Formation en cours ? | true ou false |
| `{{this.grade}}` | String | Note / Mention | "Mention Très Bien" |
| `{{this.description}}` | String | Description (multiligne) | "Spécialisation IA" |
| `{{this.work_mode}}` | String | Mode de formation | "remote", "onsite", "hybrid" |

### Exemple d'utilisation

```handlebars
{{#if education_data}}
<section>
  <h2>Formation</h2>

  {{#each education_data}}
  <div class="edu-item">
    <div class="edu-header">
      <h3>{{this.degree}}{{#if this.field_of_study}} - {{this.field_of_study}}{{/if}}</h3>
      <span class="dates">
        {{first this.start_date 4}} -
        {{#if this.is_current}}En cours{{else}}{{first this.end_date 4}}{{/if}}
      </span>
    </div>

    <p class="institution">
      {{this.institution}}
      {{#if this.location}} • {{this.location}}{{/if}}
      {{#if this.work_mode}} • {{this.work_mode}}{{/if}}
    </p>

    {{#if this.grade}}
    <p class="grade">🏆 {{this.grade}}</p>
    {{/if}}

    {{#if this.description}}
    <p style="white-space: pre-wrap;">{{this.description}}</p>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}
```

---

## Compétences

### Structure de données

`skills_data` est un **array d'objets**. Utilisez `{{#each skills_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.name}}` | String | Nom de la compétence | "JavaScript" |
| `{{this.level}}` | String | Niveau (texte) | "expert", "advanced", "intermediate", "beginner" |
| `{{this.level_percentage}}` | Number | Niveau en % (0-100) | 80 |

**Correspondance niveau:**
- 1/5 → "beginner" (20%)
- 2/5 → "intermediate" (40%)
- 3/5 → "advanced" (60%)
- 4/5 → "advanced" (80%)
- 5/5 → "expert" (100%)

### Exemple d'utilisation

```handlebars
{{#if skills_data}}
<section>
  <h2>Compétences</h2>

  <!-- Simple liste -->
  <div class="skills-list">
    {{#each skills_data}}
    <span class="skill-badge">{{this.name}}</span>
    {{/each}}
  </div>

  <!-- Avec barres de progression -->
  <div class="skills-bars">
    {{#each skills_data}}
    <div class="skill-item">
      <span class="name">{{this.name}}</span>
      <span class="level">{{this.level}}</span>
      {{#if this.level_percentage}}
      <div class="progress-bar">
        <div class="fill" style="width: {{this.level_percentage}}%;"></div>
      </div>
      {{/if}}
    </div>
    {{/each}}
  </div>
</section>
{{/if}}
```

---

## Langues

### Structure de données

`languages_data` est un **array d'objets**. Utilisez `{{#each languages_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.name}}` | String | Nom de la langue | "Anglais" |
| `{{this.level}}` | String | Niveau | "Courant", "Langue maternelle", "Avancé" |
| `{{this.level_percentage}}` | Number | Niveau en % (0-100) | 90 |

### Exemple d'utilisation

```handlebars
{{#if languages_data}}
<section>
  <h2>Langues</h2>

  <div class="languages">
    {{#each languages_data}}
    <div class="language-item">
      <span class="name">{{this.name}}</span>
      <span class="level">{{this.level}}</span>
      {{#if this.level_percentage}}
      <div class="progress-bar">
        <div class="fill" style="width: {{this.level_percentage}}%;"></div>
      </div>
      {{/if}}
    </div>
    {{/each}}
  </div>
</section>
{{/if}}
```

---

## Certifications

### Structure de données

`certifications_data` est un **array d'objets**. Utilisez `{{#each certifications_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.name}}` | String | Nom de la certification | "AWS Certified Developer" |
| `{{this.issuer}}` | String | Organisme émetteur | "Amazon Web Services" |
| `{{this.date}}` | String | Date d'obtention | "2023-06-15" |
| `{{this.credential_id}}` | String | ID de certification | "ABC123XYZ" |
| `{{this.url}}` | String | URL de vérification | "https://..." |

### Exemple d'utilisation

```handlebars
{{#if certifications_data}}
<section>
  <h2>Certifications</h2>

  {{#each certifications_data}}
  <div class="cert-item">
    <h3>{{this.name}}</h3>
    {{#if this.issuer}}
    <p class="issuer">Délivré par: {{this.issuer}}</p>
    {{/if}}
    {{#if this.date}}
    <p class="date">{{this.date}}</p>
    {{/if}}
    {{#if this.credential_id}}
    <p class="id">ID: {{this.credential_id}}</p>
    {{/if}}
    {{#if this.url}}
    <a href="{{this.url}}" target="_blank">Vérifier la certification</a>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}
```

---

## Projets

### Structure de données

`projects_data` est un **array d'objets**. Utilisez `{{#each projects_data}}` pour boucler.

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.name}}` | String | Nom du projet | "E-commerce Platform" |
| `{{this.description}}` | String | Description (multiligne) | "Plateforme de vente..." |
| `{{this.url}}` | String | URL du projet | "https://github.com/..." |
| `{{this.date}}` | String | Date du projet | "2023" |
| `{{this.technologies}}` | Array | Liste des technologies | ["React", "Node.js"] |

### Exemple d'utilisation

```handlebars
{{#if projects_data}}
<section>
  <h2>Projets</h2>

  {{#each projects_data}}
  <div class="project-item">
    <div class="header">
      <h3>{{this.name}}</h3>
      {{#if this.date}}<span class="date">{{this.date}}</span>{{/if}}
    </div>

    {{#if this.url}}
    <a href="{{this.url}}" target="_blank">🔗 Voir le projet</a>
    {{/if}}

    {{#if this.description}}
    <p style="white-space: pre-wrap;">{{this.description}}</p>
    {{/if}}

    {{#if this.technologies}}
    <div class="tech-tags">
      {{#each this.technologies}}
      <span class="tag">{{this}}</span>
      {{/each}}
    </div>
    {{/if}}
  </div>
  {{/each}}
</section>
{{/if}}
```

---

## Sections Personnalisées

### Structure de données

`custom_sections` est un **array d'objets** contenant des sections additionnelles (centres d'intérêt, références, etc.).

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `{{this.title}}` | String | Titre de la section | "Centres d'intérêt" |
| `{{this.content}}` | String | Contenu (multiligne) | "Photographie, Randonnée" |

### Exemple d'utilisation

```handlebars
{{#each custom_sections}}
<section>
  <h2>{{this.title}}</h2>
  <div style="white-space: pre-wrap;">{{this.content}}</div>
</section>
{{/each}}
```

---

## Syntaxe Handlebars

### Conditions

```handlebars
<!-- Si la variable existe -->
{{#if variable}}
  <p>{{variable}}</p>
{{/if}}

<!-- Si/Sinon -->
{{#if variable}}
  <p>{{variable}}</p>
{{else}}
  <p>Non renseigné</p>
{{/if}}

<!-- Conditions imbriquées -->
{{#if var1}}
  {{#if var2}}
    <p>Les deux existent</p>
  {{/if}}
{{/if}}
```

### Boucles

```handlebars
<!-- Boucle sur un array -->
{{#each array}}
  <div>{{this.property}}</div>
{{/each}}

<!-- Vérifier si l'array existe et n'est pas vide -->
{{#if array}}
  {{#each array}}
    <p>{{this.name}}</p>
  {{/each}}
{{/if}}
```

### Contexte dans les boucles

```handlebars
{{#each experience_data}}
  <!-- Dans la boucle, utilisez "this." pour accéder aux propriétés -->
  <p>{{this.position}}</p>
  <p>{{this.company}}</p>

  <!-- Pour les sous-boucles -->
  {{#each this.technologies}}
    <span>{{this}}</span>
  {{/each}}
{{/each}}
```

---

## Helpers Personnalisés

### Helper `first`

Extrait les N premiers caractères d'une chaîne (utile pour les années).

```handlebars
<!-- Extraire l'année d'une date -->
{{first this.start_date 4}}  <!-- "2020-01-15" → "2020" -->
{{first this.end_date 4}}     <!-- "2022-12-31" → "2022" -->
```

### Préservation des sauts de ligne

Pour afficher correctement le texte multiligne (descriptions, résumés), utilisez:

```handlebars
<!-- Méthode recommandée: CSS -->
<p style="white-space: pre-wrap;">{{description}}</p>

<!-- Fonctionne pour: -->
{{summary}}
{{exp.description}}
{{edu.description}}
{{section.content}}
```

---

## Exemples de Templates Complets

### Template Minimaliste

```handlebars
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>{{full_name}} - CV</title>
</head>
<body>
  <h1>{{full_name}}</h1>
  {{#if title}}<h2>{{title}}</h2>{{/if}}
  <p>{{email}} | {{phone}}</p>

  {{#if summary}}
  <section>
    <h3>Profil</h3>
    <p style="white-space: pre-wrap;">{{summary}}</p>
  </section>
  {{/if}}

  {{#if experience_data}}
  <section>
    <h3>Expérience</h3>
    {{#each experience_data}}
    <div>
      <h4>{{this.position}} @ {{this.company}}</h4>
      <p>{{first this.start_date 4}} - {{#if this.is_current}}Présent{{else}}{{first this.end_date 4}}{{/if}}</p>
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if skills_data}}
  <section>
    <h3>Compétences</h3>
    {{#each skills_data}}
    <span>{{this.name}}</span>
    {{/each}}
  </section>
  {{/if}}
</body>
</html>
```

### Template Complet avec toutes les variables

```handlebars
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>{{full_name}} - CV</title>
</head>
<body>
  <!-- En-tête -->
  <header>
    {{#if photo}}<img src="{{photo}}" alt="{{full_name}}">{{/if}}
    <h1>{{full_name}}</h1>
    {{#if title}}<h2>{{title}}</h2>{{/if}}
    <div>
      {{#if email}}{{email}}{{/if}}
      {{#if phone}} | {{phone}}{{/if}}
      {{#if city}} | {{city}}{{/if}}
    </div>
    <div>
      {{#if linkedin_url}}<a href="{{linkedin_url}}">LinkedIn</a>{{/if}}
      {{#if github_url}}<a href="{{github_url}}">GitHub</a>{{/if}}
      {{#if website}}<a href="{{website}}">Portfolio</a>{{/if}}
    </div>
  </header>

  <!-- Résumé -->
  {{#if summary}}
  <section>
    <h3>Profil</h3>
    <p style="white-space: pre-wrap;">{{summary}}</p>
  </section>
  {{/if}}

  <!-- Expériences -->
  {{#if experience_data}}
  <section>
    <h3>Expérience</h3>
    {{#each experience_data}}
    <div>
      <h4>{{this.position}} @ {{this.company}}</h4>
      <p>{{first this.start_date 4}} - {{#if this.is_current}}Présent{{else}}{{first this.end_date 4}}{{/if}}</p>
      {{#if this.location}}<p>{{this.location}}</p>{{/if}}
      {{#if this.description}}<p style="white-space: pre-wrap;">{{this.description}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  <!-- Compétences -->
  {{#if skills_data}}
  <section>
    <h3>Compétences</h3>
    {{#each skills_data}}<span>{{this.name}}</span>{{/each}}
  </section>
  {{/if}}

  <!-- Projets -->
  {{#if projects_data}}
  <section>
    <h3>Projets</h3>
    {{#each projects_data}}
    <div>
      <h4>{{this.name}}</h4>
      {{#if this.url}}<a href="{{this.url}}">Voir</a>{{/if}}
      {{#if this.description}}<p style="white-space: pre-wrap;">{{this.description}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  <!-- Formation -->
  {{#if education_data}}
  <section>
    <h3>Formation</h3>
    {{#each education_data}}
    <div>
      <h4>{{this.degree}}</h4>
      <p>{{this.institution}}</p>
    </div>
    {{/each}}
  </section>
  {{/if}}

  <!-- Certifications -->
  {{#if certifications_data}}
  <section>
    <h3>Certifications</h3>
    {{#each certifications_data}}
    <div>
      <h4>{{this.name}}</h4>
      {{#if this.issuer}}<p>{{this.issuer}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  <!-- Langues -->
  {{#if languages_data}}
  <section>
    <h3>Langues</h3>
    {{#each languages_data}}<p>{{this.name}} - {{this.level}}</p>{{/each}}
  </section>
  {{/if}}

  <!-- Sections personnalisées -->
  {{#each custom_sections}}
  <section>
    <h3>{{this.title}}</h3>
    <div style="white-space: pre-wrap;">{{this.content}}</div>
  </section>
  {{/each}}
</body>
</html>
```

---

## Bonnes Pratiques

1. **Toujours vérifier l'existence** des données avec `{{#if variable}}`
2. **Préserver les sauts de ligne** avec `style="white-space: pre-wrap;"`
3. **Utiliser `{{this.property}}`** dans les boucles `{{#each}}`
4. **Extraire les années** avec `{{first date 4}}`
5. **Gérer les postes actuels** avec `{{#if is_current}}Present{{else}}{{first end_date 4}}{{/if}}`
6. **Organiser le code** avec des commentaires HTML
7. **Tester avec et sans données** pour vérifier les conditions

---

## Ressources

- **Handlebars Documentation**: [https://handlebarsjs.com/](https://handlebarsjs.com/)
- **Code source du renderer**: [frontend/lib/services/templateRenderer.ts](../frontend/lib/services/templateRenderer.ts)
- **Modèles de données**: [backend/resumes/models.py](../backend/resumes/models.py)
- **Template de référence**: [backend/resumes/templates/tech_developer_complete.html](../backend/resumes/templates/tech_developer_complete.html)
