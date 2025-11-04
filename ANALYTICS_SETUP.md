# Guide de Configuration des Outils d'Analytics

Ce document explique comment configurer et utiliser les outils d'analyse et de tracking intégrés dans l'application uncvpro.fr.

## Outils Configurés
- **Google Analytics 4** : Analytics de trafic et comportement utilisateur (gratuit)
- **Contentsquare** : Analytics d'expérience utilisateur avancée avec heatmaps et session replay (payant - entreprise)

## Table des Matières
1. [Google Analytics 4](#google-analytics-4)
2. [Contentsquare](#contentsquare)
3. [Utilisation des Events Personnalisés](#utilisation-des-events-personnalisés)

---

## Google Analytics 4

### Qu'est-ce que c'est ?
Google Analytics 4 (GA4) est la dernière version de Google Analytics. Il permet de suivre le trafic de votre site, le comportement des utilisateurs, les conversions et bien plus encore.

### Avantages
- Suivi complet du parcours utilisateur
- Rapports détaillés sur le trafic et les conversions
- Gratuit et puissant
- Intégration avec Google Ads
- Prédictions basées sur l'IA

### Configuration

#### 1. Créer un compte Google Analytics
1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Cliquez sur "Commencer gratuitement"
3. Connectez-vous avec votre compte Google

#### 2. Créer une propriété GA4
1. Dans Google Analytics, cliquez sur "Admin" (icône engrenage en bas à gauche)
2. Dans la colonne "Propriété", cliquez sur "Créer une propriété"
3. Renseignez les informations :
   - **Nom de la propriété** : uncvpro.fr
   - **Fuseau horaire** : (GMT+01:00) Paris
   - **Devise** : EUR - Euro (€)
4. Cliquez sur "Suivant"
5. Renseignez les détails de votre entreprise
6. Cliquez sur "Créer"

#### 3. Configurer le flux de données Web
1. Sélectionnez "Web" comme plateforme
2. Renseignez :
   - **URL du site Web** : https://uncvpro.fr
   - **Nom du flux** : uncvpro.fr - Site Web
3. Cliquez sur "Créer un flux"
4. **Copiez votre ID de mesure** (commence par `G-`)

#### 4. Ajouter l'ID de mesure à votre projet
1. Ouvrez le fichier `.env.local` dans le dossier `frontend`
2. Remplacez la ligne suivante :
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=
   ```
   par :
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   (Remplacez `G-XXXXXXXXXX` par votre véritable ID de mesure)

#### 5. Vérifier l'installation
1. Démarrez votre application en local : `npm run dev`
2. Ouvrez votre site dans un navigateur
3. Dans Google Analytics, allez dans "Rapports" > "Temps réel"
4. Vous devriez voir votre visite en temps réel

#### 6. Configurer les conversions importantes
1. Dans Google Analytics, allez dans "Admin" > "Événements"
2. Marquez ces événements comme conversions :
   - `cv_created` : Quand un utilisateur crée un CV
   - `cv_exported` : Quand un utilisateur exporte son CV
   - `payment_success` : Quand un paiement est réussi

---

## Contentsquare

### Qu'est-ce que c'est ?
Contentsquare est une plateforme d'analyse d'expérience digitale de niveau entreprise. Elle offre des fonctionnalités avancées comme les heatmaps, session replay, analyses de friction, et insights automatiques basés sur l'IA.

### Avantages
- Analytics d'expérience utilisateur de niveau entreprise
- Heatmaps et session replay haute qualité
- Analyses automatiques des zones de friction
- Insights basés sur l'IA
- Journey analysis (analyse de parcours utilisateur)
- Intégration avec de nombreux outils marketing

### Configuration

#### 1. Script fourni par Contentsquare
Si vous avez déjà un compte Contentsquare et un script fourni par leur équipe, vous avez juste besoin de l'ID de tracking.

Le script ressemble à :
```html
<script src="https://t.contentsquare.net/uxa/[VOTRE_ID].js"></script>
```

#### 2. Récupérer votre ID Contentsquare
1. Votre ID se trouve dans l'URL du script fourni
2. Par exemple, si votre script est : `https://t.contentsquare.net/uxa/d8b7d93d3eabd.js`
3. Votre ID est : `d8b7d93d3eabd`

#### 3. Ajouter l'ID à votre projet
1. Ouvrez le fichier `.env.local` dans le dossier `frontend`
2. Modifiez la ligne :
   ```bash
   NEXT_PUBLIC_CONTENTSQUARE_ID=d8b7d93d3eabd
   ```
   (Remplacez par votre véritable ID)

#### 4. Vérifier l'installation
1. Démarrez votre application : `npm run dev`
2. Ouvrez votre site dans un navigateur
3. Ouvrez les DevTools (F12) > Console
4. Tapez `CS_CONF` dans la console - si Contentsquare est actif, vous verrez la configuration
5. Ou vérifiez dans l'onglet Network pour voir si le script `.js` se charge depuis `t.contentsquare.net`

#### 5. Accéder à votre dashboard
1. Connectez-vous à votre dashboard Contentsquare (URL fournie par leur équipe)
2. Les données commenceront à apparaître dans les prochaines heures
3. Vous pourrez voir les heatmaps, session replays, et analyses de parcours

### Note importante
Contentsquare est généralement une solution d'entreprise avec un coût significatif. C'est un outil très puissant pour les grandes organisations qui ont besoin d'insights approfondis sur l'expérience utilisateur.

---

## Utilisation des Events Personnalisés

### Événements disponibles

L'application inclut plusieurs fonctions pour tracker des événements personnalisés, définies dans [frontend/lib/analytics.ts](frontend/lib/analytics.ts).

#### 1. Tracking de création de CV
```typescript
import { trackCVCreated } from '@/lib/analytics';

// Dans votre composant
trackCVCreated('Modern Template');
```

#### 2. Tracking d'export de CV
```typescript
import { trackCVExported } from '@/lib/analytics';

// Quand l'utilisateur exporte
trackCVExported('PDF'); // ou 'Word', 'Docs'
```

#### 3. Tracking de vue de template
```typescript
import { trackTemplateViewed } from '@/lib/analytics';

// Quand l'utilisateur voit un template
trackTemplateViewed('Elegant Template');
```

#### 4. Tracking de clic premium
```typescript
import { trackPremiumClick } from '@/lib/analytics';

// Quand l'utilisateur clique sur "Devenir Premium"
trackPremiumClick();
```

#### 5. Tracking de paiement réussi
```typescript
import { trackPaymentSuccess } from '@/lib/analytics';

// Après un paiement réussi
trackPaymentSuccess(9.99); // montant en euros
```

### Ajouter vos propres événements

Vous pouvez créer vos propres événements dans [frontend/lib/analytics.ts](frontend/lib/analytics.ts) :

```typescript
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
  event({
    action: eventName,
    category: 'custom',
    label: params?.label,
    value: params?.value,
  });
};
```

---

## Comparaison des Outils

| Outil | Coût | Points Forts | Cas d'Usage |
|-------|------|--------------|-------------|
| **Google Analytics 4** | Gratuit | Analyse complète du trafic, rapports détaillés | Comprendre d'où viennent les utilisateurs, quelles pages sont populaires, mesurer les conversions |
| **Contentsquare** | Payant (Entreprise) | Analytics IA, heatmaps avancées, journey analysis, session replay de haute qualité | Solution entreprise complète, insights automatiques poussés, analyse approfondie de l'UX |

---

## Recommandations

### Pour démarrer
- **Google Analytics 4** : Essentiel et gratuit pour comprendre votre trafic

### Pour la croissance avancée
- **Contentsquare** : Si vous avez le budget et besoin d'insights UX très poussés

### Best Practices
1. **Ne trackez que ce dont vous avez besoin** : Trop de données peut être contre-productif
2. **Respectez le RGPD** : Informez les utilisateurs du tracking (bannière de cookies)
3. **Analysez régulièrement** : Les données ne servent que si vous les utilisez
4. **Testez les modifications** : Utilisez les insights pour améliorer l'UX

---

## Conformité RGPD

### Important
Selon le RGPD européen, vous devez :
1. Informer les utilisateurs de l'utilisation de cookies et trackers
2. Obtenir leur consentement avant d'activer les trackers non essentiels
3. Leur permettre de refuser

### Solution recommandée
Utilisez une solution de gestion des cookies comme :
- [Axeptio](https://www.axeptio.eu/)
- [Tarteaucitron.js](https://tarteaucitron.io/) (gratuit et open source)
- [CookieBot](https://www.cookiebot.com/)

### Implémentation basique
Pour le moment, les trackers sont chargés automatiquement. Pour être conforme au RGPD, vous devriez :
1. Ajouter une bannière de consentement
2. Ne charger les scripts qu'après consentement
3. Permettre aux utilisateurs de retirer leur consentement

---

## Support et Documentation

### Google Analytics 4
- [Centre d'aide GA4](https://support.google.com/analytics/)
- [Guide de démarrage](https://support.google.com/analytics/answer/9304153)

### Contentsquare
- Contactez votre Customer Success Manager Contentsquare
- [Documentation Contentsquare](https://docs.contentsquare.com/)

---

## Troubleshooting

### Les données n'apparaissent pas dans Google Analytics
- Vérifiez que l'ID de mesure est correct (commence par `G-`)
- Attendez 24-48h pour que les données apparaissent dans les rapports (utilisez "Temps réel" pour vérifier immédiatement)
- Vérifiez que vous n'utilisez pas un bloqueur de publicités
- Vérifiez dans la console du navigateur qu'il n'y a pas d'erreurs

### Contentsquare ne fonctionne pas
- Vérifiez que l'ID est correct dans votre `.env.local`
- Attendez 30 minutes à 2 heures après l'installation
- Vérifiez dans l'onglet Network des DevTools que le script se charge
- Contactez le support Contentsquare si le problème persiste

---

## Contact

Pour toute question sur la configuration des analytics, contactez l'équipe de développement.
