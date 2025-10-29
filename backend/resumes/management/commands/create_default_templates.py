from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Create default CV templates'

    def handle(self, *args, **options):
        templates_data = [
            {
                'name': 'Classique',
                'description': 'Template professionnel et épuré, idéal pour tous les secteurs',
                'is_premium': False,
                'template_html': '''
                    <div class="cv-classic">
                        <header>
                            <h1>{{full_name}}</h1>
                            <p class="title">{{title}}</p>
                            <div class="contact">
                                <span>{{email}}</span>
                                <span>{{phone}}</span>
                                <span>{{address}}</span>
                            </div>
                        </header>

                        {% if summary %}
                        <section class="summary">
                            <h2>Profil</h2>
                            <p>{{summary}}</p>
                        </section>
                        {% endif %}

                        {% if experience_data %}
                        <section class="experience">
                            <h2>Expérience professionnelle</h2>
                            {% for exp in experience_data %}
                            <div class="experience-item">
                                <h3>{{exp.position}}</h3>
                                <p class="company">{{exp.company}} - {{exp.location}}</p>
                                <p class="dates">{{exp.start_date}} - {{exp.end_date or "Présent"}}</p>
                                <p>{{exp.description}}</p>
                            </div>
                            {% endfor %}
                        </section>
                        {% endif %}

                        {% if education_data %}
                        <section class="education">
                            <h2>Formation</h2>
                            {% for edu in education_data %}
                            <div class="education-item">
                                <h3>{{edu.degree}}</h3>
                                <p class="institution">{{edu.institution}} - {{edu.location}}</p>
                                <p class="dates">{{edu.start_date}} - {{edu.end_date or "En cours"}}</p>
                            </div>
                            {% endfor %}
                        </section>
                        {% endif %}

                        {% if skills_data %}
                        <section class="skills">
                            <h2>Compétences</h2>
                            <ul>
                            {% for skill in skills_data %}
                                <li>{{skill.name}} - {{skill.level}}</li>
                            {% endfor %}
                            </ul>
                        </section>
                        {% endif %}
                    </div>
                ''',
                'template_css': '''
                    .cv-classic { font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .cv-classic header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .cv-classic h1 { color: #333; font-size: 32px; margin: 0 0 5px 0; }
                    .cv-classic .title { color: #666; font-size: 18px; margin: 0 0 15px 0; }
                    .cv-classic .contact { color: #666; font-size: 14px; }
                    .cv-classic .contact span { margin-right: 15px; }
                    .cv-classic section { margin-bottom: 30px; }
                    .cv-classic h2 { color: #333; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; }
                    .cv-classic h3 { color: #333; font-size: 16px; margin: 0 0 5px 0; }
                    .cv-classic .company, .cv-classic .institution { color: #666; font-size: 14px; margin: 0; }
                    .cv-classic .dates { color: #999; font-size: 12px; font-style: italic; margin: 5px 0; }
                    .cv-classic .experience-item, .cv-classic .education-item { margin-bottom: 20px; }
                    .cv-classic .skills ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
                    .cv-classic .skills li { background: #f0f0f0; padding: 5px 15px; border-radius: 20px; }
                '''
            },
            {
                'name': 'Moderne',
                'description': 'Design contemporain avec une touche de couleur',
                'is_premium': False,
                'template_html': '''
                    <div class="cv-modern">
                        <aside class="sidebar">
                            {% if photo %}
                            <img src="{{photo}}" alt="Photo" class="profile-photo">
                            {% endif %}
                            <h1>{{full_name}}</h1>
                            <p class="title">{{title}}</p>

                            <div class="contact">
                                <h3>Contact</h3>
                                <p>{{email}}</p>
                                <p>{{phone}}</p>
                                <p>{{address}}</p>
                            </div>

                            {% if skills_data %}
                            <div class="skills">
                                <h3>Compétences</h3>
                                {% for skill in skills_data %}
                                <div class="skill-item">
                                    <span>{{skill.name}}</span>
                                    <div class="skill-bar">
                                        <div class="skill-level" style="width: {{skill.level_percent}}%"></div>
                                    </div>
                                </div>
                                {% endfor %}
                            </div>
                            {% endif %}
                        </aside>

                        <main class="main-content">
                            {% if summary %}
                            <section class="summary">
                                <h2>À propos</h2>
                                <p>{{summary}}</p>
                            </section>
                            {% endif %}

                            {% if experience_data %}
                            <section class="experience">
                                <h2>Expérience</h2>
                                {% for exp in experience_data %}
                                <div class="timeline-item">
                                    <div class="timeline-marker"></div>
                                    <div class="timeline-content">
                                        <h3>{{exp.position}}</h3>
                                        <p class="company">{{exp.company}}</p>
                                        <p class="dates">{{exp.start_date}} - {{exp.end_date or "Présent"}}</p>
                                        <p>{{exp.description}}</p>
                                    </div>
                                </div>
                                {% endfor %}
                            </section>
                            {% endif %}

                            {% if education_data %}
                            <section class="education">
                                <h2>Formation</h2>
                                {% for edu in education_data %}
                                <div class="timeline-item">
                                    <div class="timeline-marker"></div>
                                    <div class="timeline-content">
                                        <h3>{{edu.degree}}</h3>
                                        <p class="institution">{{edu.institution}}</p>
                                        <p class="dates">{{edu.start_date}} - {{edu.end_date or "En cours"}}</p>
                                    </div>
                                </div>
                                {% endfor %}
                            </section>
                            {% endif %}
                        </main>
                    </div>
                ''',
                'template_css': '''
                    .cv-modern { font-family: 'Helvetica', sans-serif; display: flex; min-height: 100vh; }
                    .cv-modern .sidebar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 300px; padding: 40px 30px; }
                    .cv-modern .profile-photo { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 4px solid white; }
                    .cv-modern .sidebar h1 { font-size: 28px; margin: 0 0 10px 0; }
                    .cv-modern .sidebar .title { font-size: 16px; opacity: 0.9; margin-bottom: 30px; }
                    .cv-modern .sidebar h3 { font-size: 18px; margin: 30px 0 15px 0; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px; }
                    .cv-modern .sidebar p { font-size: 14px; margin: 5px 0; }
                    .cv-modern .skill-item { margin-bottom: 15px; }
                    .cv-modern .skill-bar { background: rgba(255,255,255,0.3); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 5px; }
                    .cv-modern .skill-level { background: white; height: 100%; }
                    .cv-modern .main-content { flex: 1; padding: 40px 50px; background: white; }
                    .cv-modern .main-content h2 { color: #667eea; font-size: 24px; margin: 0 0 20px 0; }
                    .cv-modern .main-content h3 { color: #333; font-size: 18px; margin: 0 0 5px 0; }
                    .cv-modern .timeline-item { position: relative; padding-left: 30px; margin-bottom: 30px; }
                    .cv-modern .timeline-marker { position: absolute; left: 0; top: 5px; width: 12px; height: 12px; background: #667eea; border-radius: 50%; }
                    .cv-modern .timeline-marker::before { content: ""; position: absolute; left: 5px; top: 12px; width: 2px; height: 100%; background: #ddd; }
                    .cv-modern .company, .cv-modern .institution { color: #666; font-size: 15px; }
                    .cv-modern .dates { color: #999; font-size: 13px; font-style: italic; margin: 5px 0 10px 0; }
                '''
            },
            {
                'name': 'Minimaliste',
                'description': 'Simple et élégant, pour un maximum d\'impact',
                'is_premium': False,
                'template_html': '''
                    <div class="cv-minimal">
                        <header>
                            <h1>{{full_name}}</h1>
                            <p class="title">{{title}}</p>
                        </header>

                        <div class="contact-bar">
                            <span>{{email}}</span>
                            <span>{{phone}}</span>
                            <span>{{linkedin_url}}</span>
                        </div>

                        {% if summary %}
                        <section>
                            <p class="summary">{{summary}}</p>
                        </section>
                        {% endif %}

                        {% if experience_data %}
                        <section>
                            <h2>Experience</h2>
                            {% for exp in experience_data %}
                            <div class="item">
                                <div class="item-header">
                                    <div>
                                        <h3>{{exp.position}}</h3>
                                        <p class="meta">{{exp.company}}</p>
                                    </div>
                                    <span class="dates">{{exp.start_date}} - {{exp.end_date or "Present"}}</span>
                                </div>
                                <p>{{exp.description}}</p>
                            </div>
                            {% endfor %}
                        </section>
                        {% endif %}

                        {% if education_data %}
                        <section>
                            <h2>Education</h2>
                            {% for edu in education_data %}
                            <div class="item">
                                <div class="item-header">
                                    <div>
                                        <h3>{{edu.degree}}</h3>
                                        <p class="meta">{{edu.institution}}</p>
                                    </div>
                                    <span class="dates">{{edu.start_date}} - {{edu.end_date or "Present"}}</span>
                                </div>
                            </div>
                            {% endfor %}
                        </section>
                        {% endif %}

                        {% if skills_data %}
                        <section>
                            <h2>Skills</h2>
                            <div class="skills-grid">
                            {% for skill in skills_data %}
                                <span class="skill-tag">{{skill.name}}</span>
                            {% endfor %}
                            </div>
                        </section>
                        {% endif %}
                    </div>
                ''',
                'template_css': '''
                    .cv-minimal { font-family: 'Georgia', serif; max-width: 750px; margin: 0 auto; padding: 60px 40px; color: #333; }
                    .cv-minimal header { text-align: center; margin-bottom: 40px; }
                    .cv-minimal h1 { font-size: 42px; font-weight: 300; margin: 0; letter-spacing: -1px; }
                    .cv-minimal .title { font-size: 18px; color: #666; margin: 10px 0 0 0; font-style: italic; }
                    .cv-minimal .contact-bar { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; margin-bottom: 40px; font-size: 14px; color: #666; }
                    .cv-minimal .contact-bar span { margin: 0 15px; }
                    .cv-minimal .summary { font-size: 16px; line-height: 1.8; color: #666; text-align: center; margin-bottom: 40px; }
                    .cv-minimal section { margin-bottom: 40px; }
                    .cv-minimal h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin: 0 0 25px 0; color: #333; }
                    .cv-minimal .item { margin-bottom: 30px; }
                    .cv-minimal .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
                    .cv-minimal h3 { font-size: 18px; font-weight: 600; margin: 0 0 5px 0; }
                    .cv-minimal .meta { font-size: 14px; color: #666; margin: 0; }
                    .cv-minimal .dates { font-size: 13px; color: #999; white-space: nowrap; }
                    .cv-minimal .skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
                    .cv-minimal .skill-tag { font-size: 14px; color: #666; padding: 8px 16px; border: 1px solid #e0e0e0; border-radius: 4px; }
                '''
            },
            {
                'name': 'Créatif',
                'description': 'Design audacieux pour les profils créatifs',
                'is_premium': True,
                'template_html': '''
                    <div class="cv-creative">
                        <div class="header-section">
                            <div class="header-bg"></div>
                            <div class="header-content">
                                {% if photo %}
                                <img src="{{photo}}" alt="Photo" class="profile-photo">
                                {% endif %}
                                <h1>{{full_name}}</h1>
                                <p class="title">{{title}}</p>
                                <div class="header-links">
                                    <a href="mailto:{{email}}">{{email}}</a>
                                    <a href="tel:{{phone}}">{{phone}}</a>
                                </div>
                            </div>
                        </div>

                        <div class="content-wrapper">
                            {% if summary %}
                            <section class="summary-card">
                                <div class="card-icon">💡</div>
                                <div class="card-content">
                                    <h2>À propos de moi</h2>
                                    <p>{{summary}}</p>
                                </div>
                            </section>
                            {% endif %}

                            {% if experience_data %}
                            <section class="section">
                                <h2 class="section-title">
                                    <span class="title-icon">💼</span>
                                    Expérience professionnelle
                                </h2>
                                <div class="cards-container">
                                {% for exp in experience_data %}
                                    <div class="experience-card">
                                        <div class="card-header">
                                            <h3>{{exp.position}}</h3>
                                            <span class="badge">{{exp.start_date[:4]}} - {{exp.end_date[:4] or "Now"}}</span>
                                        </div>
                                        <p class="company">{{exp.company}} · {{exp.location}}</p>
                                        <p class="description">{{exp.description}}</p>
                                    </div>
                                {% endfor %}
                                </div>
                            </section>
                            {% endif %}

                            <div class="two-column">
                                {% if skills_data %}
                                <section class="section">
                                    <h2 class="section-title">
                                        <span class="title-icon">⚡</span>
                                        Compétences
                                    </h2>
                                    <div class="skills-container">
                                    {% for skill in skills_data %}
                                        <div class="skill-pill">{{skill.name}}</div>
                                    {% endfor %}
                                    </div>
                                </section>
                                {% endif %}

                                {% if education_data %}
                                <section class="section">
                                    <h2 class="section-title">
                                        <span class="title-icon">🎓</span>
                                        Formation
                                    </h2>
                                    {% for edu in education_data %}
                                    <div class="education-item">
                                        <h3>{{edu.degree}}</h3>
                                        <p>{{edu.institution}}</p>
                                        <span class="year">{{edu.start_date[:4]}} - {{edu.end_date[:4] or "Present"}}</span>
                                    </div>
                                    {% endfor %}
                                </section>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                ''',
                'template_css': '''
                    .cv-creative { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; }
                    .cv-creative .header-section { position: relative; height: 300px; overflow: hidden; }
                    .cv-creative .header-bg { position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
                    .cv-creative .header-content { position: relative; z-index: 1; text-align: center; padding: 50px 20px; color: white; }
                    .cv-creative .profile-photo { width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-bottom: 20px; }
                    .cv-creative h1 { font-size: 36px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 8px rgba(0,0,0,0.2); }
                    .cv-creative .title { font-size: 18px; margin: 0 0 15px 0; opacity: 0.95; }
                    .cv-creative .header-links a { color: white; margin: 0 15px; text-decoration: none; font-size: 14px; }
                    .cv-creative .content-wrapper { max-width: 900px; margin: -50px auto 0; padding: 0 20px 40px; position: relative; }
                    .cv-creative .summary-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); display: flex; gap: 20px; margin-bottom: 30px; }
                    .cv-creative .card-icon { font-size: 32px; }
                    .cv-creative .section { margin-bottom: 30px; }
                    .cv-creative .section-title { display: flex; align-items: center; gap: 10px; font-size: 22px; color: #333; margin-bottom: 20px; }
                    .cv-creative .title-icon { font-size: 24px; }
                    .cv-creative .experience-card { background: white; border-radius: 12px; padding: 25px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s; }
                    .cv-creative .experience-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
                    .cv-creative .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
                    .cv-creative .card-header h3 { font-size: 18px; color: #333; margin: 0; }
                    .cv-creative .badge { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; white-space: nowrap; }
                    .cv-creative .company { color: #666; font-size: 14px; margin: 0 0 10px 0; }
                    .cv-creative .description { color: #555; line-height: 1.6; margin: 0; }
                    .cv-creative .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                    .cv-creative .skills-container { display: flex; flex-wrap: wrap; gap: 10px; }
                    .cv-creative .skill-pill { background: linear-gradient(135deg, #f093fb22 0%, #f5576c22 100%); color: #f5576c; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; }
                    .cv-creative .education-item { background: white; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
                    .cv-creative .education-item h3 { font-size: 16px; color: #333; margin: 0 0 5px 0; }
                    .cv-creative .education-item p { color: #666; font-size: 14px; margin: 0 0 5px 0; }
                    .cv-creative .year { color: #999; font-size: 12px; }
                '''
            }
        ]

        created_count = 0
        for template_data in templates_data:
            template, created = Template.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created template: {template.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'- Template already exists: {template.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Created {created_count} new templates')
        )
