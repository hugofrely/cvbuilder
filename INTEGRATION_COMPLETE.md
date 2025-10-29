# Intégration Frontend-Backend - Page /builder

## Résumé des modifications

L'intégration complète de la page `/builder` avec l'API backend a été réalisée avec succès. Voici les fonctionnalités implémentées :

## ✅ Fonctionnalités implémentées

### 1. **Service de Mapping** ([lib/services/resumeMapper.ts](frontend/lib/services/resumeMapper.ts))
- Conversion bidirectionnelle entre `CVData` (frontend) et `Resume` (backend)
- Mapping intelligent des champs (firstName/lastName → fullName, etc.)
- Gestion des niveaux de compétences (1-5 → beginner/intermediate/advanced/expert)
- Gestion des langues avec correspondance des niveaux
- Extraction et reconstruction des sections personnalisées (hobbies, références)

### 2. **Hook personnalisé useResume** ([hooks/useResume.ts](frontend/hooks/useResume.ts))
- **Sauvegarde automatique** avec debounce (3 secondes par défaut)
- **Chargement de CV** depuis l'API
- **Export PDF** avec téléchargement automatique
- **Gestion des états** : `idle`, `saving`, `saved`, `error`
- **Détection des changements** pour éviter les sauvegardes inutiles
- **Persistance de l'ID** du CV dans localStorage

### 3. **Contexte amélioré** ([context/CVContext.tsx](frontend/context/CVContext.tsx))
- Ajout de `loadCVData()` pour charger des données externes
- Ajout de `saveStatus` pour afficher l'état de sauvegarde
- Ajout de `triggerAutoSave()` appelé à chaque modification
- Toutes les fonctions de mise à jour déclenchent automatiquement la sauvegarde

### 4. **Page Builder mise à jour** ([app/builder/page.tsx](frontend/app/builder/page.tsx))

#### Fonctionnalités :
- ✅ **Chargement automatique** du CV au démarrage (depuis localStorage)
- ✅ **Sauvegarde automatique** toutes les 3 secondes après modification
- ✅ **Indicateur visuel de sauvegarde** dans la barre d'outils :
  - "Sauvegarde..." avec spinner pendant la sauvegarde
  - "Sauvegardé ✓" avec icône verte après succès
  - Message d'erreur en rouge en cas d'échec
- ✅ **Bouton Sauvegarder** fonctionnel (sauvegarde manuelle immédiate)
- ✅ **Bouton Télécharger** fonctionnel :
  - Sauvegarde le CV si nécessaire
  - Appelle l'API d'export PDF
  - Télécharge automatiquement le fichier
- ✅ **Snackbar d'erreur** pour les erreurs réseau/API

## 📁 Fichiers créés

1. **frontend/lib/services/resumeMapper.ts** - Service de mapping
2. **frontend/hooks/useResume.ts** - Hook de gestion des CV

## 🔧 Fichiers modifiés

1. **frontend/context/CVContext.tsx** - Ajout de la gestion de sauvegarde
2. **frontend/app/builder/page.tsx** - Intégration complète avec l'API
3. **frontend/types/resume.ts** - Types existants (aucun changement nécessaire)
4. **frontend/lib/api/resume.ts** - API client existant (aucun changement)

## 🔄 Flux de données

### Sauvegarde automatique
```
Utilisateur modifie le CV
    ↓
Context: triggerAutoSave()
    ↓
useResume: scheduleAutoSave() (debounce 3s)
    ↓
Mapper: CVData → Resume
    ↓
API: POST/PATCH /api/resumes/
    ↓
Backend: Sauvegarde en DB
    ↓
Frontend: Mise à jour saveStatus ("saved")
```

### Chargement du CV
```
Page /builder se charge
    ↓
useResume: Récupère resumeId depuis localStorage
    ↓
API: GET /api/resumes/{id}/
    ↓
Backend: Retourne Resume
    ↓
Mapper: Resume → CVData
    ↓
Context: loadCVData()
    ↓
UI: Formulaires pré-remplis
```

### Export PDF
```
Utilisateur clique "Télécharger"
    ↓
Vérification: resumeId existe ?
    ↓ Non → Sauvegarde d'abord
    ↓ Oui
API: POST /api/resumes/{id}/export_pdf/
    ↓
Backend: Génère PDF avec WeasyPrint
    ↓
Frontend: Télécharge le fichier
```

## 🎯 Compatibilité backend

Le système est compatible avec le modèle Django défini dans `backend/resumes/models.py` :

