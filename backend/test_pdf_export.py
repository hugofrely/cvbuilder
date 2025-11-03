#!/usr/bin/env python
"""
Test script for PDF export functionality with templates from backend/resumes/templates/

This script tests the PDF generation with actual Handlebars templates
to ensure they work correctly with the PDFGenerationService.
"""

import os
import sys
import django

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvbuilder_backend.settings')
django.setup()

from resumes.pdf_service import PDFGenerationService
from resumes.models import Template, Resume
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_test_cv_data():
    """Create sample CV data for testing"""
    return {
        'full_name': 'Jean Dupont',
        'first_name': 'Jean',
        'last_name': 'Dupont',
        'email': 'jean.dupont@example.com',
        'phone': '+33 6 12 34 56 78',
        'address': '123 Rue de la Paix',
        'city': 'Paris',
        'postal_code': '75001',
        'website': 'https://jeandupont.fr',
        'linkedin_url': 'https://linkedin.com/in/jeandupont',
        'github_url': 'https://github.com/jeandupont',
        'photo': None,
        'title': 'Développeur Full Stack Senior',
        'date_of_birth': '1990-01-15',
        'nationality': 'Française',
        'driving_license': 'Permis B',
        'summary': 'Développeur passionné avec 8 ans d\'expérience dans le développement web. Expert en Python, JavaScript et frameworks modernes.',

        'experience_data': [
            {
                'position': 'Lead Developer',
                'company': 'TechCorp',
                'location': 'Paris',
                'start_date': '2020-01-01',
                'end_date': '',
                'is_current': True,
                'description': 'Direction d\'une équipe de 5 développeurs\nDéveloppement de microservices avec Django et FastAPI\nMise en place de CI/CD avec GitHub Actions',
                'work_mode': 'hybrid'
            },
            {
                'position': 'Senior Developer',
                'company': 'StartupXYZ',
                'location': 'Lyon',
                'start_date': '2017-06-01',
                'end_date': '2019-12-31',
                'is_current': False,
                'description': 'Développement d\'une plateforme SaaS avec React et Django\nOptimisation des performances et scalabilité\nMentorat de développeurs juniors',
                'work_mode': 'onsite'
            },
            {
                'position': 'Full Stack Developer',
                'company': 'WebAgency',
                'location': 'Paris',
                'start_date': '2015-03-01',
                'end_date': '2017-05-31',
                'is_current': False,
                'description': 'Développement de sites web et applications\nTravail avec diverses technologies (PHP, JavaScript, Python)',
                'work_mode': 'remote'
            }
        ],

        'education_data': [
            {
                'degree': 'Master en Informatique',
                'institution': 'Université Paris-Saclay',
                'location': 'Paris',
                'start_date': '2013-09-01',
                'end_date': '2015-06-30',
                'is_current': False,
                'description': 'Spécialisation en développement logiciel et intelligence artificielle',
                'work_mode': None
            },
            {
                'degree': 'Licence en Informatique',
                'institution': 'Université de Lyon',
                'location': 'Lyon',
                'start_date': '2010-09-01',
                'end_date': '2013-06-30',
                'is_current': False,
                'description': 'Formation en programmation et systèmes',
                'work_mode': None
            }
        ],

        'skills_data': [
            {'name': 'Python', 'level': 5, 'level_percentage': 100},
            {'name': 'JavaScript', 'level': 5, 'level_percentage': 100},
            {'name': 'Django', 'level': 5, 'level_percentage': 100},
            {'name': 'React', 'level': 4, 'level_percentage': 80},
            {'name': 'PostgreSQL', 'level': 4, 'level_percentage': 80},
            {'name': 'Docker', 'level': 4, 'level_percentage': 80},
            {'name': 'AWS', 'level': 3, 'level_percentage': 60},
            {'name': 'TypeScript', 'level': 4, 'level_percentage': 80},
        ],

        'languages_data': [
            {'name': 'Français', 'level': 'Langue maternelle'},
            {'name': 'Anglais', 'level': 'Courant (C1)'},
            {'name': 'Espagnol', 'level': 'Intermédiaire (B1)'},
        ],

        'certifications_data': [],
        'projects_data': [],
        'custom_sections': [],
        'hobbies': [],
        'references': [],
    }


def test_template(template_name):
    """Test PDF generation with a specific template"""
    logger.info(f"\n{'='*80}")
    logger.info(f"Testing template: {template_name}")
    logger.info(f"{'='*80}")

    try:
        # Get template from database
        template = Template.objects.get(name=template_name)
        logger.info(f"✓ Template found: {template.name} (ID: {template.id})")

        # Get template HTML and CSS
        html_content = template.template_html
        css_content = template.template_css or ''

        logger.info(f"  HTML length: {len(html_content)} characters")
        logger.info(f"  CSS length: {len(css_content)} characters")

        # Create test CV data
        cv_data = create_test_cv_data()

        # Generate PDF
        logger.info(f"  Generating PDF...")
        pdf_bytes = PDFGenerationService.generate_pdf_sync(
            html_content=html_content,
            css_content=css_content,
            cv_data=cv_data,
            filename=f"{template_name}.pdf"
        )

        # Save PDF to file
        output_dir = os.path.join(os.path.dirname(__file__), 'test_pdfs')
        os.makedirs(output_dir, exist_ok=True)

        output_path = os.path.join(output_dir, f"{template_name}.pdf")
        with open(output_path, 'wb') as f:
            f.write(pdf_bytes)

        logger.info(f"✓ PDF generated successfully: {len(pdf_bytes)} bytes")
        logger.info(f"✓ Saved to: {output_path}")

        return True

    except Template.DoesNotExist:
        logger.error(f"✗ Template not found: {template_name}")
        return False
    except Exception as e:
        logger.error(f"✗ Error generating PDF: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False


def main():
    """Main test function"""
    logger.info("Starting PDF Export Test")
    logger.info(f"Django settings: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

    # Get all active templates
    templates = Template.objects.filter(is_active=True).order_by('name')

    if not templates.exists():
        logger.error("No templates found in database!")
        logger.info("Please import templates first using: python manage.py import_templates")
        return

    logger.info(f"\nFound {templates.count()} active templates\n")

    # Test a few templates (using actual names from database)
    test_templates = [
        'Marketing Clean Minimalist',
        'Education Modern Academic',
        'Medical Clean Modern',
    ]

    # If specific templates not found, use first 3 available templates
    available_names = list(templates.values_list('name', flat=True))
    if not all(name in available_names for name in test_templates):
        logger.info(f"Using first 3 available templates instead")
        test_templates = available_names[:3]

    results = {}

    for template_name in test_templates:
        success = test_template(template_name)
        results[template_name] = success

    # Print summary
    logger.info(f"\n{'='*80}")
    logger.info("TEST SUMMARY")
    logger.info(f"{'='*80}")

    for template_name, success in results.items():
        status = "✓ PASS" if success else "✗ FAIL"
        logger.info(f"{status}: {template_name}")

    total = len(results)
    passed = sum(1 for s in results.values() if s)

    logger.info(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        logger.info("✓ All tests passed!")
    else:
        logger.error(f"✗ {total - passed} test(s) failed")


if __name__ == '__main__':
    main()
