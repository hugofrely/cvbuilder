# 📊 Guide d'implémentation des événements Google Analytics

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Événements à tracker](#événements-à-tracker)
3. [Implémentations concrètes](#implémentations-concrètes)
4. [Configuration dans Google Analytics](#configuration-dans-google-analytics)
5. [Vérification et tests](#vérification-et-tests)

---

## Vue d'ensemble

Les helpers d'événements sont définis dans [`frontend/lib/analytics.ts:31-71`](frontend/lib/analytics.ts#L31-L71) mais **ne sont pas encore utilisés** dans l'application.

Ce guide explique **où et comment** ajouter les appels de tracking.

---

## Événements à tracker

| Helper | Événement GA | Catégorie | Description |
|--------|--------------|-----------|-------------|
| `trackCVCreated(templateName)` | `cv_created` | `engagement` | Création d'un nouveau CV |
| `trackCVExported(format)` | `cv_exported` | `conversion` | Export d'un CV en PDF |
| `trackTemplateViewed(templateName)` | `template_viewed` | `engagement` | Prévisualisation d'un template |
| `trackPremiumClick()` | `premium_click` | `engagement` | Clic sur le bouton Premium |
| `trackPaymentSuccess(amount)` | `payment_success` | `conversion` | Paiement confirmé |

---

## Implémentations concrètes

### 1. 💳 **Tracker `payment_success`**

**Fichier** : [`frontend/app/payment/success/page.tsx`](frontend/app/payment/success/page.tsx)

**Ligne à modifier** : Ligne 59-64

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier (après les imports existants)
import { trackPaymentSuccess } from '@/lib/analytics';

// Dans la fonction checkPaymentStatus, ligne 59-64
if (data.status === 'succeeded') {
  // Payment confirmed!
  setPaymentStatus('succeeded');
  setStatusMessage('Paiement confirmé avec succès');
  setLoading(false);

  // 🎯 AJOUTER ICI : Tracker le succès du paiement
  if (typeof window !== 'undefined' && (window as any).gtag) {
    trackPaymentSuccess(data.amount || 0);
  }

  return true; // Stop polling
}
```

**Note importante** : Assurez-vous que votre backend renvoie le montant du paiement dans `data.amount`.

---

### 2. 📥 **Tracker `cv_exported`**

**Fichier** : [`frontend/hooks/useResume.ts`](frontend/hooks/useResume.ts)

**Ligne à modifier** : Ligne 236-260

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier
import { trackCVExported } from '@/lib/analytics';

// Dans la fonction exportPDF, après le téléchargement réussi (ligne 254)
const exportPDF = useCallback(async (id: string) => {
  try {
    setError(null);

    const result = await resumeApi.exportPdf(id);

    // Create object URL from blob
    const blobUrl = window.URL.createObjectURL(result.blob);

    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    // 🎯 AJOUTER ICI : Tracker l'export réussi
    if (typeof window !== 'undefined' && (window as any).gtag) {
      trackCVExported('pdf'); // Format est toujours PDF actuellement
    }

    return {
      filename: result.filename,
      resumeId: result.resumeId,
      isPremium: result.isPremium,
    };

  } catch (err: unknown) {
    // ... reste du code inchangé
  }
}, []);
```

---

### 3. 👁️ **Tracker `template_viewed`**

**Fichier** : [`frontend/components/builder/TemplateSelector.tsx`](frontend/components/builder/TemplateSelector.tsx)

**Ligne à modifier** : Ligne 200-205

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier
import { trackTemplateViewed } from '@/lib/analytics';

// Dans la fonction handleOpenPreview (ligne 200)
const handleOpenPreview = (template: Template) => {
  if (template.thumbnail) {
    setPreviewTemplate(template);
    setPreviewOpen(true);

    // 🎯 AJOUTER ICI : Tracker la visualisation du template
    if (typeof window !== 'undefined' && (window as any).gtag) {
      trackTemplateViewed(template.name);
    }
  }
};
```

---

### 4. ⭐ **Tracker `premium_click`**

**Fichier** : [`frontend/components/builder/TemplateSelector.tsx`](frontend/components/builder/TemplateSelector.tsx)

**Ligne à modifier** : Ligne 161-174 (dans `handleSelect`)

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier
import { trackPremiumClick } from '@/lib/analytics';

// Dans la fonction handleSelect (ligne 161)
const handleSelect = () => {
  if (selectedId) {
    // 🎯 AJOUTER ICI : Tracker le clic sur un template premium
    const selectedTemplate = templates.find(t => t.id === selectedId);
    const isPremium = selectedTemplate?.isPremium || selectedTemplate?.is_premium;

    if (isPremium && typeof window !== 'undefined' && (window as any).gtag) {
      trackPremiumClick();
    }

    // Check if CV is paid and template is different
    if (isPaidResume && selectedId !== currentTemplateId) {
      // Show duplicate dialog
      setPendingTemplateId(selectedId);
      setDuplicateDialogOpen(true);
    } else {
      // Allow template change
      onSelect(selectedId);
      onClose();
    }
  }
};
```

**Alternative** : Vous pouvez aussi tracker le clic sur le bouton "Premium" dans la page pricing :

**Fichier** : [`frontend/app/pricing/page.tsx`](frontend/app/pricing/page.tsx)

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier
import { trackPremiumClick } from '@/lib/analytics';

// Dans le bouton de paiement premium, ajouter un onClick
<Button
  variant="contained"
  onClick={() => {
    trackPremiumClick();
    // ... logique de redirection vers le paiement
  }}
>
  Passer à Premium
</Button>
```

---

### 5. 🎨 **Tracker `cv_created`**

Pour cet événement, il faut déterminer **quand** un CV est considéré comme "créé". Voici deux options :

#### **Option A : Quand le CV est sauvegardé pour la première fois**

**Fichier** : [`frontend/hooks/useResume.ts`](frontend/hooks/useResume.ts)

```typescript
// ✅ AJOUTER CET IMPORT en haut du fichier
import { trackCVCreated } from '@/lib/analytics';

// Dans la fonction saveResume, après la création réussie
const saveResume = useCallback(async (data: CVData, forceCreate: boolean = false) => {
  try {
    setSaveStatus('saving');
    setError(null);

    let result;
    const currentResumeId = resumeId || localStorage.getItem('currentResumeId');

    if (currentResumeId && !forceCreate) {
      // Update existing resume
      result = await resumeApi.update(currentResumeId, {
        cv_data: data,
        template_id: selectedTemplateId || undefined,
      });
    } else {
      // Create new resume
      result = await resumeApi.create({
        cv_data: data,
        template_id: selectedTemplateId || undefined,
      });

      // 🎯 AJOUTER ICI : Tracker la création d'un nouveau CV
      if (typeof window !== 'undefined' && (window as any).gtag) {
        // Récupérer le nom du template si possible
        const templateName = selectedTemplateId || 'default';
        trackCVCreated(templateName);
      }

      // Update state with new resume ID
      setResumeId(result.id);
      localStorage.setItem('currentResumeId', result.id);
    }

    setSaveStatus('saved');
    return result;
  } catch (err) {
    // ... reste du code inchangé
  }
}, [resumeId, selectedTemplateId]);
```

#### **Option B : Quand l'utilisateur sélectionne un template pour la première fois**

**Fichier** : [`frontend/components/builder/TemplateSelector.tsx`](frontend/components/builder/TemplateSelector.tsx)

Cette option nécessite de tracker lors de la première sélection de template sur un nouveau CV.

---

## Configuration dans Google Analytics

### Étape 1 : Accéder aux événements

1. Connectez-vous à [Google Analytics](https://analytics.google.com/)
2. Sélectionnez votre propriété
3. Allez dans **Admin** (⚙️ en bas à gauche)
4. Dans la colonne **Propriété**, cliquez sur **Événements**

### Étape 2 : Marquer les événements comme conversions

Pour chaque événement que vous voulez tracker comme conversion :

1. Cherchez l'événement dans la liste (ex: `cv_created`, `cv_exported`, `payment_success`)
2. Activez le toggle **"Marquer comme conversion"** ✅

**Les 3 événements principaux à marquer comme conversions** :
- ✅ `cv_created` : Engagement utilisateur
- ✅ `cv_exported` : Conversion principale
- ✅ `payment_success` : Conversion monétaire

### Étape 3 : Créer des rapports personnalisés (Optionnel)

Vous pouvez créer des rapports pour visualiser :
- Nombre de CV créés par template
- Taux de conversion (création → export → paiement)
- Revenus par type de template

---

## Vérification et tests

### 1. **Test en mode développement**

Installez l'extension Chrome [**Google Analytics Debugger**](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)

### 2. **Vérifier les événements en temps réel**

1. Ouvrez Google Analytics
2. Allez dans **Rapports** → **Temps réel** → **Événements**
3. Effectuez une action dans votre app (export PDF, paiement, etc.)
4. Vérifiez que l'événement apparaît dans la liste

### 3. **Console du navigateur**

Ajoutez des logs temporaires pour déboguer :

```typescript
if (typeof window !== 'undefined' && (window as any).gtag) {
  console.log('🎯 Tracking event: cv_exported', { format: 'pdf' });
  trackCVExported('pdf');
}
```

### 4. **Checklist de vérification**

- [ ] Les imports `trackXXX` sont ajoutés dans chaque fichier
- [ ] La condition `typeof window !== 'undefined' && (window as any).gtag` est présente
- [ ] Les événements sont appelés **après** l'action réussie (pas avant)
- [ ] Les paramètres sont corrects (ex: nom du template, montant du paiement)
- [ ] Les événements apparaissent dans GA4 en temps réel
- [ ] Les conversions sont marquées dans l'admin GA4

---

## Résumé des fichiers à modifier

| Fichier | Événement | Lignes |
|---------|-----------|--------|
| [`app/payment/success/page.tsx`](frontend/app/payment/success/page.tsx) | `payment_success` | ~59-64 |
| [`hooks/useResume.ts`](frontend/hooks/useResume.ts) | `cv_exported` | ~254 |
| [`hooks/useResume.ts`](frontend/hooks/useResume.ts) | `cv_created` | Dans `saveResume` |
| [`components/builder/TemplateSelector.tsx`](frontend/components/builder/TemplateSelector.tsx) | `template_viewed` | ~200 |
| [`components/builder/TemplateSelector.tsx`](frontend/components/builder/TemplateSelector.tsx) | `premium_click` | ~161 |

---

## Questions fréquentes

### **Q : Pourquoi ajouter `typeof window !== 'undefined'` ?**
**R** : Next.js effectue le rendu côté serveur (SSR). La vérification `typeof window !== 'undefined'` garantit que le code ne s'exécute que côté client, où `gtag` est disponible.

### **Q : Comment vérifier si gtag est chargé ?**
**R** : Ouvrez la console du navigateur et tapez :
```javascript
window.gtag
```
Si c'est défini, Google Analytics est chargé correctement.

### **Q : Les événements ne s'affichent pas dans GA4, que faire ?**
**R** :
1. Vérifiez que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini dans `.env.local`
2. Vérifiez que le script GA est chargé dans [`app/layout.tsx`](frontend/app/layout.tsx)
3. Désactivez les bloqueurs de pub/tracking
4. Attendez 5-10 minutes (délai de traitement GA4)

### **Q : Comment tracker le nom réel du template au lieu de l'ID ?**
**R** : Vous devrez récupérer le template depuis l'API :
```typescript
const template = await templateApi.getById(selectedTemplateId);
trackCVCreated(template.name);
```

---

## Aide supplémentaire

- [Documentation Google Analytics 4](https://support.google.com/analytics/answer/9267735)
- [gtag.js Reference](https://developers.google.com/analytics/devguides/collection/gtagjs)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)

---

**Créé le** : 2025-11-04
**Dernière mise à jour** : 2025-11-04
