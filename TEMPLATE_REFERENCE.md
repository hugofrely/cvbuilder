# Référence des Templates CV

Ce document explique comment créer et modifier des templates HTML pour les CV dans l'application.

## Syntaxe des Templates

Les templates utilisent une syntaxe Django/Jinja2 qui est automatiquement convertie en Handlebars côté client.

### Variables

Pour afficher une variable, utilisez `{{nom_variable}}` :

```html
<h1>{{full_name}}</h1>
<p>{{email}}</p>
<p>{{phone}}</p>
```

### Conditions

Pour afficher du contenu conditionnellement :

```html
{% if photo %}
<img src="{{photo}}" alt="Photo de profil">
{% endif %}

{% if summary %}
<p>{{summary}}</p>
{% endif %}
```

### Boucles

Pour parcourir une liste d'éléments :

```html
{% if experience_data %}
<section>
  <h2>Expérience Professionnelle</h2>
  {% for exp in experience_data %}
  <div>
    <h3>{{exp.position}}</h3>
    <p>{{exp.company}} - {{exp.location}}</p>
    <p>{{exp.start_date}} - {{exp.end_date}}</p>
    <p>{{exp.description}}</p>
  </div>
  {% endfor %}
</section>
{% endif %}
```

## Variables Disponibles

### Informations Personnelles

- `full_name` - Nom complet
- `email` - Email
- `phone` - Téléphone
- `address` - Adresse
- `city` - Ville
- `postal_code` - Code postal
- `website` - Site web
- `linkedin_url` - URL LinkedIn
- `photo` - URL de la photo de profil
- `date_of_birth` - Date de naissance
- `nationality` - Nationalité
- `driving_license` - Permis de conduire
- `title` - Titre/Poste actuel

### Résumé

- `summary` - Résumé professionnel (texte)

### Expériences (experience_data)

Array d'objets avec :
- `position` - Poste occupé
- `company` - Nom de l'entreprise
- `location` - Lieu (ville)
- `start_date` - Date de début
- `end_date` - Date de fin (vide si poste actuel)
- `is_current` - Boolean indiquant si c'est le poste actuel
- `description` - Description du poste

### Formation (education_data)

Array d'objets avec :
- `degree` - Diplôme
- `institution` - École/Université
- `location` - Lieu
- `start_date` - Date de début
- `end_date` - Date de fin
- `is_current` - Boolean indiquant si études en cours
- `description` - Description

### Compétences (skills_data)

Array d'objets avec :
- `name` - Nom de la compétence
- `level` - Niveau (beginner, intermediate, advanced, expert)
- `level_percentage` - Pourcentage (0-100) basé sur le niveau

### Langues (languages_data)

Array d'objets avec :
- `name` - Nom de la langue
- `level` - Niveau (Débutant, Intermédiaire, Courant, etc.)

### Certifications (certifications_data)

Array d'objets (actuellement vide, à implémenter)

### Projets (projects_data)

Array d'objets (actuellement vide, à implémenter)

### Sections Personnalisées (custom_sections)

Array d'objets avec :
- `title` - Titre de la section
- `content` - Contenu de la section

## Helpers Handlebars Disponibles

### nl2br

Convertit les sauts de ligne en balises `<br>` :

```html
<p>{{{nl2br description}}}</p>
```

**Note:** Utilisez `{{{triple accolades}}}` pour afficher du HTML non-échappé.

### preserveWhitespace

Préserve les espaces et sauts de ligne avec CSS :

```html
{{{preserveWhitespace description}}}
```

### percentage

Calcule un pourcentage :

```html
<div style="width: {{percentage skill.level 5}}%;">
  <!-- Barre de progression -->
</div>
```

## Exemple de Template Complet

```html
<div style="font-family: Arial, sans-serif; padding: 40px;">
  <!-- En-tête -->
  <header style="text-align: center; margin-bottom: 40px;">
    {% if photo %}
    <img src="{{photo}}" alt="Photo" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">
    {% endif %}
    <h1 style="margin: 10px 0;">{{full_name}}</h1>
    {% if title %}
    <h2 style="color: #666; font-weight: normal;">{{title}}</h2>
    {% endif %}
    <p>{{email}} | {{phone}} | {{city}}</p>
  </header>

  <!-- Résumé -->
  {% if summary %}
  <section style="margin-bottom: 30px;">
    <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">À Propos</h3>
    <p style="line-height: 1.6;">{{summary}}</p>
  </section>
  {% endif %}

  <!-- Expérience -->
  {% if experience_data %}
  <section style="margin-bottom: 30px;">
    <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Expérience Professionnelle</h3>
    {% for exp in experience_data %}
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 10px 0 5px 0;">{{exp.position}}</h4>
      <p style="color: #666; margin: 0;">{{exp.company}} • {{exp.location}}</p>
      <p style="color: #999; font-size: 14px; margin: 5px 0;">
        {{exp.start_date}} - {% if exp.is_current %}Présent{% else %}{{exp.end_date}}{% endif %}
      </p>
      <p style="line-height: 1.6; white-space: pre-wrap;">{{exp.description}}</p>
    </div>
    {% endfor %}
  </section>
  {% endif %}

  <!-- Formation -->
  {% if education_data %}
  <section style="margin-bottom: 30px;">
    <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Formation</h3>
    {% for edu in education_data %}
    <div style="margin-bottom: 20px;">
      <h4 style="margin: 10px 0 5px 0;">{{edu.degree}}</h4>
      <p style="color: #666; margin: 0;">{{edu.institution}} • {{edu.location}}</p>
      <p style="color: #999; font-size: 14px; margin: 5px 0;">
        {{edu.start_date}} - {% if edu.is_current %}En cours{% else %}{{edu.end_date}}{% endif %}
      </p>
    </div>
    {% endfor %}
  </section>
  {% endif %}

  <!-- Compétences -->
  {% if skills_data %}
  <section style="margin-bottom: 30px;">
    <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Compétences</h3>
    {% for skill in skills_data %}
    <div style="margin-bottom: 15px;">
      <p style="margin: 0 0 5px 0;">{{skill.name}}</p>
      <div style="background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden;">
        <div style="background: #4CAF50; height: 100%; width: {{skill.level_percentage}}%;"></div>
      </div>
    </div>
    {% endfor %}
  </section>
  {% endif %}

  <!-- Langues -->
  {% if languages_data %}
  <section>
    <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">Langues</h3>
    {% for lang in languages_data %}
    <p style="margin: 5px 0;">{{lang.name}} - {{lang.level}}</p>
    {% endfor %}
  </section>
  {% endif %}
</div>
```

## Conseils

1. **Styles Inline** : Utilisez toujours des styles inline (`style="..."`) car le HTML généré sera utilisé pour le PDF.

2. **Sauts de Ligne** : Pour préserver les sauts de ligne dans les descriptions, ajoutez `white-space: pre-wrap;` dans le style.

3. **Images** : Les URLs des images doivent être absolues ou relatives au serveur backend.

4. **Conditions** : Toujours vérifier si une donnée existe avant de l'afficher.

5. **Format A4** : Le conteneur principal devrait avoir une largeur et hauteur fixes :
   ```html
   <div style="width: 210mm; height: 297mm; padding: 20mm;">
   ```

## Mise à Jour des Templates

Les templates sont stockés dans la base de données. Pour modifier un template :

1. Connectez-vous à l'admin Django
2. Allez dans "Templates"
3. Modifiez le champ `template_html`
4. Sauvegardez

Les modifications seront immédiatement visibles dans l'aperçu du frontend.
