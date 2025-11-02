#!/bin/bash

# Script pour build et push les images Docker
# Usage: ./scripts/build-and-push.sh [backend|frontend|all]

set -e

REGISTRY="registry.frely.fr"
VERSION=${VERSION:-"latest"}

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables Supabase (depuis .github/workflows/docker-build.yml)
NEXT_PUBLIC_API_URL="https://api.bidly.fr"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51SNWHR2Vp7eF2jdKICcwrEgWMRhEI5e9SuhCXaWHW6S0wnGencnfd2GgtqVZbhhAeQEoFdRdbl7xaW9vF2V6YEMx00RdVWIBnZ"
NEXT_PUBLIC_SUPABASE_URL="https://yxkhydsttvkkkpqhjwtx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4a2h5ZHN0dHZra2twcWhqd3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTM5NTcsImV4cCI6MjA3NzYyOTk1N30.Z-tSRtlnZS3sTBmE4w4aaRmEm2dtGq_vPSWva9o4lWE"

echo -e "${GREEN}🐳 CVBuilder - Build and Push Docker Images${NC}"
echo "=============================================="
echo ""

build_backend() {
    echo -e "${YELLOW}📦 Building backend image...${NC}"
    docker build \
        -t ${REGISTRY}/cvbuilder-backend:${VERSION} \
        -t ${REGISTRY}/cvbuilder-backend:latest \
        ./backend

    echo -e "${GREEN}✅ Backend built successfully${NC}"
    echo ""

    echo -e "${YELLOW}⬆️  Pushing backend image...${NC}"
    docker push ${REGISTRY}/cvbuilder-backend:${VERSION}
    docker push ${REGISTRY}/cvbuilder-backend:latest

    echo -e "${GREEN}✅ Backend pushed successfully${NC}"
    echo ""
}

build_frontend() {
    echo -e "${YELLOW}📦 Building frontend image...${NC}"
    docker build \
        --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
        --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" \
        --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
        --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
        -t ${REGISTRY}/cvbuilder-frontend:${VERSION} \
        -t ${REGISTRY}/cvbuilder-frontend:latest \
        ./frontend

    echo -e "${GREEN}✅ Frontend built successfully${NC}"
    echo ""

    echo -e "${YELLOW}⬆️  Pushing frontend image...${NC}"
    docker push ${REGISTRY}/cvbuilder-frontend:${VERSION}
    docker push ${REGISTRY}/cvbuilder-frontend:latest

    echo -e "${GREEN}✅ Frontend pushed successfully${NC}"
    echo ""
}

case "${1:-all}" in
    backend)
        build_backend
        ;;
    frontend)
        build_frontend
        ;;
    all)
        build_backend
        build_frontend
        ;;
    *)
        echo -e "${RED}Usage: $0 [backend|frontend|all]${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Done!${NC}"
echo ""
echo "Images built and pushed:"
echo "  - ${REGISTRY}/cvbuilder-backend:${VERSION}"
echo "  - ${REGISTRY}/cvbuilder-frontend:${VERSION}"
echo ""
echo "To deploy to Docker Swarm:"
echo "  ./scripts/deploy-swarm.sh"
echo ""
echo "To update running services:"
echo "  docker service update --force cvbuilder_backend"
echo "  docker service update --force cvbuilder_frontend"
echo ""
