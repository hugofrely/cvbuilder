"""
Management command to re-import all HTML templates from files into the database.
This will update existing templates with the latest HTML, names, descriptions and categories from files.
"""
import os
import re
from django.core.management.base import BaseCommand
from django.conf import settings
from resumes.models import Template, TemplateCategory


class Command(BaseCommand):
    help = 'Re-import all HTML templates from files and update existing templates in the database (HTML, name, description, categories)'

    def handle(self, *args, **options):
        # Path to templates directory
        templates_dir = os.path.join(settings.BASE_DIR, 'resumes', 'templates')

        if not os.path.exists(templates_dir):
            self.stdout.write(self.style.ERROR(f'Templates directory not found: {templates_dir}'))
            return

        # Get all HTML files
        template_files = [f for f in os.listdir(templates_dir) if f.endswith('.html')]

        self.stdout.write(self.style.SUCCESS(f'Found {len(template_files)} template files'))
        self.stdout.write('')

        updated_count = 0
        not_found_count = 0
        error_count = 0

        for template_file in sorted(template_files):
            try:
                file_path = os.path.join(templates_dir, template_file)

                # Read the template file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Extract categories from HTML comment at the top
                categories = []
                category_match = re.search(r'<!--\s*Template Categories:\s*([^\n]+)\s*-->', content, re.IGNORECASE)
                if category_match:
                    categories_str = category_match.group(1)
                    categories = [cat.strip().lower() for cat in categories_str.split(',')]

                # Generate template name from filename
                template_name = template_file.replace('.html', '').replace('_', ' ').title()

                # Generate description based on name and categories
                description = self._generate_description(template_name, categories)

                # Find existing template
                existing_template = Template.objects.filter(name=template_name).first()

                if existing_template:
                    # Update the template
                    existing_template.template_html = content
                    existing_template.description = description
                    existing_template.save()

                    # Update categories
                    if categories:
                        existing_template.categories.clear()
                        for category_slug in categories:
                            # Find matching category
                            category = TemplateCategory.objects.filter(slug=category_slug).first()
                            if category:
                                existing_template.categories.add(category)
                            else:
                                # Try to match by name (case insensitive)
                                category = TemplateCategory.objects.filter(name__iexact=category_slug).first()
                                if category:
                                    existing_template.categories.add(category)
                                else:
                                    self.stdout.write(
                                        self.style.WARNING(f'    Category not found: {category_slug}')
                                    )

                    category_names = ', '.join([cat.name for cat in existing_template.categories.all()])
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✓ Updated: {template_name} (Categories: {category_names or "None"})')
                    )
                    updated_count += 1
                else:
                    self.stdout.write(
                        self.style.WARNING(f'  ⊘ Template not found in DB: {template_name}')
                    )
                    not_found_count += 1

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ✗ Error updating {template_file}: {str(e)}')
                )
                error_count += 1

        # Summary
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'=== Re-import Summary ==='))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count}'))
        if not_found_count > 0:
            self.stdout.write(self.style.WARNING(f'Not found in DB: {not_found_count}'))
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'Errors: {error_count}'))

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
