#!/usr/bin/env python
"""
Test actual file upload to GCS using django-storages
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvbuilder_backend.settings')
django.setup()

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.conf import settings

print("=" * 50)
print("Testing GCS Upload with django-storages")
print("=" * 50)

print(f"\nDEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
print(f"GS_BUCKET_NAME: {settings.GS_BUCKET_NAME}")
print(f"GOOGLE_APPLICATION_CREDENTIALS: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')}")

# Create a test file
test_content = b"Hello from CVBuilder! This is a test upload."
test_filename = "test/upload_test.txt"

try:
    print(f"\n📤 Uploading test file: {test_filename}")

    # Save file using default_storage (which should be GCS)
    file_path = default_storage.save(test_filename, ContentFile(test_content))

    print(f"✓ File saved to: {file_path}")

    # Get the URL
    file_url = default_storage.url(file_path)
    print(f"✓ File URL: {file_url}")

    # Check if file exists
    exists = default_storage.exists(file_path)
    print(f"✓ File exists: {exists}")

    # Get file size
    size = default_storage.size(file_path)
    print(f"✓ File size: {size} bytes")

    # Read back the content
    with default_storage.open(file_path, 'rb') as f:
        content = f.read()
        print(f"✓ Content matches: {content == test_content}")

    # Clean up
    default_storage.delete(file_path)
    print(f"✓ Test file deleted")

    print("\n" + "=" * 50)
    print("✅ GCS Upload Test PASSED!")
    print("=" * 50)

except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    print("\n" + "=" * 50)
    print("❌ GCS Upload Test FAILED!")
    print("=" * 50)
