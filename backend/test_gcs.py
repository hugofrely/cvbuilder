#!/usr/bin/env python
"""
Script to test Google Cloud Storage configuration
Run this inside the Docker container:
  docker compose exec backend python test_gcs.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvbuilder_backend.settings')
django.setup()

from django.conf import settings
from google.cloud import storage


def test_gcs_connection():
    """Test GCS connection and bucket access"""
    print("=" * 50)
    print("Testing Google Cloud Storage Configuration")
    print("=" * 50)

    # Check settings
    print(f"\n✓ USE_GCS: {settings.USE_GCS}")
    print(f"✓ GCS_BUCKET_NAME: {getattr(settings, 'GS_BUCKET_NAME', 'Not set')}")
    print(f"✓ GCS_PROJECT_ID: {getattr(settings, 'GS_PROJECT_ID', 'Not set')}")
    print(f"✓ GCS_CREDENTIALS: {getattr(settings, 'GS_CREDENTIALS', 'Not set')}")

    if not settings.USE_GCS:
        print("\n⚠️  USE_GCS is False - Using local storage")
        print(f"   MEDIA_ROOT: {settings.MEDIA_ROOT}")
        print(f"   MEDIA_URL: {settings.MEDIA_URL}")
        return

    # Check credentials file
    creds_path = getattr(settings, 'GS_CREDENTIALS', None)
    if creds_path and os.path.exists(creds_path):
        print(f"\n✓ Credentials file found: {creds_path}")
    else:
        print(f"\n✗ Credentials file NOT found: {creds_path}")
        return

    # Try to connect to GCS
    try:
        print("\n🔄 Attempting to connect to Google Cloud Storage...")

        # Set credentials environment variable for google-cloud-storage
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = creds_path

        client = storage.Client(project=settings.GS_PROJECT_ID)
        bucket = client.bucket(settings.GS_BUCKET_NAME)

        if bucket.exists():
            print(f"✓ Successfully connected to bucket: {settings.GS_BUCKET_NAME}")

            # Test listing objects
            blobs = list(bucket.list_blobs(max_results=5))
            print(f"\n✓ Bucket contains {len(blobs)} objects (showing max 5):")
            for blob in blobs:
                print(f"  - {blob.name}")

            # Test upload permissions (create a test file)
            test_blob = bucket.blob('test/connection_test.txt')
            test_content = 'GCS connection test successful!'
            test_blob.upload_from_string(test_content)
            print(f"\n✓ Upload test successful!")
            print(f"  Test file URL: {test_blob.public_url}")

            # Clean up test file
            test_blob.delete()
            print(f"✓ Test file cleaned up")

        else:
            print(f"\n✗ Bucket does not exist: {settings.GS_BUCKET_NAME}")
            print(f"  Create it with: gsutil mb -l europe-west1 gs://{settings.GS_BUCKET_NAME}")

    except Exception as e:
        print(f"\n✗ Error connecting to GCS:")
        print(f"  {type(e).__name__}: {str(e)}")
        print("\nTroubleshooting:")
        print("  1. Verify your service account has Storage Object Admin role")
        print("  2. Check that the bucket exists")
        print("  3. Verify the credentials JSON file is valid")

    print("\n" + "=" * 50)


if __name__ == '__main__':
    test_gcs_connection()
