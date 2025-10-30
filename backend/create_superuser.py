#!/usr/bin/env python
"""
Script to create a superuser for Django admin
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvbuilder_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Superuser credentials
email = 'admin@cvbuilder.com'
username = 'admin'
password = 'admin123'  # Change this in production!

# Check if superuser already exists
if User.objects.filter(email=email).exists():
    print(f'❌ Superuser with email {email} already exists!')
    user = User.objects.get(email=email)
    print(f'   Username: {user.username}')
    print(f'   Email: {user.email}')
else:
    # Create superuser
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'✅ Superuser created successfully!')
    print(f'   Username: {username}')
    print(f'   Email: {email}')
    print(f'   Password: {password}')
    print(f'\n🔐 Access Django admin at: http://localhost:8000/admin')
    print(f'⚠️  Remember to change the password in production!')
