#!/bin/bash

# Script de démarrage du projet CV Builder

echo "======================================"
echo "CV Builder - Démarrage du projet"
echo "======================================"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer depuis https://docker.com"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"

# Créer le fichier .env s'il n'existe pas
if [ ! -f backend/.env ]; then
    echo "📝 Création du fichier .env..."
    cp backend/.env.example backend/.env
    echo "⚠️  Pensez à configurer vos clés Stripe dans backend/.env"
fi

# Démarrer les services
echo ""
echo "🚀 Démarrage des services Docker..."
docker-compose up -d db redis

echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 5

echo "🗄️  Exécution des migrations..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
python manage.py migrate
cd ..

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Ou utilisez Docker Compose :"
echo "  docker-compose up"
echo ""
echo "URLs :"
echo "  🌐 Frontend:      http://localhost:3000"
echo "  🔌 Backend API:   http://localhost:8000/api"
echo "  👤 Admin Django:  http://localhost:8000/admin"
echo ""
echo "Créer un superuser :"
echo "  cd backend && python manage.py createsuperuser"
echo ""
