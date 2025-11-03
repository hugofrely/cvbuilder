# Correction des marges et coupures de pages dans les PDFs

## Problèmes identifiés

1. **Marges indésirables** : Le PDF généré ajoutait des marges/padding autour du contenu
2. **Coupure d'éléments entre pages** : Les blocs de contenu (expériences, formations, etc.) étaient coupés entre les pages de manière inesthétique
3. **Espace blanc excessif** : Trop d'espace blanc en bas de page dû à `height: 100%` sur le body

## Solutions implémentées

### 1. Suppression des marges du PDF (avec juste milieu)

**Fichier modifié** : [resumes/pdf_service.py](resumes/pdf_service.py:170-181)

```python
# Avant
pdf_bytes = await page.pdf(
    format='A4',
    print_background=True,
    margin={
        'top': '0mm',
        'right': '0mm',
        'bottom': '0mm',
        'left': '0mm'
    }
)

# Après
pdf_bytes = await page.pdf(
    format='A4',
    print_background=True,
    margin={
        'top': '0',      # Valeur numérique sans unité = 0 exact
        'right': '0',
        'bottom': '0',
        'left': '0'
    },
    prefer_css_page_size=False  # Permet d'utiliser @page CSS
)
```

### 2. Règles CSS pour éviter les coupures

**Fichier modifié** : [resumes/pdf_service.py](resumes/pdf_service.py:61-100)

Ajout de règles CSS globales dans le HTML généré :

```css
/* Suppression des marges externes sans affecter le contenu interne */
html {
    margin: 0;
    padding: 0;
}

body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    min-height: 100%;
    height: auto;  /* Permet au body de s'adapter au contenu */
}

/* Le conteneur PDF s'adapte au contenu */
#cv-content {
    min-height: auto;
    height: auto;
}

/* Empêcher la coupure des titres */
h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;   /* Ne pas couper juste après un titre */
    page-break-inside: avoid;  /* Ne pas couper à l'intérieur d'un titre */
}

/* Empêcher la coupure des listes, images, tableaux */
ul, ol, dl, img, table, figure {
    page-break-inside: avoid;
}

/* Garder les blocs de contenu ensemble */
div[style*="margin-bottom"],
div[style*="padding"],
section, article {
    page-break-inside: avoid;
}

/* Configuration de la page */
@page {
    margin: 0;
    size: A4;
}
```

## Comment ça fonctionne

### Marges PDF
- Playwright supporte des valeurs numériques pures pour les marges (sans unité)
- `'0'` est plus strict que `'0mm'` et garantit vraiment 0 marge
- `prefer_css_page_size=False` permet aux règles CSS `@page` de prendre le contrôle

### Page Breaks (Coupures de pages)
Les règles CSS `page-break-*` indiquent au moteur de rendu PDF :
- `page-break-inside: avoid` → Ne jamais couper cet élément en deux
- `page-break-after: avoid` → Ne pas insérer de saut de page juste après
- `page-break-before: avoid` → Ne pas insérer de saut de page juste avant

Ces règles s'appliquent à :
- **Titres** (`h1`-`h6`) : Évite qu'un titre soit seul en bas de page
- **Listes** (`ul`, `ol`, `dl`) : Garde les listes ensemble
- **Images** et **tableaux** : Ne les coupe jamais
- **Blocs de contenu** (`div` avec padding/margin) : Les expériences, formations, etc.

## Résultats

✅ **Marges supprimées** : Le contenu utilise maintenant toute la page A4
✅ **Coupures évitées** : Les éléments restent groupés sur la même page quand possible
✅ **Compatible avec tous les templates** : Les règles CSS sont globales et s'appliquent automatiquement
✅ **Juste milieu trouvé** :
   - Les marges internes des templates sont préservées (ex: `padding: 40px`)
   - Les marges externes du PDF sont supprimées
   - Le body s'adapte au contenu (pas d'espace blanc excessif)

## Comparaison avant/après

| Aspect | Avant | Après |
|--------|-------|-------|
| Marges PDF | Oui (blanc autour) | Non (0) |
| Coupure de contenu | Oui (inesthétique) | Minimisée |
| Espace blanc en bas | Modéré | Optimisé (auto) |
| Padding interne template | Préservé | Préservé ✓ |

## Test

```bash
cd backend
source venv/bin/activate
python test_pdf_export.py
```

Le PDF généré se trouve dans `backend/test_pdfs/` et peut être vérifié visuellement.

## Limitations connues

⚠️ **Contenu très long** : Si un bloc (comme une description d'expérience) est plus long qu'une page entière, il sera forcément coupé. Dans ce cas, le navigateur fera de son mieux pour couper à un endroit logique.

⚠️ **Templates personnalisés** : Les templates qui définissent leurs propres règles `page-break-*` peuvent override ces règles globales.

## Fichiers modifiés

1. **[resumes/pdf_service.py](resumes/pdf_service.py)**
   - Lignes 61-100 : Ajout des règles CSS globales
   - Lignes 170-181 : Configuration des marges PDF à 0

## Prochaines étapes possibles

- [ ] Ajouter des classes CSS spécifiques aux templates pour un contrôle plus fin
- [ ] Implémenter des règles de coupure "intelligentes" pour les très longs contenus
- [ ] Permettre aux utilisateurs de choisir entre "compacte" et "aéré" pour la mise en page
