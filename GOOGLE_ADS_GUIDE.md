# Guide Complet Google Ads pour uncvpro.fr

## 📊 Stratégie Budget 50€/mois

### Répartition du budget recommandée
- **Budget quotidien**: 1,67€ (50€ / 30 jours)
- **Stratégie d'enchères**: Maximiser les conversions (après données suffisantes) ou CPC manuel au début
- **CPC moyen estimé**: 0,20€ - 0,50€ pour les mots-clés choisis
- **Clics attendus**: 100-250 clics/mois
- **Taux de conversion estimé**: 5-10%
- **Conversions attendues**: 5-25/mois

---

## 🎯 Configuration étape par étape

### Étape 1: Créer vos comptes

1. **Google Ads**:
   - Allez sur [ads.google.com](https://ads.google.com)
   - Créez un compte avec votre email professionnel
   - Mode expert recommandé

2. **Google Tag Manager** (GTM):
   - Allez sur [tagmanager.google.com](https://tagmanager.google.com)
   - Créez un conteneur pour uncvpro.fr
   - Copiez l'ID GTM (commence par GTM-XXXXXXX)
   - Ajoutez-le dans `.env.local`: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`

3. **Google Analytics 4** (GA4):
   - Allez sur [analytics.google.com](https://analytics.google.com)
   - Créez une propriété GA4
   - Copiez l'ID de mesure (commence par G-XXXXXXXXXX)
   - Ajoutez-le dans `.env.local`: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`

### Étape 2: Configurer Google Tag Manager

#### Tags à créer dans GTM:

1. **Tag GA4 Configuration**
   - Type: Google Analytics: Configuration GA4
   - ID de mesure: Votre G-XXXXXXXXXX
   - Déclencheur: All Pages

2. **Tag Google Ads Conversion - PDF Download**
   - Type: Google Ads Conversion Tracking
   - ID de conversion: AW-XXXXXXXXX/YYYYYYYY (à obtenir de Google Ads)
   - Déclencheur: Événement personnalisé `pdf_download`

3. **Tag Google Ads Conversion - CV Completed**
   - Type: Google Ads Conversion Tracking
   - ID de conversion: AW-XXXXXXXXX/ZZZZZZZZ
   - Déclencheur: Événement personnalisé `cv_completed`

4. **Tag Google Ads Conversion - Signup**
   - Type: Google Ads Conversion Tracking
   - ID de conversion: AW-XXXXXXXXX/WWWWWWWW
   - Déclencheur: Événement personnalisé `user_signup`

#### Déclencheurs à créer:
- `pdf_download`: Événement personnalisé, nom de l'événement = "pdf_download"
- `cv_completed`: Événement personnalisé, nom de l'événement = "cv_completed"
- `user_signup`: Événement personnalisé, nom de l'événement = "user_signup"

### Étape 3: Configurer les conversions dans Google Ads

1. Dans Google Ads, allez dans **Outils et paramètres** > **Conversions**
2. Créez 3 conversions:

**Conversion 1: Téléchargement PDF (PRINCIPALE)**
- Nom: PDF Download
- Catégorie: Télécharger
- Valeur: 1€ (estimation de la valeur)
- Nombre: Une fois
- Fenêtre de conversion: 30 jours
- Modèle d'attribution: Axé sur les données (ou Derniers clics au début)

**Conversion 2: CV Complété**
- Nom: CV Completed
- Catégorie: Soumettre le formulaire de prospect
- Valeur: 0,50€
- Nombre: Une fois
- Fenêtre de conversion: 30 jours

**Conversion 3: Inscription**
- Nom: User Signup
- Catégorie: Inscription
- Valeur: 2€
- Nombre: Une fois
- Fenêtre de conversion: 30 jours

### Étape 4: Créer votre première campagne

#### Structure de campagne recommandée pour 50€/mois:

**CAMPAGNE 1: Recherche - Mots-clés Principaux**
Budget: 50€/mois (100% du budget)

---

## 🔍 Groupes d'annonces et mots-clés

### Groupe d'annonces 1: Créer CV (Budget prioritaire: 40%)

**Mots-clés (correspondance exacte et expression)**:
- [créer cv] - CPC ~0,30€
- [créer cv en ligne] - CPC ~0,35€
- [créer un cv] - CPC ~0,30€
- "créer cv gratuit" - CPC ~0,40€
- "créer cv en ligne gratuit" - CPC ~0,45€

**Annonces (3 annonces par groupe)**:

**Annonce 1:**
- Titre 1: Créer un CV Gratuit en Ligne
- Titre 2: 15+ Modèles Professionnels
- Titre 3: Sans Inscription | uncvpro.fr
- Description 1: Créez votre CV professionnel en 5 minutes. Plus de 15 modèles modernes. Téléchargement PDF gratuit.
- Description 2: Sans inscription. Interface intuitive. Commencez maintenant et démarquez-vous !
- URL finale: https://uncvpro.fr/landing
- URL affichée: uncvpro.fr/creer-cv

**Annonce 2:**
- Titre 1: CV Professionnel en 5 Minutes
- Titre 2: 100% Gratuit | PDF Inclus
- Titre 3: Aucune Inscription Requise
- Description 1: Créer CV gratuit avec nos templates modernes. Export PDF instantané et gratuit.
- Description 2: Plus de 10,000 CV créés. Interface simple et rapide. Essayez maintenant !
- URL finale: https://uncvpro.fr/landing
- URL affichée: uncvpro.fr/cv-gratuit

### Groupe d'annonces 2: CV Gratuit (Budget: 30%)

**Mots-clés**:
- [cv gratuit] - CPC ~0,45€
- [cv en ligne gratuit] - CPC ~0,50€
- "modèle cv gratuit" - CPC ~0,40€
- "template cv gratuit" - CPC ~0,35€

**Annonces**:

**Annonce 1:**
- Titre 1: CV Gratuit en Ligne | PDF
- Titre 2: 15+ Modèles à Télécharger
- Titre 3: Sans Inscription | uncvpro.fr
- Description 1: Téléchargez votre CV gratuit en PDF. 15+ templates professionnels. Aucun paiement requis.
- Description 2: Création rapide en 5 min. Interface intuitive. Résultat professionnel garanti.
- URL finale: https://uncvpro.fr/landing
- URL affichée: uncvpro.fr/cv-gratuit

### Groupe d'annonces 3: Faire CV (Budget: 30%)

**Mots-clés**:
- [faire un cv] - CPC ~0,35€
- [faire cv en ligne] - CPC ~0,40€
- "faire cv gratuit" - CPC ~0,40€
- "comment faire un cv" - CPC ~0,30€

**Annonces**:

**Annonce 1:**
- Titre 1: Faire un CV Professionnel
- Titre 2: En 5 Minutes | 100% Gratuit
- Titre 3: Sans Inscription | uncvpro.fr
- Description 1: Faites votre CV facilement avec nos modèles modernes. Export PDF gratuit immédiat.
- Description 2: Pour étudiants et professionnels. Interface simple. Résultat garanti.
- URL finale: https://uncvpro.fr/landing
- URL affichée: uncvpro.fr/faire-cv

---

## 🎯 Extensions d'annonces (IMPORTANT - augmente le CTR)

### Extensions d'accroche:
- ✓ 100% Gratuit
- ✓ Sans Inscription
- ✓ Export PDF Gratuit
- ✓ 15+ Templates Modernes

### Extensions de liens annexes:
1. Voir les Templates | https://uncvpro.fr/templates
2. Créer CV Maintenant | https://uncvpro.fr/builder
3. Exemples de CV | https://uncvpro.fr/templates
4. Tarifs | https://uncvpro.fr/pricing

### Extensions d'extraits structurés:
- Types de CV: Moderne, Classique, Créatif, Professionnel, Étudiant
- Formats: PDF, Word, Google Docs, OpenOffice
- Fonctionnalités: Sans inscription, Prévisualisation temps réel, Export gratuit

---

## 📊 Suivi et optimisation

### Semaine 1-2: Phase de collecte de données
- Objectif: Collecter au moins 30 clics
- CPC manuel: 0,40€ - 0,50€
- Vérifier que les conversions sont trackées correctement
- Tester les 3 annonces de chaque groupe

### Semaine 3-4: Première optimisation
- Identifier les mots-clés avec le meilleur taux de conversion
- Désactiver les mots-clés avec 0 conversion et >20 clics
- Augmenter les enchères sur les mots-clés performants (+20%)
- Baisser les enchères sur les mots-clés peu performants (-30%)

### Mois 2: Optimisation continue
- Passer à "Maximiser les conversions" si >15 conversions/mois
- Ajouter des mots-clés en requête large modifiée pour les top performers
- Créer une liste de mots-clés à exclure

### Mots-clés négatifs recommandés (à ajouter dès le début):
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
cv linkedin
cv indeed
cv pole emploi
```

---

## 💡 Conseils pour optimiser avec un petit budget

### 1. Ciblage géographique précis
- France uniquement (pas d'outre-mer si non pertinent)
- Exclure les zones rurales si vous constatez un faible taux de conversion

### 2. Planification des annonces
- Activez vos annonces pendant les heures de bureau: 9h-18h en semaine
- Désactivez le week-end si le taux de conversion est faible
- Testez et ajustez selon vos données

### 3. Appareils
- Ajustez les enchères par appareil après 2 semaines de données
- Si mobile convertit moins: -20% sur mobile
- Si desktop convertit mieux: +20% sur desktop

### 4. Test A/B des landing pages
- Semaine 1-2: Envoyez 50% du trafic vers `/landing` et 50% vers `/`
- Comparez les taux de conversion
- Gardez la meilleure landing page

### 5. Remarketing (Mois 2+)
- Créez une audience "Visiteurs n'ayant pas converti"
- Budget: 10€/mois
- Annonces spécifiques: "Vous avez oublié quelque chose ?"

---

## 📈 KPIs à surveiller

### Métriques principales:
- **CTR (Taux de clics)**: Objectif >3% (bon = 5%+)
- **Taux de conversion**: Objectif >5% (bon = 10%+)
- **CPC moyen**: Objectif <0,50€
- **Coût par conversion**: Objectif <5€
- **Quality Score**: Objectif 7+ sur tous les mots-clés

### Tableau de bord hebdomadaire:
| Métrique | Objectif | Semaine 1 | Semaine 2 | Semaine 3 | Semaine 4 |
|----------|----------|-----------|-----------|-----------|-----------|
| Clics | 20-30 | | | | |
| Impressions | >1000 | | | | |
| CTR | >3% | | | | |
| Conversions | 1-3 | | | | |
| CPC | <0,50€ | | | | |

---

## 🚀 Actions immédiates

### À faire aujourd'hui:
1. ✅ Créer un compte Google Ads
2. ✅ Créer un compte Google Tag Manager
3. ✅ Créer un compte Google Analytics 4
4. ⬜ Configurer GTM avec les tags de conversion
5. ⬜ Vérifier que le site envoie les événements GTM (voir console développeur)
6. ⬜ Ajouter les variables d'environnement dans `.env.local`

### À faire cette semaine:
7. ⬜ Créer la première campagne "Recherche - Mots-clés Principaux"
8. ⬜ Créer les 3 groupes d'annonces avec leurs mots-clés
9. ⬜ Rédiger et publier 3 annonces par groupe
10. ⬜ Configurer les extensions d'annonces
11. ⬜ Ajouter les mots-clés négatifs
12. ⬜ Vérifier le tracking avec Google Tag Assistant

---

## 🔧 Vérification du tracking

### Test du suivi des conversions:

1. **Ouvrez la console développeur** (F12)
2. **Allez sur votre site** en localhost ou production
3. **Effectuez ces actions**:
   - Cliquez sur "Créer mon CV"
   - Remplissez quelques informations
   - Cliquez sur "Télécharger PDF"

4. **Vérifiez dans la console** que ces événements sont envoyés:
   ```javascript
   // Vous devriez voir ces événements dans dataLayer
   {event: "cta_click", event_label: "Hero CTA"}
   {event: "cv_creation_start"}
   {event: "pdf_download"}
   ```

5. **Vérifiez dans Google Tag Manager** (Preview mode):
   - Activez le mode Aperçu dans GTM
   - Testez à nouveau sur votre site
   - Vérifiez que les tags se déclenchent correctement

---

## 📞 Support et ressources

### Ressources Google:
- [Google Ads Help](https://support.google.com/google-ads)
- [Google Tag Manager Help](https://support.google.com/tagmanager)
- [Google Skillshop](https://skillshop.withgoogle.com/) - Formations gratuites

### Outils utiles:
- **Google Keyword Planner**: Recherche de mots-clés
- **Google Ads Editor**: Gestion en masse des campagnes
- **Google Tag Assistant**: Vérification du tracking
- **Google Analytics Debugger**: Débogage GA4

---

## 💰 Estimation des résultats (Budget 50€/mois)

### Scénario Conservateur:
- Clics: 100/mois (CPC 0,50€)
- Taux de conversion: 5%
- Conversions: 5/mois
- Coût par conversion: 10€

### Scénario Réaliste:
- Clics: 150/mois (CPC 0,33€)
- Taux de conversion: 8%
- Conversions: 12/mois
- Coût par conversion: 4,17€

### Scénario Optimiste:
- Clics: 250/mois (CPC 0,20€)
- Taux de conversion: 10%
- Conversions: 25/mois
- Coût par conversion: 2€

**Note**: Ces estimations sont basées sur des moyennes du secteur. Vos résultats peuvent varier.

---

## 🎓 Conseils d'expert

1. **Patience**: Les premiers jours seront lents. Google a besoin de temps pour apprendre.

2. **Quality Score**: Concentrez-vous sur l'amélioration du Quality Score. Un score de 8-10 réduit vos coûts de 30-50%.

3. **Landing Page**: La landing page `/landing` est optimisée pour la conversion. Utilisez-la pour vos annonces.

4. **Tests**: Testez toujours 2-3 annonces par groupe. Google optimise automatiquement.

5. **Données**: Ne faites pas de modifications majeures avant d'avoir au moins 50 clics sur un mot-clé.

6. **Exclusions**: Ajoutez des mots-clés négatifs chaque semaine. C'est la clé pour ne pas gaspiller de budget.

7. **Mobile**: Ne négligez pas le mobile. 60% des recherches viennent de mobile.

8. **Extensions**: Utilisez TOUTES les extensions disponibles. Elles augmentent le CTR de 10-15%.

---

## 📧 Contact

Pour toute question sur cette configuration, référez-vous à la documentation officielle Google Ads ou consultez un expert Google Ads certifié.

Bon lancement de campagne ! 🚀
