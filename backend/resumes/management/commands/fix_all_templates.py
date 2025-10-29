"""
Command to fix all templates by adding missing variables
while preserving their original style and structure.
"""

from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Fix all templates by adding missing variables'

    def handle(self, *args, **options):
        self.stdout.write("=" * 80)
        self.stdout.write("MISE À JOUR DES TEMPLATES")
        self.stdout.write("=" * 80)

        # Template Tech Developer is already complete, use it as reference
        tech_dev = Template.objects.get(id=8)
        self.stdout.write(f"\n✅ Template Tech Developer déjà complet (référence)")

        # Get all templates except Tech Developer
        templates_to_fix = Template.objects.exclude(id=8).order_by('id')

        self.stdout.write(f"\n📝 {templates_to_fix.count()} templates à mettre à jour\n")

        for template in templates_to_fix:
            self.stdout.write(f"\n{'='*80}")
            self.stdout.write(f"Traitement: {template.name} (ID: {template.id})")
            self.stdout.write(f"{'='*80}")

            self.fix_template(template)

        self.stdout.write("\n" + "=" * 80)
        self.stdout.write("✅ TOUS LES TEMPLATES ONT ÉTÉ MIS À JOUR")
        self.stdout.write("=" * 80)

    def fix_template(self, template):
        """Fix a single template by adding missing sections."""
        html = template.template_html

        # Check what's missing and add sections
        new_html = html

        # Add missing photo in header if not present
        if '{{photo}}' not in html and '{{#if photo}}' not in html:
            new_html = self.add_photo_section(new_html)
            self.stdout.write("  + Ajout: photo")

        # Add missing personal info
        if '{{github_url}}' not in html:
            new_html = self.add_github_link(new_html)
            self.stdout.write("  + Ajout: github_url")

        if '{{city}}' not in html and '{{postal_code}}' not in html:
            new_html = self.add_location_info(new_html)
            self.stdout.write("  + Ajout: city, postal_code")

        # Add additional personal details section if missing
        if '{{date_of_birth}}' not in html or '{{nationality}}' not in html:
            new_html = self.add_personal_details_section(new_html)
            self.stdout.write("  + Ajout: date_of_birth, nationality, driving_license")

        # Add work_mode to experiences
        if 'experience_data' in html and '{{this.work_mode}}' not in html:
            new_html = self.add_work_mode_to_experiences(new_html)
            self.stdout.write("  + Ajout: work_mode aux expériences")

        # Add missing education fields
        if 'education_data' in html:
            if '{{this.field_of_study}}' not in html:
                new_html = self.add_field_of_study(new_html)
                self.stdout.write("  + Ajout: field_of_study")
            if '{{this.grade}}' not in html:
                new_html = self.add_grade(new_html)
                self.stdout.write("  + Ajout: grade")
            if '{{this.work_mode}}' not in html and 'edu' in html.lower():
                new_html = self.add_work_mode_to_education(new_html)
                self.stdout.write("  + Ajout: work_mode à la formation")

        # Add level_percentage to skills
        if 'skills_data' in html and '{{this.level_percentage}}' not in html:
            new_html = self.add_skill_percentage(new_html)
            self.stdout.write("  + Ajout: level_percentage aux compétences")

        # Add projects section if missing
        if '{{projects_data}}' not in html and '{{#if projects_data}}' not in html:
            new_html = self.add_projects_section(new_html)
            self.stdout.write("  + Ajout: section Projets")

        # Add certifications section if missing
        if '{{certifications_data}}' not in html and '{{#if certifications_data}}' not in html:
            new_html = self.add_certifications_section(new_html)
            self.stdout.write("  + Ajout: section Certifications")

        # Save the updated template
        template.template_html = new_html
        template.save()

        self.stdout.write(f"  ✅ Template {template.name} mis à jour")

    def add_photo_section(self, html):
        """Add photo to header section."""
        # Find the header or name section and add photo before it
        if '<h1>{{full_name}}</h1>' in html:
            return html.replace(
                '<h1>{{full_name}}</h1>',
                '{{#if photo}}<img src="{{photo}}" alt="{{full_name}}" class="profile-photo" style="max-width: 150px; border-radius: 50%; margin-bottom: 1rem;">{{/if}}\n    <h1>{{full_name}}</h1>'
            )
        return html

    def add_github_link(self, html):
        """Add GitHub link to the social links section."""
        if '{{linkedin_url}}' in html:
            return html.replace(
                '{{linkedin_url}}',
                '{{linkedin_url}}\n      {{#if github_url}}<a href="{{github_url}}">GitHub</a>{{/if}}'
            )
        elif '{{website}}' in html:
            return html.replace(
                '{{website}}',
                '{{website}}\n      {{#if github_url}}<a href="{{github_url}}">GitHub</a>{{/if}}'
            )
        return html

    def add_location_info(self, html):
        """Add city and postal code to contact section."""
        if '{{phone}}' in html:
            return html.replace(
                '{{phone}}',
                '{{phone}}\n      {{#if city}}{{#if postal_code}}<span>{{postal_code}} {{city}}</span>{{else}}<span>{{city}}</span>{{/if}}{{/if}}'
            )
        elif '{{email}}' in html:
            return html.replace(
                '{{email}}',
                '{{email}}\n      {{#if city}}{{#if postal_code}} | {{postal_code}} {{city}}{{else}} | {{city}}{{/if}}{{/if}}'
            )
        return html

    def add_personal_details_section(self, html):
        """Add personal details section after header."""
        # Find the end of header section (after contact info)
        if '</header>' in html:
            details_section = '''
    {{#if date_of_birth}}{{#if nationality}}{{#if driving_license}}
    <div class="personal-details" style="margin-bottom: 1rem; font-size: 0.9rem;">
      {{#if date_of_birth}}<span>📅 {{date_of_birth}}</span>{{/if}}
      {{#if nationality}} | <span>🌍 {{nationality}}</span>{{/if}}
      {{#if driving_license}} | <span>🚗 {{driving_license}}</span>{{/if}}
    </div>
    {{/if}}{{/if}}{{/if}}'''
            return html.replace('</header>', '</header>' + details_section)
        return html

    def add_work_mode_to_experiences(self, html):
        """Add work_mode to experience items."""
        # Find location in experience and add work_mode
        if '{{this.location}}' in html:
            return html.replace(
                '{{this.location}}',
                '{{this.location}}{{#if this.work_mode}} • {{this.work_mode}}{{/if}}'
            )
        # If no location, add after company/position
        elif '{{this.company}}' in html:
            return html.replace(
                '</h4>',
                '</h4>\n        {{#if this.work_mode}}<p class="work-mode" style="font-size: 0.9rem;">💼 {{this.work_mode}}</p>{{/if}}',
                1  # Only first occurrence
            )
        return html

    def add_field_of_study(self, html):
        """Add field_of_study to education."""
        if '{{this.degree}}' in html:
            return html.replace(
                '{{this.degree}}',
                '{{this.degree}}{{#if this.field_of_study}} - {{this.field_of_study}}{{/if}}'
            )
        return html

    def add_grade(self, html):
        """Add grade to education."""
        if '{{this.institution}}' in html and 'education_data' in html:
            # Add after institution
            return html.replace(
                '{{this.institution}}',
                '{{this.institution}}\n        {{#if this.grade}}<p class="grade" style="font-size: 0.9rem;">🏆 {{this.grade}}</p>{{/if}}'
            )
        return html

    def add_work_mode_to_education(self, html):
        """Add work_mode to education items."""
        if '{{this.location}}' in html and 'education' in html.lower():
            return html.replace(
                '{{this.location}}',
                '{{this.location}}{{#if this.work_mode}} • {{this.work_mode}}{{/if}}',
                1
            )
        return html

    def add_skill_percentage(self, html):
        """Add percentage bar to skills."""
        # Find skill level and add percentage bar after it
        if '{{this.level}}' in html:
            return html.replace(
                '{{this.level}}',
                '{{this.level}}\n        {{#if this.level_percentage}}<div class="skill-bar" style="height: 4px; background: #e0e0e0; margin-top: 0.25rem;"><div class="skill-fill" style="height: 100%; background: #4a90e2; width: {{this.level_percentage}}%;"></div></div>{{/if}}'
            )
        return html

    def add_projects_section(self, html):
        """Add projects section before custom sections."""
        projects_html = '''
  {{#if projects_data}}
  <section class="projects">
    <h2>Projets</h2>
    {{#each projects_data}}
    <div class="project-item">
      <div class="project-header">
        <h3>{{this.name}}</h3>
        {{#if this.date}}<span class="date">{{this.date}}</span>{{/if}}
      </div>
      {{#if this.url}}<p><a href="{{this.url}}">🔗 Voir le projet</a></p>{{/if}}
      {{#if this.description}}<p style="white-space: pre-wrap;">{{this.description}}</p>{{/if}}
      {{#if this.technologies}}
      <div class="technologies">
        {{#each this.technologies}}<span class="tech-tag">{{this}}</span>{{/each}}
      </div>
      {{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}
'''
        # Add before custom sections or before closing body
        if '{{#each custom_sections}}' in html:
            return html.replace('{{#each custom_sections}}', projects_html + '\n  {{#each custom_sections}}')
        elif '</body>' in html:
            return html.replace('</body>', projects_html + '\n</body>')
        return html

    def add_certifications_section(self, html):
        """Add certifications section before custom sections."""
        certifications_html = '''
  {{#if certifications_data}}
  <section class="certifications">
    <h2>Certifications</h2>
    {{#each certifications_data}}
    <div class="cert-item">
      <div class="cert-header">
        <h3>{{this.name}}</h3>
        {{#if this.date}}<span class="date">{{this.date}}</span>{{/if}}
      </div>
      {{#if this.issuer}}<p class="issuer">Délivré par: {{this.issuer}}</p>{{/if}}
      {{#if this.credential_id}}<p class="credential">ID: {{this.credential_id}}</p>{{/if}}
      {{#if this.url}}<p><a href="{{this.url}}">🔗 Vérifier</a></p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}
'''
        # Add before projects or custom sections
        if '{{#if projects_data}}' in html:
            return html.replace('{{#if projects_data}}', certifications_html + '\n  {{#if projects_data}}')
        elif '{{#each custom_sections}}' in html:
            return html.replace('{{#each custom_sections}}', certifications_html + '\n  {{#each custom_sections}}')
        elif '</body>' in html:
            return html.replace('</body>', certifications_html + '\n</body>')
        return html
