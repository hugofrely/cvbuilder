# Guide de Démarrage Rapide - CV Builder

## 🚀 Lancer l'application

### 1. Backend (Django)

```bash
cd backend

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances manquantes (si nécessaire)
pip install python-dotenv djangorestframework-simplejwt pillow weasyprint

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Créer le template gratuit par défaut
python manage.py create_default_template

# Lancer le serveur
python manage.py runserver
```

Le backend sera disponible sur **http://localhost:8000**

### 2. Frontend (Next.js)

```bash
cd frontend

# Installer les dépendances (si nécessaire)
npm install

# Vérifier le fichier .env.local
cat .env.local
# Doit contenir:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Lancer le serveur de développement
npm run dev
```

Le frontend sera disponible sur **http://localhost:3000**

## 🧪 Tester l'intégration

### Test 1 : Créer un CV anonyme

1. Aller sur http://localhost:3000/builder
2. Remplir les informations personnelles
3. Observer l'indicateur "Sauvegarde..." puis "Sauvegardé ✓"
4. Ouvrir la console du navigateur et vérifier la requête POST/PATCH vers `/api/resumes/`
5. Rafraîchir la page → Les données doivent être conservées

### Test 2 : Naviguer entre les sections

1. Cliquer sur "Suivant" pour passer aux sections suivantes
2. Ajouter une expérience professionnelle
3. Ajouter une formation
4. Ajouter des compétences
5. Vérifier que chaque modification déclenche une sauvegarde automatique

### Test 3 : Export PDF

1. Remplir un CV complet
2. Cliquer sur le bouton "Télécharger"
3. Vérifier qu'un PDF est téléchargé

### Test 4 : Backend Admin

1. Aller sur http://localhost:8000/admin
2. Se connecter avec le superutilisateur
3. Vérifier que les CV créés apparaissent dans la liste
4. Vérifier les données JSON (experiences, education, etc.)

## 📊 Vérification de l'état

### Backend

```bash
# Vérifier les migrations
python manage.py showmigrations resumes

# Lister les templates disponibles
python manage.py shell
>>> from resumes.models import Template
>>> Template.objects.all()

# Lister les CV créés
>>> from resumes.models import Resume
>>> Resume.objects.all()
```

### Frontend

```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Lancer les tests (quand ils seront créés)
npm test
```

## 🔍 Debug

### Backend ne démarre pas

```bash
# Vérifier PostgreSQL
psql -U cvbuilder_user -d cvbuilder_db

# Vérifier les variables d'environnement
cat backend/.env

# Réinstaller les dépendances
pip install -r requirements.txt
```

### Frontend ne se connecte pas au backend

```bash
# Vérifier le fichier .env.local
cat frontend/.env.local

# Vérifier que le backend est bien sur le port 8000
curl http://localhost:8000/api/resumes/
```

### Erreur CORS

Si vous voyez des erreurs CORS dans la console :

1. Vérifier `backend/cvbuilder_backend/settings.py`
2. S'assurer que `CORS_ALLOWED_ORIGINS` contient `http://localhost:3000`
3. Vérifier que `django-cors-headers` est installé

### Sauvegarde automatique ne fonctionne pas

1. Ouvrir la console du navigateur
2. Vérifier les erreurs réseau
3. Vérifier que `NEXT_PUBLIC_API_URL` est correctement défini
4. Vérifier que le backend répond sur `/api/resumes/`

## 📝 Structure des données

### Exemple de payload envoyé au backend

```json
{
  "templateId": 1,
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "title": "Développeur Full Stack",
  "summary": "Développeur passionné avec 5 ans d'expérience...",
  "experiences": [
    {
      "position": "Développeur Senior",
      "company": "TechCorp",
      "location": "Paris",
      "startDate": "2020-01",
      "endDate": null,
      "isCurrent": true,
      "description": "Développement d'applications web..."
    }
  ],
  "education": [
    {
      "degree": "Master Informatique",
      "institution": "Université Paris",
      "location": "Paris",
      "startDate": "2015-09",
      "endDate": "2017-06",
      "isCurrent": false
    }
  ],
  "skills": [
    {
      "name": "JavaScript",
      "level": "expert"
    }
  ],
  "languages": [
    {
      "name": "Français",
      "level": "native"
    }
  ]
}
```

## 🎯 Prochaines étapes

Après avoir vérifié que tout fonctionne :

1. Implémenter la sélection de templates
2. Ajouter l'authentification (login/register)
3. Créer la page Dashboard
4. Intégrer Stripe pour les paiements
5. Implémenter le système de watermark

## 🆘 Support

En cas de problème :

1. Vérifier les logs du backend : terminal où `python manage.py runserver` tourne
2. Vérifier la console du frontend : F12 dans le navigateur
3. Vérifier les requêtes réseau : Onglet Network des DevTools
4. Consulter [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) pour plus de détails

---

**Bon développement ! 🚀**
