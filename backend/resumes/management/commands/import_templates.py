"""
Management command to import all HTML templates from the templates directory into the database.
"""
import os
import re
from django.core.management.base import BaseCommand
from django.conf import settings
from resumes.models import Template, TemplateCategory


class Command(BaseCommand):
    help = 'Import all HTML templates from templates directory into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete all existing templates before importing',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(self.style.WARNING('Deleting all existing templates...'))
            Template.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('All templates deleted.'))

        # Path to templates directory
        templates_dir = os.path.join(settings.BASE_DIR, 'resumes', 'templates')

        if not os.path.exists(templates_dir):
            self.stdout.write(self.style.ERROR(f'Templates directory not found: {templates_dir}'))
            return

        # Get all HTML files
        template_files = [f for f in os.listdir(templates_dir) if f.endswith('.html')]

        self.stdout.write(self.style.SUCCESS(f'Found {len(template_files)} template files'))

        imported_count = 0
        skipped_count = 0
        error_count = 0

        for template_file in sorted(template_files):
            try:
                file_path = os.path.join(templates_dir, template_file)

                # Read the template file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Extract categories from HTML comment at the top
                # Format: <!-- Template Categories: category1, category2 -->
                categories = []
                category_match = re.search(r'<!--\s*Template Categories:\s*([^\n]+)\s*-->', content, re.IGNORECASE)
                if category_match:
                    categories_str = category_match.group(1)
                    categories = [cat.strip().lower() for cat in categories_str.split(',')]

                # Generate template name from filename
                # e.g., "sidebar_purple_creative.html" -> "Sidebar Purple Creative"
                template_name = template_file.replace('.html', '').replace('_', ' ').title()

                # Generate description based on name and categories
                description = self._generate_description(template_name, categories)

                # Check if template already exists
                existing_template = Template.objects.filter(name=template_name).first()

                if existing_template:
                    self.stdout.write(self.style.WARNING(f'  Skipping existing template: {template_name}'))
                    skipped_count += 1
                    continue

                # Create the template
                template = Template.objects.create(
                    name=template_name,
                    description=description,
                    template_html=content,
                    template_css='',  # CSS is inline in the HTML
                    is_premium=False,
                    is_active=True
                )

                # Add categories to the template
                if categories:
                    for category_slug in categories:
                        # Find matching category
                        category = TemplateCategory.objects.filter(slug=category_slug).first()
                        if category:
                            template.categories.add(category)
                        else:
                            # Try to match by name (case insensitive)
                            category = TemplateCategory.objects.filter(name__iexact=category_slug).first()
                            if category:
                                template.categories.add(category)
                            else:
                                self.stdout.write(
                                    self.style.WARNING(f'    Category not found: {category_slug}')
                                )

                category_names = ', '.join([cat.name for cat in template.categories.all()])
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Imported: {template_name} (Categories: {category_names or "None"})')
                )
                imported_count += 1

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ✗ Error importing {template_file}: {str(e)}')
                )
                error_count += 1

        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n=== Import Summary ==='))
        self.stdout.write(self.style.SUCCESS(f'Imported: {imported_count}'))
        self.stdout.write(self.style.WARNING(f'Skipped: {skipped_count}'))
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'Errors: {error_count}'))
        self.stdout.write(self.style.SUCCESS(f'Total templates in database: {Template.objects.count()}'))

    def _generate_description(self, name, categories):
        """Generate a description based on template name and categories"""
        descriptions = {
            'sidebar': 'Modèle avec mise en page latérale',
            'modern': 'Design moderne et contemporain',
            'classic': 'Style classique et professionnel',
            'creative': 'Design créatif et artistique',
            'minimalist': 'Approche épurée et minimaliste',
            'professional': 'Modèle professionnel d\'entreprise',
            'tech': 'Optimisé pour les professionnels de la technologie',
            'business': 'Parfait pour les professionnels d\'affaires',
            'marketing': 'Idéal pour les professionnels du marketing',
            'sales': 'Parfait pour les professionnels de la vente',
            'education': 'Conçu pour les éducateurs',
            'medical': 'Adapté aux professionnels de la santé',
            'legal': 'Adapté aux professionnels du droit',
            'engineering': 'Conçu pour les ingénieurs',
            'hospitality': 'Parfait pour l\'industrie hôtelière',
        }

        # Build description from categories
        desc_parts = []
        for category in categories:
            if category in descriptions:
                desc_parts.append(descriptions[category])

        if desc_parts:
            return f"{name} - {', '.join(desc_parts[:2])}"
        else:
            return f"{name} - Modèle de CV professionnel"
