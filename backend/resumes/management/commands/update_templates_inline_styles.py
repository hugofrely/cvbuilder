from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Update templates to use inline styles instead of CSS classes'

    def handle(self, *args, **options):
        templates_data = [
            {
                'name': 'Classique',
                'template_html': '''
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
    <header style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #333; font-size: 32px; margin: 0 0 5px 0;">{{full_name}}</h1>
        <p style="color: #666; font-size: 18px; margin: 0 0 15px 0;">{{title}}</p>
        <div style="color: #666; font-size: 14px;">
            <span style="margin-right: 15px;">{{email}}</span>
            <span style="margin-right: 15px;">{{phone}}</span>
            <span>{{address}}</span>
        </div>
    </header>

    {% if summary %}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Profil</h2>
        <p style="line-height: 1.6; margin: 0;">{{summary}}</p>
    </section>
    {% endif %}

    {% if experience_data %}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Expérience professionnelle</h2>
        {% for exp in experience_data %}
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 5px 0;">{{exp.position}}</h3>
            <p style="color: #666; font-size: 14px; margin: 0;">{{exp.company}} - {{exp.location}}</p>
            <p style="color: #999; font-size: 12px; font-style: italic; margin: 5px 0;">{{exp.start_date}} - {{exp.end_date or "Présent"}}</p>
            <p style="line-height: 1.6; margin: 10px 0 0 0;">{{exp.description}}</p>
        </div>
        {% endfor %}
    </section>
    {% endif %}

    {% if education_data %}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Formation</h2>
        {% for edu in education_data %}
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333; font-size: 16px; margin: 0 0 5px 0;">{{edu.degree}}</h3>
            <p style="color: #666; font-size: 14px; margin: 0;">{{edu.institution}} - {{edu.location}}</p>
            <p style="color: #999; font-size: 12px; font-style: italic; margin: 5px 0;">{{edu.start_date}} - {{edu.end_date or "En cours"}}</p>
        </div>
        {% endfor %}
    </section>
    {% endif %}

    {% if skills_data %}
    <section style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Compétences</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        {% for skill in skills_data %}
            <span style="background: #f0f0f0; padding: 5px 15px; border-radius: 20px; font-size: 14px;">{{skill.name}}</span>
        {% endfor %}
        </div>
    </section>
    {% endif %}
</div>
                ''',
                'template_css': ''  # Empty CSS since we're using inline styles
            },
            {
                'name': 'Moderne',
                'template_html': '''
<div style="font-family: Helvetica, sans-serif; display: flex; min-height: 100vh;">
    <aside style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 300px; padding: 40px 30px;">
        {% if photo %}
        <img src="{{photo}}" alt="Photo" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 4px solid white;">
        {% endif %}
        <h1 style="font-size: 28px; margin: 0 0 10px 0;">{{full_name}}</h1>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 30px;">{{title}}</p>

        <div style="margin-top: 30px;">
            <h3 style="font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Contact</h3>
            <p style="font-size: 14px; margin: 5px 0;">{{email}}</p>
            <p style="font-size: 14px; margin: 5px 0;">{{phone}}</p>
            <p style="font-size: 14px; margin: 5px 0;">{{address}}</p>
        </div>

        {% if skills_data %}
        <div style="margin-top: 30px;">
            <h3 style="font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Compétences</h3>
            {% for skill in skills_data %}
            <div style="margin-bottom: 15px;">
                <span style="font-size: 14px;">{{skill.name}}</span>
                <div style="background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 5px;">
                    <div style="background: white; height: 100%; width: 80%;"></div>
                </div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </aside>

    <main style="flex: 1; padding: 40px 50px; background: white;">
        {% if summary %}
        <section style="margin-bottom: 30px;">
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">À propos</h2>
            <p style="line-height: 1.6; color: #555;">{{summary}}</p>
        </section>
        {% endif %}

        {% if experience_data %}
        <section style="margin-bottom: 30px;">
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">Expérience</h2>
            {% for exp in experience_data %}
            <div style="position: relative; padding-left: 30px; margin-bottom: 30px;">
                <div style="position: absolute; left: 0; top: 5px; width: 12px; height: 12px; background: #667eea; border-radius: 50%;"></div>
                <h3 style="font-size: 18px; color: #333; margin: 0 0 5px 0;">{{exp.position}}</h3>
                <p style="color: #666; font-size: 15px; margin: 0;">{{exp.company}}</p>
                <p style="color: #999; font-size: 13px; font-style: italic; margin: 5px 0 10px 0;">{{exp.start_date}} - {{exp.end_date or "Présent"}}</p>
                <p style="color: #555; line-height: 1.6; margin: 0;">{{exp.description}}</p>
            </div>
            {% endfor %}
        </section>
        {% endif %}

        {% if education_data %}
        <section>
            <h2 style="color: #667eea; font-size: 24px; margin: 0 0 20px 0;">Formation</h2>
            {% for edu in education_data %}
            <div style="position: relative; padding-left: 30px; margin-bottom: 30px;">
                <div style="position: absolute; left: 0; top: 5px; width: 12px; height: 12px; background: #667eea; border-radius: 50%;"></div>
                <h3 style="font-size: 18px; color: #333; margin: 0 0 5px 0;">{{edu.degree}}</h3>
                <p style="color: #666; font-size: 15px; margin: 0;">{{edu.institution}}</p>
                <p style="color: #999; font-size: 13px; font-style: italic; margin: 5px 0;">{{edu.start_date}} - {{edu.end_date or "En cours"}}</p>
            </div>
            {% endfor %}
        </section>
        {% endif %}
    </main>
</div>
                ''',
                'template_css': ''
            },
            {
                'name': 'Minimaliste',
                'template_html': '''
<div style="font-family: Georgia, serif; max-width: 750px; margin: 0 auto; padding: 60px 40px; color: #333;">
    <header style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 42px; font-weight: 300; margin: 0; letter-spacing: -1px;">{{full_name}}</h1>
        <p style="font-size: 18px; color: #666; margin: 10px 0 0 0; font-style: italic;">{{title}}</p>
    </header>

    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; margin-bottom: 40px; font-size: 14px; color: #666;">
        <span style="margin: 0 15px;">{{email}}</span>
        <span style="margin: 0 15px;">{{phone}}</span>
        <span style="margin: 0 15px;">{{linkedin_url}}</span>
    </div>

    {% if summary %}
    <section style="margin-bottom: 40px;">
        <p style="font-size: 16px; line-height: 1.8; color: #666; text-align: center; margin-bottom: 40px;">{{summary}}</p>
    </section>
    {% endif %}

    {% if experience_data %}
    <section style="margin-bottom: 40px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Experience</h2>
        {% for exp in experience_data %}
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 5px 0;">{{exp.position}}</h3>
                    <p style="font-size: 14px; color: #666; margin: 0;">{{exp.company}}</p>
                </div>
                <span style="font-size: 13px; color: #999; white-space: nowrap;">{{exp.start_date}} - {{exp.end_date or "Present"}}</span>
            </div>
            <p style="line-height: 1.6; margin: 0;">{{exp.description}}</p>
        </div>
        {% endfor %}
    </section>
    {% endif %}

    {% if education_data %}
    <section style="margin-bottom: 40px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Education</h2>
        {% for edu in education_data %}
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 5px 0;">{{edu.degree}}</h3>
                    <p style="font-size: 14px; color: #666; margin: 0;">{{edu.institution}}</p>
                </div>
                <span style="font-size: 13px; color: #999; white-space: nowrap;">{{edu.start_date}} - {{edu.end_date or "Present"}}</span>
            </div>
        </div>
        {% endfor %}
    </section>
    {% endif %}

    {% if skills_data %}
    <section>
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333;">Skills</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        {% for skill in skills_data %}
            <span style="font-size: 14px; color: #666; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 4px;">{{skill.name}}</span>
        {% endfor %}
        </div>
    </section>
    {% endif %}
</div>
                ''',
                'template_css': ''
            },
            {
                'name': 'Créatif',
                'template_html': '''
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa;">
    <div style="position: relative; height: 300px; overflow: hidden;">
        <div style="position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
        <div style="position: relative; z-index: 1; text-align: center; padding: 50px 20px; color: white;">
            {% if photo %}
            <img src="{{photo}}" alt="Photo" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-bottom: 20px; object-fit: cover;">
            {% endif %}
            <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">{{full_name}}</h1>
            <p style="font-size: 18px; margin: 0 0 15px 0; opacity: 0.95;">{{title}}</p>
            <div>
                <span style="color: white; margin: 0 15px; text-decoration: none; font-size: 14px;">{{email}}</span>
                <span style="color: white; margin: 0 15px; text-decoration: none; font-size: 14px;">{{phone}}</span>
            </div>
        </div>
    </div>

    <div style="max-width: 900px; margin: -50px auto 0; padding: 0 20px 40px; position: relative;">
        {% if summary %}
        <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="font-size: 32px;">💡</div>
            <div>
                <h2 style="font-size: 22px; color: #333; margin: 0 0 10px 0;">À propos de moi</h2>
                <p style="line-height: 1.6; margin: 0; color: #555;">{{summary}}</p>
            </div>
        </div>
        {% endif %}

        {% if experience_data %}
        <section style="margin-bottom: 30px;">
            <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                <span style="font-size: 24px;">💼</span>
                Expérience professionnelle
            </h2>
            {% for exp in experience_data %}
            <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <h3 style="font-size: 18px; color: #333; margin: 0;">{{exp.position}}</h3>
                    <span style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; white-space: nowrap;">{{exp.start_date[:4]}} - {{exp.end_date[:4] or "Now"}}</span>
                </div>
                <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">{{exp.company}} · {{exp.location}}</p>
                <p style="color: #555; line-height: 1.6; margin: 0;">{{exp.description}}</p>
            </div>
            {% endfor %}
        </section>
        {% endif %}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            {% if skills_data %}
            <section>
                <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                    <span style="font-size: 24px;">⚡</span>
                    Compétences
                </h2>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                {% for skill in skills_data %}
                    <div style="background: linear-gradient(135deg, rgba(240, 147, 251, 0.13) 0%, rgba(245, 87, 108, 0.13) 100%); color: #f5576c; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">{{skill.name}}</div>
                {% endfor %}
                </div>
            </section>
            {% endif %}

            {% if education_data %}
            <section>
                <h2 style="display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px;">
                    <span style="font-size: 24px;">🎓</span>
                    Formation
                </h2>
                {% for edu in education_data %}
                <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                    <h3 style="font-size: 16px; color: #333; margin: 0 0 5px 0;">{{edu.degree}}</h3>
                    <p style="color: #666; font-size: 14px; margin: 0 0 5px 0;">{{edu.institution}}</p>
                    <span style="color: #999; font-size: 12px;">{{edu.start_date[:4]}} - {{edu.end_date[:4] or "Present"}}</span>
                </div>
                {% endfor %}
            </section>
            {% endif %}
        </div>
    </div>
</div>
                ''',
                'template_css': ''
            }
        ]

        updated_count = 0
        for template_data in templates_data:
            try:
                template = Template.objects.get(name=template_data['name'])
                template.template_html = template_data['template_html']
                template.template_css = template_data['template_css']
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
            self.style.SUCCESS(f'\n✓ Updated {updated_count} templates with inline styles')
        )
