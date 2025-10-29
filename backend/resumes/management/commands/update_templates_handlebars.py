from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Update templates to use Handlebars syntax for frontend rendering'

    def handle(self, *args, **options):
        templates_data = [
            {
                'name': 'Classique',
                'template_html': '''
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
    <header style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #333; font-size: 32px; margin: 0 0 5px 0;">{{full_name}}</h1>
        {{#if title}}
        <p style="color: #666; font-size: 18px; margin: 0 0 15px 0;">{{title}}</p>
        {{/if}}
        <div style="color: #666; font-size: 14px;">
            {{#if email}}<span style="margin-right: 15px;">{{email}}</span>{{/if}}
            {{#if phone}}<span style="margin-right: 15px;">{{phone}}</span>{{/if}}
            {{#if address}}<span>{{address}}</span>{{/if}}
        </div>
    </header>

    {{#if summary}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Profil</h2>
        <p style="line-height: 1.6; margin: 0;">{{summary}}</p>
    </section>
    {{/if}}

    {{#if experience_data}}
    {{#if experience_data.length}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Expérience professionnelle</h2>
        {{#each experience_data}}
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 5px 0;">{{position}}</h3>
            <p style="color: #666; font-size: 14px; margin: 0;">{{company}}{{#if location}} - {{location}}{{/if}}</p>
            <p style="color: #999; font-size: 12px; font-style: italic; margin: 5px 0;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Présent{{/if}}</p>
            {{#if description}}
            <p style="line-height: 1.6; margin: 10px 0 0 0;">{{description}}</p>
            {{/if}}
        </div>
        {{/each}}
    </section>
    {{/if}}
    {{/if}}

    {{#if education_data}}
    {{#if education_data.length}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Formation</h2>
        {{#each education_data}}
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 5px 0;">{{degree}}</h3>
            <p style="color: #666; font-size: 14px; margin: 0;">{{institution}}{{#if location}} - {{location}}{{/if}}</p>
            <p style="color: #999; font-size: 12px; font-style: italic; margin: 5px 0;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - En cours{{/if}}</p>
        </div>
        {{/each}}
    </section>
    {{/if}}
    {{/if}}

    {{#if skills_data}}
    {{#if skills_data.length}}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Compétences</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        {{#each skills_data}}
            <span style="background: #f0f0f0; padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{name}}</span>
        {{/each}}
        </div>
    </section>
    {{/if}}
    {{/if}}
</div>
                '''
            },
            {
                'name': 'Moderne',
                'template_html': '''
<div style="font-family: Helvetica, sans-serif; display: flex; min-height: 100vh;">
    <aside style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 300px; padding: 40px 30px;">
        {{#if photo}}
        <img src="{{photo}}" alt="Photo" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 4px solid white;">
        {{/if}}
        <h1 style="font-size: 28px; margin: 0 0 10px 0;">{{full_name}}</h1>
        {{#if title}}
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 30px;">{{title}}</p>
        {{/if}}

        <div style="margin-top: 30px;">
            <h3 style="font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Contact</h3>
            {{#if email}}<p style="font-size: 14px; margin: 5px 0;">{{email}}</p>{{/if}}
            {{#if phone}}<p style="font-size: 14px; margin: 5px 0;">{{phone}}</p>{{/if}}
            {{#if address}}<p style="font-size: 14px; margin: 5px 0;">{{address}}</p>{{/if}}
        </div>

        {{#if skills_data}}
        {{#if skills_data.length}}
        <div style="margin-top: 30px;">
            <h3 style="font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Compétences</h3>
            {{#each skills_data}}
            <div style="margin-bottom: 15px;">
                <span style="font-size: 14px;">{{name}}</span>
                <div style="background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 5px;">
                    <div style="background: white; height: 100%; width: {{#if level}}{{#equal level 'expert'}}100%{{/equal}}{{#equal level 'advanced'}}80%{{/equal}}{{#equal level 'intermediate'}}60%{{/equal}}{{#equal level 'beginner'}}40%{{/equal}}{{else}}60%{{/if}};"></div>
                </div>
            </div>
            {{/each}}
        </div>
        {{/if}}
        {{/if}}
    </aside>

    <main style="flex: 1; padding: 40px 50px; background: white;">
        {{#if summary}}
        <section style="margin-bottom: 30px;">
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">À propos</h2>
            <p style="line-height: 1.6; color: #555;">{{summary}}</p>
        </section>
        {{/if}}

        {{#if experience_data}}
        {{#if experience_data.length}}
        <section style="margin-bottom: 30px;">
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">Expérience</h2>
            {{#each experience_data}}
            <div style="position: relative; padding-left: 30px; margin-bottom: 30px;">
                <div style="position: absolute; left: 0; top: 5px; width: 12px; height: 12px; background: #667eea; border-radius: 50%;"></div>
                <h3 style="font-size: 18px; color: #333; margin: 0 0 5px 0;">{{position}}</h3>
                <p style="color: #666; font-size: 15px; margin: 0;">{{company}}</p>
                <p style="color: #999; font-size: 13px; font-style: italic; margin: 5px 0 10px 0;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Présent{{/if}}</p>
                {{#if description}}
                <p style="color: #555; line-height: 1.6; margin: 0;">{{description}}</p>
                {{/if}}
            </div>
            {{/each}}
        </section>
        {{/if}}
        {{/if}}

        {{#if education_data}}
        {{#if education_data.length}}
        <section>
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">Formation</h2>
            {{#each education_data}}
            <div style="position: relative; padding-left: 30px; margin-bottom: 30px;">
                <div style="position: absolute; left: 0; top: 5px; width: 12px; height: 12px; background: #667eea; border-radius: 50%;"></div>
                <h3 style="font-size: 18px; color: #333; margin: 0 0 5px 0;">{{degree}}</h3>
                <p style="color: #666; font-size: 15px; margin: 0;">{{institution}}</p>
                <p style="color: #999; font-size: 13px; font-style: italic; margin: 5px 0;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - En cours{{/if}}</p>
            </div>
            {{/each}}
        </section>
        {{/if}}
        {{/if}}
    </main>
</div>
                '''
            },
            {
                'name': 'Minimaliste',
                'template_html': '''
<div style="font-family: Georgia, serif; max-width: 750px; margin: 0 auto; padding: 60px 40px; color: #333;">
    <header style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 42px; font-weight: 300; margin: 0; letter-spacing: -1px;">{{full_name}}</h1>
        {{#if title}}
        <p style="font-size: 18px; color: #666; margin: 10px 0 0 0; font-style: italic;">{{title}}</p>
        {{/if}}
    </header>

    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; margin-bottom: 40px; font-size: 14px; color: #666;">
        {{#if email}}<span style="margin: 0 15px;">{{email}}</span>{{/if}}
        {{#if phone}}<span style="margin: 0 15px;">{{phone}}</span>{{/if}}
        {{#if linkedin_url}}<span style="margin: 0 15px;">{{linkedin_url}}</span>{{/if}}
    </div>

    {{#if summary}}
    <section style="margin-bottom: 40px;">
        <p style="font-size: 16px; line-height: 1.8; color: #666; text-align: center; margin-bottom: 40px;">{{summary}}</p>
    </section>
    {{/if}}

    {{#if experience_data}}
    {{#if experience_data.length}}
    <section style="margin-bottom: 40px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Experience</h2>
        {{#each experience_data}}
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 5px 0;">{{position}}</h3>
                    <p style="font-size: 14px; color: #666; margin: 0;">{{company}}</p>
                </div>
                <span style="font-size: 13px; color: #999; white-space: nowrap;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Present{{/if}}</span>
            </div>
            {{#if description}}
            <p style="line-height: 1.6; margin: 0;">{{description}}</p>
            {{/if}}
        </div>
        {{/each}}
    </section>
    {{/if}}
    {{/if}}

    {{#if education_data}}
    {{#if education_data.length}}
    <section style="margin-bottom: 40px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Education</h2>
        {{#each education_data}}
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 5px 0;">{{degree}}</h3>
                    <p style="font-size: 14px; color: #666; margin: 0;">{{institution}}</p>
                </div>
                <span style="font-size: 13px; color: #999; white-space: nowrap;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Present{{/if}}</span>
            </div>
        </div>
        {{/each}}
    </section>
    {{/if}}
    {{/if}}

    {{#if skills_data}}
    {{#if skills_data.length}}
    <section>
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Skills</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        {{#each skills_data}}
            <span style="font-size: 14px; color: #666; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 4px;">{{name}}</span>
        {{/each}}
        </div>
    </section>
    {{/if}}
    {{/if}}
</div>
                '''
            },
            {
                'name': 'Créatif',
                'template_html': '''
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa;">
    <div style="position: relative; height: 300px; overflow: hidden;">
        <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
        <div style="position: relative; z-index: 1; text-align: center; padding: 50px 20px; color: white;">
            {{#if photo}}
            <img src="{{photo}}" alt="Photo" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-bottom: 20px; object-fit: cover;">
            {{/if}}
            <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">{{full_name}}</h1>
            {{#if title}}
            <p style="font-size: 18px; margin: 0 0 15px 0; opacity: 0.95;">{{title}}</p>
            {{/if}}
            <div>
                {{#if email}}<span style="color: white; margin: 0 15px; text-decoration: none; font-size: 14px;">{{email}}</span>{{/if}}
                {{#if phone}}<span style="color: white; margin: 0 15px; text-decoration: none; font-size: 14px;">{{phone}}</span>{{/if}}
            </div>
        </div>
    </div>

    <div style="max-width: 900px; margin: -50px auto 0; padding: 0 20px 40px; position: relative;">
        {{#if summary}}
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="font-size: 32px;">💡</div>
            <div>
                <h2 style="font-size: 22px; color: #333; margin: 0 0 10px 0;">À propos de moi</h2>
                <p style="line-height: 1.6; margin: 0; color: #555;">{{summary}}</p>
            </div>
        </div>
        {{/if}}

        {{#if experience_data}}
        {{#if experience_data.length}}
        <section style="margin-bottom: 30px;">
            <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                <span style="font-size: 24px;">💼</span>
                Expérience professionnelle
            </h2>
            {{#each experience_data}}
            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <h3 style="font-size: 18px; color: #333; margin: 0;">{{position}}</h3>
                    <span style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; white-space: nowrap;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Now{{/if}}</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">{{company}}{{#if location}} · {{location}}{{/if}}</p>
                {{#if description}}
                <p style="color: #555; line-height: 1.6; margin: 0;">{{description}}</p>
                {{/if}}
            </div>
            {{/each}}
        </section>
        {{/if}}
        {{/if}}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            {{#if skills_data}}
            {{#if skills_data.length}}
            <section>
                <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                    <span style="font-size: 24px;">⚡</span>
                    Compétences
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                {{#each skills_data}}
                    <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.13) 0%, rgba(245, 87, 108, 0.13) 100%); color: #f5576c; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">{{name}}</div>
                {{/each}}
                </div>
            </section>
            {{/if}}
            {{/if}}

            {{#if education_data}}
            {{#if education_data.length}}
            <section>
                <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                    <span style="font-size: 24px;">🎓</span>
                    Formation
                </h2>
                {{#each education_data}}
                <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                    <h3 style="font-size: 16px; color: #333; margin: 0 0 5px 0;">{{degree}}</h3>
                    <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">{{institution}}</p>
                    <span style="color: #999; font-size: 12px;">{{start_date}}{{#if end_date}} - {{end_date}}{{else}} - Present{{/if}}</span>
                </div>
                {{/each}}
            </section>
            {{/if}}
            {{/if}}
        </div>
    </div>
</div>
                '''
            }
        ]

        updated_count = 0
        for template_data in templates_data:
            try:
                template = Template.objects.get(name=template_data['name'])
                template.template_html = template_data['template_html']
                template.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Updated template: {template.name}')
                )
            except Template.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'✗ Template not found: {template_data["name"]}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Updated {updated_count} templates with Handlebars syntax')
        )