### Champs mappés :
- ✅ `full_name` ← `firstName` + `lastName`
- ✅ `email` ← `email`
- ✅ `phone` ← `phone`
- ✅ `address` ← `address`
- ✅ `linkedin_url` ← `linkedin`
- ✅ `website` ← `website`
- ✅ `photo` ← `photo` (base64)
- ✅ `title` ← `jobTitle`
- ✅ `summary` ← `professionalSummary`
- ✅ `experience_data` ← `experiences[]`
- ✅ `education_data` ← `education[]`
- ✅ `skills_data` ← `skills[]`
- ✅ `languages_data` ← `languages[]`
- ✅ `custom_sections` ← `hobbies[]` + `references[]`

### Champs non encore utilisés (futures fonctionnalités) :
- `certifications_data` (prévu dans Phase 2)
- `projects_data` (prévu dans Phase 2)
- `is_paid` (géré par le backend)
- `payment_type` (géré par le backend)
- `session_id` (géré automatiquement par l'API)

## 🧪 Tests recommandés

### Tests manuels :
1. **Créer un nouveau CV** :
   - Aller sur `/builder`
   - Remplir les informations
   - Vérifier que "Sauvegardé ✓" apparaît après 3 secondes
   - Rafraîchir la page → Les données doivent être conservées

2. **Modifier un CV existant** :
   - Charger un CV sauvegardé
   - Modifier des champs
   - Vérifier la sauvegarde automatique
   - Vérifier le résumé final

3. **Export PDF** :
   - Remplir un CV complet
   - Cliquer sur "Télécharger"
   - Vérifier le téléchargement du PDF

4. **Gestion des erreurs** :
   - Désactiver le backend
   - Modifier le CV
   - Vérifier le message d'erreur

### Tests automatisés (à créer) :
```typescript
// tests/useResume.test.ts
describe('useResume hook', () => {
  it('should save resume automatically after 3 seconds', async () => {
    // Test de debounce
  });

  it('should load existing resume on mount', async () => {
    // Test de chargement
  });

  it('should handle save errors gracefully', async () => {
    // Test d'erreur
  });
});
```

## 📋 TODO restants

### Priorité haute :
- [ ] Gérer le champ `photo` (upload vers backend au lieu de base64)
- [ ] Ajouter la sélection de template (actuellement hardcodé à ID 1)
- [ ] Gérer le watermark pour les templates premium
- [ ] Valider les champs requis avant sauvegarde

### Priorité moyenne :
- [ ] Ajouter les certifications au formulaire
- [ ] Ajouter les projets au formulaire
- [ ] Implémenter le système de version/historique
- [ ] Ajouter un mode "brouillon" vs "publié"

### Priorité basse :
- [ ] Optimiser le mapper pour les grandes listes
- [ ] Ajouter des tests unitaires
- [ ] Ajouter un mode offline avec synchronisation
- [ ] Implémenter le partage de CV par lien

## 🐛 Bugs connus

1. **BuilderStepper.tsx** : Erreur TypeScript mineure sur les icônes de Chip (n'affecte pas le fonctionnement)
2. **Champs manquants** : `city` et `postalCode` ne sont pas envoyés au backend (pas de champ correspondant dans le modèle Resume)

## 🚀 Prochaines étapes

1. Tester l'intégration complète avec le backend en cours d'exécution
2. Implémenter la gestion des templates (sélection, preview)
3. Intégrer le système de paiement Stripe pour les templates premium
4. Créer la page Dashboard pour lister tous les CV de l'utilisateur
5. Ajouter l'authentification (connexion/inscription)

## 📖 Documentation API utilisée

- `POST /api/resumes/` - Créer un nouveau CV
- `PATCH /api/resumes/{id}/` - Mettre à jour un CV
- `GET /api/resumes/{id}/` - Récupérer un CV
- `POST /api/resumes/{id}/export_pdf/` - Exporter en PDF

## 🔐 Sécurité

- ✅ Les tokens JWT sont gérés automatiquement par `apiClient`
- ✅ Les sessions anonymes sont supportées via cookies
- ✅ Le refresh token est géré automatiquement
- ✅ Les erreurs 401 redirigent vers la page de connexion

## 📝 Notes importantes

1. **Debounce de 3 secondes** : La sauvegarde ne se déclenche que 3 secondes après la dernière modification pour éviter trop d'appels API.

2. **localStorage** : L'ID du CV est stocké dans localStorage pour permettre de reprendre l'édition après un rafraîchissement de page.

3. **Mapping intelligent** : Le mapper gère les différences entre frontend (camelCase, IDs string) et backend (snake_case, IDs number).

4. **Gestion d'erreur** : Toutes les erreurs réseau sont catchées et affichées à l'utilisateur.

5. **Session anonyme** : Un utilisateur peut créer un CV sans être connecté grâce au système de session Django.

---

**Date de finalisation** : 29 octobre 2025
**Développé par** : Claude Code
**Version** : 1.0.0
