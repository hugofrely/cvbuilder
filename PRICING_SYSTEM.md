# Système de Pricing - CV Builder

## Vue d'ensemble

Le CV Builder propose **3 formules** pour répondre à tous les besoins :

---

## 📋 Les 3 Formules

### 1. 🆓 **Gratuit**
**Prix : 0€**

**Avantages :**
- ✅ Accès aux modèles gratuits
- ✅ Export PDF gratuit et illimité
- ✅ Sans inscription requise
- ✅ Téléchargement illimité des modèles gratuits
- ✅ Création de CV illimitée

**Usage :**
- Parfait pour démarrer
- Aucune limitation sur les modèles gratuits
- Pas besoin de compte pour créer et exporter

**Comment ça marche :**
1. Aller sur `/builder`
2. Choisir un template gratuit
3. Créer son CV
4. Exporter en PDF gratuitement

---

### 2. 💳 **Paiement par CV Premium**
**Prix : 2,40€ par CV**

**Avantages :**
- ✅ Accès à 1 modèle premium au choix
- ✅ Export PDF haute qualité
- ✅ Téléchargement immédiat
- ✅ Pas d'abonnement
- ✅ Sans inscription possible (optionnel)
- ✅ 1 paiement = 1 CV premium

**Usage :**
- Besoin ponctuel d'un modèle premium
- Un seul CV à créer
- Ne veut pas s'abonner

**Comment ça marche :**
1. Choisir un template premium dans `/templates`
2. Créer son CV
3. Au moment de l'export PDF :
   - Si modèle gratuit → export gratuit
   - Si modèle premium → paiement de 2,40€
4. Téléchargement immédiat après paiement

---

### 3. ⭐ **Premium Illimité**
**Prix : 24€ (paiement unique)**

**Avantages :**
- ✅ Tous les modèles premium débloqués
- ✅ Export PDF illimité
- ✅ Créez autant de CV que vous voulez
- ✅ Téléchargement de tous vos CV
- ✅ Stockage sécurisé en ligne
- ✅ Support prioritaire

**Usage :**
- Besoin de plusieurs CV
- Envie d'essayer différents modèles
- Recherche d'emploi active
- Meilleur rapport qualité/prix

**Comment ça marche :**
1. S'inscrire/Se connecter (requis)
2. Payer 24€ une seule fois
3. Accès à tous les modèles premium
4. Export illimité de tous vos CV

---

## 🎨 Distinction Modèles Gratuits vs Premium

### **Modèles Gratuits**
- Badge "Gratuit" ou pas de badge
- Accessibles sans compte
- Export PDF gratuit
- Pas de limite de téléchargement

### **Modèles Premium**
- Badge "Premium" avec icône ⭐
- Nécessitent un paiement pour l'export
- Design plus élaboré
- Templates professionnels avancés

---

## 💰 Logique de Paiement

```
┌─────────────────┐
│ Utilisateur     │
│ crée un CV      │
└────────┬────────┘
         │
         v
┌────────────────────┐
│ Clique sur         │
│ "Télécharger PDF"  │
└────────┬───────────┘
         │
         v
    ┌────────────────┐
    │ Template est   │
    │ gratuit ?      │
    └────┬───────────┘
         │
    ┌────┴────┐
    │         │
   OUI       NON
    │         │
    v         v
┌───────┐  ┌──────────────────┐
│Export │  │ Utilisateur a    │
│gratuit│  │ Premium ?        │
└───────┘  └────┬─────────────┘
                │
           ┌────┴────┐
           │         │
          OUI       NON
           │         │
           v         v
      ┌────────┐  ┌──────────────┐
      │Export  │  │ Redirection  │
      │gratuit │  │ vers paiement│
      └────────┘  │ 2,40€        │
                  └──────────────┘
```

---

## 🔐 Gestion des Sessions

### **Sans compte (anonyme)**
- CV sauvegardé en session Django
- Persistance tant que la session est active
- Export gratuit pour modèles gratuits
- Peut payer 2,40€ pour export d'un modèle premium

### **Avec compte**
- CV sauvegardé dans la base de données
- Accès depuis n'importe quel appareil
- Historique de tous les CV créés
- Si Premium : accès illimité

### **Migration session → compte**
Lors de la connexion/inscription :
1. Tous les CV créés en session sont automatiquement transférés au compte
2. L'utilisateur retrouve ses CV
3. Si il a payé Premium, tous ses CV deviennent exportables

---

## 📊 Base de données - Champs importants

### **User Model**
```python
is_premium: Boolean  # Si l'utilisateur a payé 24€
premium_expires_at: DateTime  # Optionnel, si abonnement futur
```

### **Resume Model**
```python
user: ForeignKey(User)  # Null si session anonyme
session_id: String  # Pour utilisateurs anonymes
template: ForeignKey(Template)
is_paid: Boolean  # Si CV a été payé individuellement (2,40€)
payment_type: String  # "per_cv" ou "premium"
```

### **Template Model**
```python
is_premium: Boolean  # True = nécessite paiement
is_active: Boolean
price: Decimal  # Prix si paiement à l'unité
```

---

## 🛣️ Routes principales

### Frontend
- `/pricing` - Page des tarifs
- `/payment?plan=pay-per-download` - Paiement par CV
- `/payment?plan=premium` - Paiement Premium
- `/builder` - Création de CV (accessible à tous)
- `/templates` - Galerie de templates

### Backend API
- `POST /api/resumes/migrate_anonymous/` - Migration session → compte
- `POST /api/resumes/{id}/export_pdf/` - Export PDF (avec vérification paiement)
- `GET /api/templates/` - Liste templates (avec flag is_premium)

---

## 🎯 Stratégie commerciale

1. **Acquisition** : Offre gratuite pour essayer
2. **Conversion ponctuelle** : 2,40€ pour un besoin immédiat
3. **Conversion récurrente** : 24€ pour utilisateurs réguliers

**Avantages :**
- Barrière d'entrée très basse (gratuit)
- Prix psychologique faible pour test (2,40€)
- Bon rapport qualité/prix pour premium (24€)
- Pas d'abonnement mensuel = moins de friction

---

## 🔄 Prochaines étapes d'implémentation

### Backend
1. ✅ Endpoint de migration
2. ⏳ Intégration Stripe/PayPal
3. ⏳ Logique de vérification paiement à l'export
4. ⏳ Gestion du statut premium utilisateur

### Frontend
1. ✅ Page pricing
2. ✅ Page payment
3. ⏳ Badge premium sur templates
4. ⏳ Vérification avant export
5. ⏳ Dashboard utilisateur premium

### Tests
1. ⏳ Flow gratuit complet
2. ⏳ Flow paiement par CV
3. ⏳ Flow premium
4. ⏳ Migration session → compte
