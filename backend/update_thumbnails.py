#!/usr/bin/env python
"""
Script to update template thumbnails in the database
Sets thumbnail field to the frontend URL (http://localhost:3000/filename.png)
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvbuilder_backend.settings')
django.setup()

from resumes.models import Template

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

def update_thumbnails():
    """Update all template thumbnails to use frontend URL"""

    templates = Template.objects.all()

    print(f"Found {templates.count()} templates\n")

    updated_count = 0
    for template in templates:
        # Generate filename: {id}-{name-slugified}.png
        filename = f"{template.id}-{template.name.lower().replace(' ', '-')}.png"

        # Create frontend URL
        new_thumbnail = f"{FRONTEND_URL}/{filename}"

        # Update thumbnail field
        old_thumbnail = template.thumbnail
        template.thumbnail = new_thumbnail
        template.save(update_fields=['thumbnail'])

        print(f"✓ Updated {template.name}:")
        print(f"  Old: {old_thumbnail}")
        print(f"  New: {template.thumbnail}\n")
        updated_count += 1

    print(f"\nSummary: Updated {updated_count}/{templates.count()} templates")

if __name__ == '__main__':
    update_thumbnails()
