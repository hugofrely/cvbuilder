# Configuration Google Ads - Checklist Rapide

## ⚡ Configuration en 30 minutes

### 1️⃣ Créer les comptes (10 min)

```bash
# Comptes à créer:
□ Google Ads: https://ads.google.com
□ Google Tag Manager: https://tagmanager.google.com
□ Google Analytics 4: https://analytics.google.com
```

### 2️⃣ Copier les IDs dans .env.local (2 min)

```bash
# Ouvrez frontend/.env.local et ajoutez:
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX          # Votre ID GTM
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX # Votre ID GA4
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXX    # Votre ID Google Ads
```

### 3️⃣ Configurer GTM (10 min)

**Tags à créer:**

1. **GA4 Configuration**
   - Type: Google Analytics: GA4 Configuration
   - ID: {{ Votre G-XXXXXXX }}
   - Déclencheur: All Pages

2. **Google Ads - PDF Download**
   - Type: Google Ads Conversion
   - ID conversion: AW-XXXXXXX/PDF_ID
   - Déclencheur: Custom Event = pdf_download

3. **Google Ads - CV Completed**
   - Type: Google Ads Conversion
   - ID conversion: AW-XXXXXXX/CV_ID
   - Déclencheur: Custom Event = cv_completed

4. **Google Ads - Signup**
   - Type: Google Ads Conversion
   - ID conversion: AW-XXXXXXX/SIGNUP_ID
   - Déclencheur: Custom Event = user_signup

### 4️⃣ Créer la campagne Google Ads (8 min)

#### Configuration de base:
```
Nom: Recherche - Créer CV France
Type: Recherche
Budget: 1,67€/jour (50€/mois)
Stratégie: CPC manuel (0,40€ pour commencer)
Localisation: France
Langue: Français
```

#### Groupe 1: Créer CV
**Mots-clés:**
```
[créer cv]
[créer cv en ligne]
[créer un cv]
"créer cv gratuit"
"créer cv en ligne gratuit"
```

**Annonce:**
```
Titre 1: Créer un CV Gratuit en Ligne
Titre 2: 15+ Modèles Professionnels
Titre 3: Sans Inscription | uncvpro.fr
Description 1: Créez votre CV professionnel en 5 minutes. Plus de 15 modèles modernes. Téléchargement PDF gratuit.
Description 2: Sans inscription. Interface intuitive. Commencez maintenant et démarquez-vous !
URL finale: https://uncvpro.fr/landing
```

#### Groupe 2: CV Gratuit
**Mots-clés:**
```
[cv gratuit]
[cv en ligne gratuit]
"modèle cv gratuit"
"template cv gratuit"
```

**Annonce:**
```
Titre 1: CV Gratuit en Ligne | PDF
Titre 2: 15+ Modèles à Télécharger
Titre 3: Sans Inscription | uncvpro.fr
Description 1: Téléchargez votre CV gratuit en PDF. 15+ templates professionnels. Aucun paiement requis.
Description 2: Création rapide en 5 min. Interface intuitive. Résultat professionnel garanti.
URL finale: https://uncvpro.fr/landing
```

#### Groupe 3: Faire CV
**Mots-clés:**
```
[faire un cv]
[faire cv en ligne]
"faire cv gratuit"
"comment faire un cv"
```

**Annonce:**
```
Titre 1: Faire un CV Professionnel
Titre 2: En 5 Minutes | 100% Gratuit
Titre 3: Sans Inscription | uncvpro.fr
Description 1: Faites votre CV facilement avec nos modèles modernes. Export PDF gratuit immédiat.
Description 2: Pour étudiants et professionnels. Interface simple. Résultat garanti.
URL finale: https://uncvpro.fr/landing
```

### 5️⃣ Extensions d'annonces (OBLIGATOIRE)

**Extensions d'accroche:**
```
✓ 100% Gratuit
✓ Sans Inscription
✓ Export PDF Gratuit
✓ 15+ Templates Modernes
```

**Liens annexes:**
```
1. Voir les Templates → /templates
2. Créer CV Maintenant → /builder
3. Exemples de CV → /templates
4. Tarifs → /pricing
```

### 6️⃣ Mots-clés négatifs (IMPORTANT)

```
cv template word
cv europass
cv builder english
cv template free download
curriculum vitae word
modèle cv word
télécharger cv word
cv photoshop
cv canva
cv design word
logiciel cv
application cv
```

---

## 🧪 Tester le tracking

### Test en local:

1. **Démarrer le serveur:**
```bash
cd frontend
npm run dev
```

2. **Ouvrir la console (F12)**

3. **Tester ces actions:**
   - Cliquer sur "Créer mon CV"
   - Aller sur /builder
   - (Si possible) Télécharger un PDF

4. **Vérifier les événements dans console:**
```javascript
// Vous devriez voir:
{event: "cta_click"}
{event: "cv_creation_start"}
{event: "pdf_download"} // Si vous testez le download
```

### Test avec GTM Preview:

1. Dans GTM, cliquez sur "Preview"
2. Entrez l'URL de votre site
3. Effectuez les actions ci-dessus
4. Vérifiez que les tags se déclenchent

---

## 📊 KPIs à surveiller (Semaine 1)

```
□ Impressions > 500
□ Clics > 20
□ CTR > 3%
□ CPC < 0,50€
□ Au moins 1 conversion trackée
```

---

## 🚨 Problèmes courants

### Les conversions ne sont pas trackées:
- Vérifier que GTM_ID est bien dans .env.local
- Vérifier que le site est redéployé avec la nouvelle config
- Tester avec GTM Preview mode
- Attendre 24h (délai Google)

### CPC trop élevé:
- Baisser les enchères manuelles à 0,30€
- Vérifier le Quality Score (doit être > 5)
- Améliorer les annonces (plus pertinentes)

### Pas d'impressions:
- Augmenter le budget à 2€/jour
- Vérifier que les mots-clés ne sont pas en "Faible volume"
- Élargir le ciblage géographique

---

## 📞 Ressources rapides

- **Google Ads Help**: https://support.google.com/google-ads
- **GTM Help**: https://support.google.com/tagmanager
- **Keyword Planner**: https://ads.google.com/aw/keywordplanner

---

## ✅ Checklist finale avant le lancement

```bash
□ Comptes créés (Google Ads, GTM, GA4)
□ IDs ajoutés dans .env.local
□ Site redéployé avec nouvelle config
□ GTM configuré avec tous les tags
□ Conversions créées dans Google Ads
□ Campagne créée avec 3 groupes d'annonces
□ Extensions d'annonces ajoutées
□ Mots-clés négatifs ajoutés
□ Tracking testé et fonctionnel
□ Budget et enchères configurés
□ Mode de paiement ajouté dans Google Ads
```

---

## 🎯 Premier mois - Planning

**Semaine 1:**
- Laisser tourner sans toucher
- Objectif: collecter des données

**Semaine 2:**
- Vérifier les conversions
- Ajuster les enchères par mot-clé (+/- 20%)

**Semaine 3:**
- Désactiver les mots-clés avec 0 conversion et >20 clics
- Ajouter des mots-clés négatifs

**Semaine 4:**
- Optimiser les annonces (garder les meilleures)
- Ajuster le ciblage géographique/horaire

---

**Budget: 50€/mois**
**Objectif: 5-25 conversions/mois**
**Temps de configuration: 30 minutes**

🚀 **Prêt à lancer !**
