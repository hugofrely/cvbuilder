"""
Django management command to update all templates with complete variable support
Based on TEMPLATE_VARIABLES.md specification
"""

from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Update all templates to use all available variables from TEMPLATE_VARIABLES.md'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Updating all templates...'))

        templates = Template.objects.all()

        for template in templates:
            self.stdout.write(f'\n{"="*80}')
            self.stdout.write(f'Updating template: {template.name} (ID: {template.id})')
            self.stdout.write(f'{"="*80}')

            html = template.template_html
            updated = False

            # 1. Add missing personal info fields in contact section
            if '{{#if address}}' in html and '{{#if city}}' not in html:
                # Update contact section to include city and postal_code
                html = html.replace(
                    '{{#if address}}<span>{{address}}</span>{{/if}}',
                    '{{#if address}}<span>{{address}}</span>{{/if}}\n'
                    '            {{#if city}}<span style="margin-right: 15px;">{{postal_code}} {{city}}</span>{{/if}}'
                )
                updated = True
                self.stdout.write('  ✓ Added city and postal_code to contact section')

            # 2. Add web links section after contact info
            if '{{#if linkedin_url}}' not in html:
                # Find the closing </div> of contact section and add links
                contact_div_pattern = '</div>\n    </header>'
                if contact_div_pattern in html:
                    web_links = '''
            {{#if linkedin_url}}{{#if website}}{{#if github_url}}
            <div style="color: #666; font-size: 14px; margin-top: 10px;">
                {{#if linkedin_url}}<a href="{{linkedin_url}}" style="color: #0077b5; text-decoration: none; margin-right: 15px;">LinkedIn</a>{{/if}}
                {{#if website}}<a href="{{website}}" style="color: #0077b5; text-decoration: none; margin-right: 15px;">Website</a>{{/if}}
                {{#if github_url}}<a href="{{github_url}}" style="color: #0077b5; text-decoration: none;">GitHub</a>{{/if}}
            </div>
            {{/if}}{{/if}}{{/if}}'''
                    html = html.replace(contact_div_pattern, web_links + '\n' + contact_div_pattern)
                    updated = True
                    self.stdout.write('  ✓ Added web links section (LinkedIn, Website, GitHub)')

            # 3. Add personal details section (date_of_birth, nationality, driving_license)
            if '{{#if date_of_birth}}' not in html and '</header>' in html:
                personal_details = '''

    {{#if date_of_birth}}{{#if nationality}}{{#if driving_license}}
    <section style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-left: 3px solid #333;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 10px 0;">Informations personnelles</h3>
        <div style="font-size: 14px; color: #666;">
            {{#if date_of_birth}}<p style="margin: 5px 0;">Date de naissance: {{date_of_birth}}</p>{{/if}}
            {{#if nationality}}<p style="margin: 5px 0;">Nationalité: {{nationality}}</p>{{/if}}
            {{#if driving_license}}<p style="margin: 5px 0;">Permis de conduire: {{driving_license}}</p>{{/if}}
        </div>
    </section>
    {{/if}}{{/if}}{{/if}}'''
                html = html.replace('</header>', '</header>' + personal_details)
                updated = True
                self.stdout.write('  ✓ Added personal details section (birth date, nationality, license)')

            # 4. Add location to experience items if missing
            if '{{#each experience_data}}' in html and '{{#if location}}' not in html.split('{{#each experience_data}}')[1].split('{{/each}}')[0]:
                # Update company line to include location
                html = html.replace(
                    '<p style="color: #666; font-size: 14px; margin: 0;">{{company}}</p>',
                    '<p style="color: #666; font-size: 14px; margin: 0;">{{company}}{{#if location}} - {{location}}{{/if}}</p>'
                )
                updated = True
                self.stdout.write('  ✓ Added location to experience items')

            # 5. Add location and description to education items
            if '{{#each education_data}}' in html:
                edu_section = html.split('{{#each education_data}}')[1].split('{{/each}}')[0]

                # Add location if missing
                if '{{#if location}}' not in edu_section and '{{institution}}' in edu_section:
                    html = html.replace(
                        '<p style="color: #666; font-size: 14px; margin: 0;">{{institution}}</p>',
                        '<p style="color: #666; font-size: 14px; margin: 0;">{{institution}}{{#if location}} - {{location}}{{/if}}</p>'
                    )
                    updated = True
                    self.stdout.write('  ✓ Added location to education items')

                # Add description if missing
                if '{{#if description}}' not in edu_section and '{{degree}}' in edu_section:
                    # Find the last </p> before {{/each}} and add description
                    edu_parts = html.split('{{#each education_data}}')
                    edu_content = edu_parts[1].split('{{/each}}')[0]

                    # Add description paragraph
                    description_html = '\n            {{#if description}}\n            <p style="line-height: 1.6; margin: 10px 0 0 0; white-space: pre-wrap;">{{description}}</p>\n            {{/if}}'

                    # Insert before closing div
                    edu_content = edu_content.replace('</div>', description_html + '\n        </div>')
                    html = edu_parts[0] + '{{#each education_data}}' + edu_content + '{{/each}}' + ''.join(edu_parts[1].split('{{/each}}')[1:])
                    updated = True
                    self.stdout.write('  ✓ Added description to education items')

            # 6. Add is_current support for dates
            if '{{#if is_current}}' not in html and '{{#if end_date}}' in html:
                # Update date format to show "Présent" for current positions
                html = html.replace(
                    '{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Présent{{/if}}',
                    '{{start_date}} - {{#if is_current}}Présent{{else}}{{end_date}}{{/if}}'
                )
                updated = True
                self.stdout.write('  ✓ Added is_current support for experience dates')

            # 7. Add languages_data section if missing
            if '{{#if languages_data}}' not in html:
                languages_section = '''

    {{#if languages_data}}
    {{#if languages_data.length}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Langues</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            {{#each languages_data}}
            <div style="padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
                <strong style="color: #333;">{{name}}</strong>
                <span style="color: #666; margin-left: 10px;">{{level}}</span>
            </div>
            {{/each}}
        </div>
    </section>
    {{/if}}
    {{/if}}'''

                # Insert before custom_sections or at the end before </div>
                if '{{#each custom_sections}}' in html:
                    html = html.replace('{{#each custom_sections}}', languages_section + '\n\n    {{#each custom_sections}}')
                else:
                    html = html.rstrip() + languages_section + '\n</div>'
                    # Remove the extra </div> we just added if it's a duplicate
                    if html.count('</div>') > html.count('<div'):
                        html = html.rsplit('</div>', 1)[0] + '</div>'

                updated = True
                self.stdout.write('  ✓ Added languages section')

            # 8. Add custom_sections support if missing
            if '{{#each custom_sections}}' not in html:
                custom_sections = '''

    {{#if custom_sections}}
    {{#if custom_sections.length}}
    {{#each custom_sections}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">{{title}}</h2>
        <p style="line-height: 1.6; margin: 0; white-space: pre-wrap;">{{content}}</p>
    </section>
    {{/each}}
    {{/if}}
    {{/if}}'''

                # Add at the end before closing </div>
                html = html.rstrip()
                if html.endswith('</div>'):
                    html = html[:-6] + custom_sections + '\n</div>'
                else:
                    html += custom_sections + '\n</div>'

                updated = True
                self.stdout.write('  ✓ Added custom sections support (hobbies, references)')

            # 9. Add level_percentage support for skills if using progress bars
            if '{{#each skills_data}}' in html and 'width:' in html.split('{{#each skills_data}}')[1].split('{{/each}}')[0]:
                # Check if already using level_percentage
                skills_section = html.split('{{#each skills_data}}')[1].split('{{/each}}')[0]
                if '{{level_percentage}}' not in skills_section:
                    # Try to add level_percentage to width styles
                    html = html.replace(
                        'style="width: 80%',
                        'style="width: {{level_percentage}}%'
                    ).replace(
                        'style="width: 60%',
                        'style="width: {{level_percentage}}%'
                    ).replace(
                        'style="width: 40%',
                        'style="width: {{level_percentage}}%'
                    )
                    updated = True
                    self.stdout.write('  ✓ Added level_percentage support for skills')

            # 10. Add photo support if missing (for templates that should have it)
            if template.name in ['Créatif', 'Moderne'] and '{{#if photo}}' not in html:
                photo_html = '''
        {{#if photo}}
        <img src="{{photo}}" alt="{{full_name}}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #333;">
        {{/if}}'''

                # Add after header opening
                html = html.replace('<header', photo_html + '\n    <header')
                updated = True
                self.stdout.write('  ✓ Added photo support')

            # Save if updated
            if updated:
                template.template_html = html
                template.save()
                self.stdout.write(self.style.SUCCESS(f'  ✅ Template "{template.name}" updated successfully!\n'))
            else:
                self.stdout.write(self.style.WARNING(f'  ⚠️  No updates needed for template "{template.name}"\n'))

        self.stdout.write(self.style.SUCCESS('\n✅ All templates have been updated!'))
