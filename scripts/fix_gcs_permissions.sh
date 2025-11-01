#!/bin/bash

# Script to fix GCS permissions
# Run this on your LOCAL machine

set -e

PROJECT_ID="cvbuilder-476609"
BUCKET_NAME="cvbuilder-images"
SERVICE_ACCOUNT="cvbuilder-storage@cvbuilder-476609.iam.gserviceaccount.com"

echo "======================================================"
echo "Fixing GCS Permissions"
echo "======================================================"

# Set project
echo "Setting project..."
gcloud config set project $PROJECT_ID

# 1. Make bucket publicly readable (pour que les images soient accessibles)
echo ""
echo "1. Setting public read access..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
echo "✓ Done"

# 2. Grant service account full permissions
echo ""
echo "2. Granting service account Storage Object Admin role..."
gsutil iam ch serviceAccount:$SERVICE_ACCOUNT:objectAdmin gs://$BUCKET_NAME
echo "✓ Done"

# 3. Also grant at project level for bucket operations
echo ""
echo "3. Granting project-level permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/storage.objectAdmin"
echo "✓ Done"

# 4. Configure CORS
echo ""
echo "4. Configuring CORS..."
cat > /tmp/cors.json <<'EOF'
[
  {
    "origin": ["http://localhost:3000", "http://localhost:8000", "*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json
echo "✓ Done"

# 5. Set uniform bucket-level access (recommended)
echo ""
echo "5. Setting uniform bucket-level access..."
gsutil uniformbucketlevelaccess set on gs://$BUCKET_NAME || echo "Already enabled or not supported"
echo "✓ Done"

echo ""
echo "======================================================"
echo "✅ Permissions Fixed!"
echo "======================================================"
echo ""
echo "Verify IAM policies:"
gsutil iam get gs://$BUCKET_NAME
echo ""
echo "======================================================"
