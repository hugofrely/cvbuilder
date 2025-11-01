#!/bin/bash

# Script to setup Google Cloud Storage bucket for CVBuilder
# Run this script on your LOCAL machine (not in Docker)

set -e

echo "======================================================"
echo "Setting up Google Cloud Storage for CVBuilder"
echo "======================================================"

PROJECT_ID="cvbuilder-476609"
BUCKET_NAME="cvbuilder-images"
SERVICE_ACCOUNT="cvbuilder-storage@cvbuilder-476609.iam.gserviceaccount.com"
REGION="europe-west1"

echo ""
echo "Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Bucket Name: $BUCKET_NAME"
echo "  Service Account: $SERVICE_ACCOUNT"
echo "  Region: $REGION"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✓ gcloud CLI found"

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found"
    echo "Please install it from: https://cloud.google.com/storage/docs/gsutil_install"
    exit 1
fi

echo "✓ gsutil found"

# Set the project
echo ""
echo "Setting active project..."
gcloud config set project $PROJECT_ID

# Check if bucket exists
echo ""
echo "Checking if bucket exists..."
if gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
    echo "✓ Bucket already exists: gs://$BUCKET_NAME"
else
    echo "Creating bucket..."
    gsutil mb -l $REGION gs://$BUCKET_NAME
    echo "✓ Bucket created: gs://$BUCKET_NAME"
fi

# Set CORS configuration for web access
echo ""
echo "Configuring CORS..."
cat > /tmp/cors.json <<EOF
[
  {
    "origin": ["http://localhost:3000", "https://your-production-domain.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json
echo "✓ CORS configured"

# Make bucket publicly readable (for photo URLs)
echo ""
echo "Setting public read access..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
echo "✓ Public read access granted"

# Grant service account permissions
echo ""
echo "Granting service account permissions..."
gsutil iam ch serviceAccount:$SERVICE_ACCOUNT:objectAdmin gs://$BUCKET_NAME
echo "✓ Service account permissions granted"

# Display bucket info
echo ""
echo "======================================================"
echo "✅ Setup Complete!"
echo "======================================================"
echo ""
echo "Bucket URL: https://storage.googleapis.com/$BUCKET_NAME/"
echo ""
echo "Test the connection:"
echo "  docker compose exec backend python test_gcs.py"
echo ""
echo "Bucket details:"
gsutil ls -L -b gs://$BUCKET_NAME | head -20
echo ""
echo "======================================================"
