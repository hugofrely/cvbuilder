#!/usr/bin/env python
"""
Script pour analyser quelles variables sont utilisées dans chaque template
et identifier celles qui manquent.
"""

import os
import sys
import django
import re

# Configuration Django
sys.path.append('/Users/hugofrely/dev/cvbuilder/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from resumes.models import Template

# Toutes les variables attendues selon TEMPLATE_VARIABLES_REFERENCE.md
EXPECTED_VARIABLES = {
    "Informations personnelles": [
        "full_name", "title", "email", "phone", "address", "city",
        "postal_code", "photo", "date_of_birth", "nationality",
        "driving_license", "summary", "linkedin_url", "github_url", "website"
    ],
    "Expériences": [
        "experience_data", "position", "company", "location",
        "start_date", "end_date", "is_current", "description", "work_mode"
    ],
    "Formation": [
        "education_data", "degree", "field_of_study", "institution",
        "location", "start_date", "end_date", "is_current",
        "grade", "description", "work_mode"
    ],
    "Compétences": [
        "skills_data", "name", "level", "level_percentage"
    ],
    "Langues": [
        "languages_data", "name", "level", "level_percentage"
    ],
    "Certifications": [
        "certifications_data", "name", "issuer", "date",
        "credential_id", "url"
    ],
    "Projets": [
        "projects_data", "name", "description", "url",
        "date", "technologies"
    ],
    "Sections personnalisées": [
        "custom_sections", "title", "content"
    ]
}

def find_variable_in_template(var, template_html):
    """Cherche une variable dans le template avec différents patterns Handlebars."""
    patterns = [
        rf"{{{{{var}}}}}",              # {{var}}
        rf"{{{{this\.{var}}}}}",        # {{this.var}}
        rf"{{{{#if {var}}}}}",          # {{#if var}}
        rf"{{{{#if this\.{var}}}}}",    # {{#if this.var}}
        rf"{{{{#each {var}}}}}",        # {{#each var}}
        rf"{{{{first .*{var}",          # {{first this.var 4}}
    ]

    return any(re.search(pattern, template_html) for pattern in patterns)

def analyze_template(template):
    """Analyse un template et retourne les variables trouvées et manquantes."""
    html = template.template_html

    results = {
        "found": {},
        "missing": {},
        "stats": {"total": 0, "found": 0, "missing": 0}
    }

    for category, variables in EXPECTED_VARIABLES.items():
        results["found"][category] = []
        results["missing"][category] = []

        for var in variables:
            if find_variable_in_template(var, html):
                results["found"][category].append(var)
                results["stats"]["found"] += 1
            else:
                results["missing"][category].append(var)
                results["stats"]["missing"] += 1

            results["stats"]["total"] += 1

    return results

def main():
    templates = Template.objects.all().order_by('id')

    print("=" * 100)
    print("ANALYSE DES VARIABLES DANS LES TEMPLATES CV")
    print("=" * 100)

    all_results = []

    for template in templates:
        print(f"\n{'='*100}")
        print(f"TEMPLATE: {template.name} (ID: {template.id})")
        print(f"{'='*100}")

        results = analyze_template(template)
        all_results.append({
            "template": template,
            "results": results
        })

        # Statistiques
        total = results["stats"]["total"]
        found = results["stats"]["found"]
        missing = results["stats"]["missing"]
        percentage = (found / total * 100) if total > 0 else 0

        print(f"\n📊 STATISTIQUES:")
        print(f"   Variables trouvées: {found}/{total} ({percentage:.1f}%)")
        print(f"   Variables manquantes: {missing}/{total}")

        # Variables manquantes par catégorie
        has_missing = False
        for category, vars_list in results["missing"].items():
            if vars_list:
                has_missing = True
                break

        if has_missing:
            print(f"\n❌ VARIABLES MANQUANTES:")
            for category, vars_list in results["missing"].items():
                if vars_list:
                    print(f"\n   {category}:")
                    for var in vars_list:
                        print(f"      • {var}")
        else:
            print(f"\n✅ TOUTES LES VARIABLES SONT PRÉSENTES!")

    # Résumé global
    print(f"\n\n{'='*100}")
    print("RÉSUMÉ GLOBAL")
    print(f"{'='*100}")

    print(f"\nNombre total de templates: {len(all_results)}")

    complete_templates = []
    incomplete_templates = []

    for item in all_results:
        template = item["template"]
        results = item["results"]
        percentage = (results["stats"]["found"] / results["stats"]["total"] * 100)

        if results["stats"]["missing"] == 0:
            complete_templates.append(template.name)
        else:
            incomplete_templates.append({
                "name": template.name,
                "id": template.id,
                "percentage": percentage,
                "missing_count": results["stats"]["missing"]
            })

    print(f"\n✅ Templates complets ({len(complete_templates)}):")
    for name in complete_templates:
        print(f"   • {name}")

    print(f"\n⚠️  Templates incomplets ({len(incomplete_templates)}):")
    for item in sorted(incomplete_templates, key=lambda x: x["percentage"], reverse=True):
        print(f"   • {item['name']} (ID: {item['id']}) - {item['percentage']:.1f}% complet - {item['missing_count']} variables manquantes")

if __name__ == "__main__":
    main()
