# Fix de l'export PDF avec les templates Handlebars

## Problème identifié

L'endpoint `export_pdf` ne fonctionnait pas correctement avec les templates du dossier `backend/resumes/templates/` car :

1. Les templates utilisent la syntaxe **Handlebars** (comme le frontend)
2. Le backend n'avait pas tous les helpers Handlebars nécessaires
3. Le mapping des données n'était pas complet (manquait le champ `photo` et certaines conventions de nommage)

## Solution implémentée

### 1. Ajout des helpers Handlebars complets dans `pdf_service.py`

Les helpers suivants ont été ajoutés pour correspondre exactement au frontend ([templateRenderer.ts:14-83](../frontend/lib/services/templateRenderer.ts#L14-L83)) :

- `percentage(level, max)` - Calcul de pourcentage pour les compétences
- `hasItems(array)` - Vérification si un tableau contient des éléments
- `nl2br(text)` - Conversion des sauts de ligne en `<br>`
- `preserveWhitespace(text)` - Préservation des espaces blancs
- `substr(str, start, length)` - Extraction de sous-chaîne
- `first(value, count)` - Premiers N caractères
- `last(str, n)` - Derniers N caractères
- `year(dateStr)` - Extraction de l'année d'une date
- `translate_work_mode(value)` - Traduction du mode de travail en français

### 2. Mise à jour du mapping des données dans `views.py`

Le contexte de données a été enrichi pour supporter toutes les conventions de nommage :

```python
context_data = {
    # Informations personnelles
    'full_name': resume.full_name or '',
    'photo': resume.photo.url if resume.photo else None,  # ← AJOUTÉ
    'email': resume.email or '',
    # ... autres champs

    # Conventions de nommage des templates (backend/resumes/templates/)
    'experience_data': resume.experience_data or [],
    'education_data': resume.education_data or [],
    'skills_data': resume.skills_data or [],
    'languages_data': resume.languages_data or [],

    # Conventions alternatives (pour compatibilité)
    'experience': resume.experience_data or [],
    'education': resume.education_data or [],
    'experiences': resume.experience_data or [],
    'educations': resume.education_data or [],
}
```

### 3. Vérification avec script de test

Un script de test `test_pdf_export.py` a été créé pour vérifier le bon fonctionnement :

- Teste la génération PDF avec plusieurs templates
- Utilise des données de CV réalistes
- Sauvegarde les PDFs dans `test_pdfs/` pour vérification visuelle
- Tous les tests passent ✓

## Fichiers modifiés

1. **[resumes/pdf_service.py](resumes/pdf_service.py:76-159)** - Ajout des helpers Handlebars
2. **[resumes/views.py](resumes/views.py:347-391)** - Enrichissement du mapping des données
3. **[test_pdf_export.py](test_pdf_export.py)** - Script de test (nouveau)

## Tests effectués

```bash
$ . venv/bin/activate
$ python test_pdf_export.py
```

Résultats :
- ✓ Marketing Clean Minimalist (137 KB)
- ✓ Education Modern Academic (372 KB)
- ✓ Medical Clean Modern (348 KB)

**Total: 3/3 tests passés**

## Dépendances

Les dépendances suivantes sont déjà installées dans `requirements.txt` :

- `playwright==1.41.0` - Pour le rendu HTML/CSS en PDF
- `pybars3==0.9.7` - Moteur Handlebars pour Python (non utilisé finalement, on utilise Handlebars côté client)

**Important :** Après installation de `playwright`, il faut installer le navigateur Chromium :

```bash
playwright install chromium
```

## Architecture

Le service PDF fonctionne comme suit :

1. **Template Handlebars** (HTML) → Stocké dans la base de données
2. **Données CV** (JSON) → Généré depuis le modèle Resume
3. **Playwright** → Lance un navigateur headless
4. **Handlebars.js** → Compilé côté client (dans le navigateur)
5. **PDF** → Généré depuis la page rendue

Cette approche garantit que le frontend et le backend utilisent **exactement le même moteur de templates** (Handlebars.js), évitant ainsi les problèmes de compatibilité.

## Prochaines étapes

- [ ] Tester l'endpoint via l'API REST (`POST /api/resumes/{id}/export_pdf/`)
- [ ] Vérifier le rendu de tous les templates (51 templates actifs)
- [ ] Ajouter la gestion des images (photos de profil)
- [ ] Optimiser le temps de génération si nécessaire
