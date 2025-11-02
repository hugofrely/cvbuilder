#!/bin/bash

# Script de déploiement Docker Swarm pour CVBuilder
# Usage: ./scripts/deploy-swarm.sh

set -e

echo "🐳 CVBuilder - Déploiement Docker Swarm"
echo "========================================"
echo ""

# Vérifier que .env.swarm existe
if [ ! -f ".env.swarm" ]; then
    echo "❌ Erreur: Le fichier .env.swarm n'existe pas"
    echo ""
    echo "Créez-le depuis le template:"
    echo "  cp .env.swarm.example .env.swarm"
    echo "  nano .env.swarm"
    echo ""
    echo "Voir: DOCKER_SWARM_DEPLOYMENT.md pour plus d'infos"
    exit 1
fi

# Vérifier que Docker Swarm est initialisé
if ! docker info --format '{{.Swarm.LocalNodeState}}' | grep -q "active"; then
    echo "❌ Erreur: Docker Swarm n'est pas initialisé"
    echo ""
    echo "Initialisez Swarm avec:"
    echo "  docker swarm init"
    echo ""
    exit 1
fi

# Charger les variables d'environnement
echo "📝 Chargement des variables d'environnement..."
export $(cat .env.swarm | grep -v '^#' | xargs)

# Vérifier les variables critiques
REQUIRED_VARS=(
    "DB_PASSWORD"
    "SECRET_KEY"
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_KEY"
    "SUPABASE_JWT_SECRET"
    "GCS_CREDENTIALS_JSON"
    "STRIPE_SECRET_KEY"
)

echo "✅ Vérification des variables obligatoires..."
MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "❌ Variables manquantes dans .env.swarm:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Éditez .env.swarm et ajoutez ces variables"
    exit 1
fi

echo "✅ Toutes les variables sont définies"
echo ""

# Demander confirmation
echo "📦 Stack: cvbuilder"
echo "📄 Fichier: docker-compose.swarm.yml"
echo ""
read -p "Déployer sur Docker Swarm? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Déploiement annulé"
    exit 0
fi

# Déployer le stack
echo ""
echo "🚀 Déploiement du stack cvbuilder..."
docker stack deploy -c docker-compose.swarm.yml cvbuilder

echo ""
echo "✅ Stack déployé avec succès!"
echo ""
echo "📊 Commandes utiles:"
echo ""
echo "  # Voir les services"
echo "  docker stack services cvbuilder"
echo ""
echo "  # Voir les logs du backend"
echo "  docker service logs -f cvbuilder_backend"
echo ""
echo "  # Voir les logs du frontend"
echo "  docker service logs -f cvbuilder_frontend"
echo ""
echo "  # Mettre à jour un service"
echo "  docker service update --force cvbuilder_backend"
echo ""
echo "  # Supprimer le stack"
echo "  docker stack rm cvbuilder"
echo ""
echo "🌐 URLs:"
echo "  Frontend: https://bidly.fr"
echo "  Backend:  https://api.bidly.fr"
echo ""
echo "📚 Documentation: DOCKER_SWARM_DEPLOYMENT.md"
echo ""
