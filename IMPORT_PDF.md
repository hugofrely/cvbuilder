# Import de CV depuis un PDF

Cette fonctionnalité permet d'importer automatiquement les données d'un CV au format PDF directement depuis le frontend, sans passer par le backend.

## Fonctionnalités

### Données extraites automatiquement

Le parser PDF extrait les informations suivantes :

1. **Informations personnelles**
   - Nom et prénom
   - Email
   - Téléphone
   - Adresse et ville
   - Code postal
   - Titre professionnel
   - LinkedIn, GitHub (si présents)

2. **Résumé professionnel**
   - Détecte les sections "Profil", "Résumé", "À propos", "Objectif"

3. **Expériences professionnelles**
   - Titre du poste
   - Entreprise
   - Dates (début et fin)
   - Description du poste

4. **Formation**
   - Diplôme
   - Établissement
   - Dates
   - Description

5. **Compétences**
   - Détecte automatiquement les compétences techniques courantes
   - JavaScript, Python, React, Node.js, Docker, AWS, etc.

6. **Langues**
   - Détecte les langues courantes (Français, Anglais, Espagnol, etc.)
   - Niveau (Débutant, Intermédiaire, Avancé, Courant, Langue maternelle)

## Utilisation

### Depuis l'interface Builder

1. Cliquez sur le bouton **"Importer un CV PDF"** dans la barre d'outils
2. Sélectionnez votre fichier PDF (max 10 MB)
3. Confirmez l'import dans la fenêtre de dialogue
4. Les données sont automatiquement extraites et remplissent le formulaire
5. Le CV est automatiquement sauvegardé

### Depuis mobile

1. Ouvrez le menu (icône trois points)
2. Sélectionnez **"Importer un CV PDF"**
3. Suivez les mêmes étapes que sur desktop

## Architecture technique

### Stack utilisé

- **pdfjs-dist** : Bibliothèque Mozilla PDF.js pour extraire le texte du PDF
- **uuid** : Génération d'IDs uniques pour les éléments du CV
- **Traitement côté client** : Aucune donnée n'est envoyée au backend

### Fichiers créés

```
frontend/
├── lib/services/pdfParser.ts           # Service de parsing PDF
├── components/builder/ImportPDFButton.tsx  # Composant bouton d'import
└── app/builder/page.tsx                # Intégration dans le builder
```

### Service pdfParser.ts

Le service utilise plusieurs techniques pour extraire les données :

1. **Extraction de texte** : PDF.js extrait le texte brut de chaque page
2. **Expressions régulières** : Détection des patterns (email, téléphone, dates)
3. **Analyse contextuelle** : Recherche de mots-clés pour identifier les sections
4. **Heuristiques** : Règles pour détecter le nom, le titre, etc.

### Composant ImportPDFButton.tsx

Composant React avec :
- Dialogue de confirmation avant import
- Indicateur de chargement pendant le parsing
- Gestion des erreurs (format invalide, taille trop grande)
- Notifications de succès/erreur

## Limitations

### Formats supportés

- ✅ PDF texte (avec sélection de texte possible)
- ❌ PDF scannés (images) - non supportés actuellement
- ❌ PDF protégés par mot de passe

### Précision de l'extraction

La précision dépend de :
- La structure du CV original
- La qualité du formatage
- La présence de mots-clés reconnaissables

**Conseil** : Après l'import, vérifiez et corrigez les données extraites si nécessaire.

### Taille maximale

- 10 MB par fichier

## Améliorations futures possibles

1. **OCR pour PDF scannés** : Utiliser Tesseract.js pour extraire le texte des images
2. **IA pour parsing amélioré** : Utiliser un LLM (GPT-4, Claude) pour extraction plus précise
3. **Import depuis LinkedIn** : Parser les profils LinkedIn
4. **Import depuis Word** : Support des fichiers .docx
5. **Apprentissage** : Améliorer les regex et heuristiques basées sur les retours utilisateurs

## Dépannage

### Le PDF n'est pas détecté

- Vérifiez que le fichier est bien un PDF et non une image renommée
- Vérifiez la taille du fichier (max 10 MB)

### Les données ne sont pas extraites

- Le PDF est peut-être un scan (image) - essayez de copier du texte depuis le PDF
- Le format du CV n'est peut-être pas reconnu - remplissez manuellement

### Erreur lors de l'import

- Rechargez la page et réessayez
- Vérifiez les logs du navigateur (F12 > Console)

## Exemple d'utilisation

```typescript
import ImportPDFButton from '@/components/builder/ImportPDFButton';

<ImportPDFButton
  onImportSuccess={(cvData) => {
    // Traiter les données importées
    console.log('CV importé:', cvData);
  }}
  variant="outlined"
  size="medium"
/>
```

## Sécurité

- ✅ Tout le traitement est fait côté client
- ✅ Aucune donnée n'est envoyée à un serveur tiers
- ✅ Le fichier PDF n'est jamais uploadé sur le backend
- ✅ Les données sont directement intégrées dans le formulaire

## Performance

- Extraction d'un CV de 2 pages : ~1-3 secondes
- Pas d'impact sur le backend
- Utilise le Web Worker de PDF.js pour ne pas bloquer l'UI
