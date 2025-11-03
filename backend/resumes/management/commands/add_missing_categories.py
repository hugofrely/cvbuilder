"""
Management command to add missing template categories.
"""
from django.core.management.base import BaseCommand
from resumes.models import TemplateCategory


class Command(BaseCommand):
    help = 'Add missing template categories to the database'

    def handle(self, *args, **options):
        # Define the missing categories
        missing_categories = [
            {'slug': 'modern', 'name': 'Modern', 'description': 'Modern and contemporary designs', 'order': 14},
            {'slug': 'professional', 'name': 'Professional', 'description': 'Professional business templates', 'order': 15},
            {'slug': 'elegant', 'name': 'Elegant', 'description': 'Elegant and sophisticated styles', 'order': 16},
            {'slug': 'marketing', 'name': 'Marketing', 'description': 'Templates for marketing professionals', 'order': 17},
            {'slug': 'classic', 'name': 'Classic', 'description': 'Classic and timeless designs', 'order': 18},
        ]

        created_count = 0
        existing_count = 0

        for cat_data in missing_categories:
            category, created = TemplateCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name': cat_data['name'],
                    'description': cat_data['description'],
                    'order': cat_data['order']
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created category: {category.name}'))
                created_count += 1
            else:
                self.stdout.write(self.style.WARNING(f'  - Category already exists: {category.name}'))
                existing_count += 1

        self.stdout.write(self.style.SUCCESS(f'\n=== Summary ==='))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count}'))
        self.stdout.write(self.style.WARNING(f'Already existed: {existing_count}'))
        self.stdout.write(self.style.SUCCESS(f'Total categories in database: {TemplateCategory.objects.count()}'))
