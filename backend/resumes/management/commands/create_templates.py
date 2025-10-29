from django.core.management.base import BaseCommand
from resumes.models import Template


class Command(BaseCommand):
    help = 'Create default CV templates'

    def handle(self, *args, **kwargs):
        # Read template files
        with open('templates/cv_template_simple.html', 'r') as f:
            simple_html = f.read()

        with open('templates/cv_template_simple.css', 'r') as f:
            simple_css = f.read()

        # Create Simple Template (Free)
        simple_template, created = Template.objects.get_or_create(
            name='Simple',
            defaults={
                'description': 'Un CV simple et élégant, idéal pour tous les secteurs',
                'is_premium': False,
                'is_active': True,
                'template_html': simple_html,
                'template_css': simple_css,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Template "{simple_template.name}" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠️  Template "{simple_template.name}" existe déjà')
            )

        # Create Modern Template (Premium)
        modern_html = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>{{ resume.full_name }} - CV</title>
</head>
<body>
    <div class="cv-modern">
        <aside class="sidebar">
            <div class="profile-photo">
                {% if resume.photo %}
                <img src="{{ resume.photo.url }}" alt="{{ resume.full_name }}">
                {% endif %}
            </div>
            <h1>{{ resume.full_name }}</h1>
            <p class="title">{{ resume.title }}</p>

            <section class="contact">
                <h3>Contact</h3>
                <p>{{ resume.email }}</p>
                {% if resume.phone %}<p>{{ resume.phone }}</p>{% endif %}
                {% if resume.address %}<p>{{ resume.address }}</p>{% endif %}
            </section>

            {% if resume.skills_data %}
            <section class="skills">
                <h3>Compétences</h3>
                {% for skill in resume.skills_data %}
                <div class="skill">{{ skill.name }}</div>
                {% endfor %}
            </section>
            {% endif %}
        </aside>

        <main class="main-content">
            {% if resume.summary %}
            <section>
                <h2>Profil</h2>
                <p>{{ resume.summary }}</p>
            </section>
            {% endif %}

            {% if resume.experience_data %}
            <section>
                <h2>Expérience</h2>
                {% for exp in resume.experience_data %}
                <div class="item">
                    <h4>{{ exp.position }}</h4>
                    <p class="company">{{ exp.company }} | {{ exp.start_date }} - {{ exp.end_date|default:"Présent" }}</p>
                    <p>{{ exp.description }}</p>
                </div>
                {% endfor %}
            </section>
            {% endif %}

            {% if resume.education_data %}
            <section>
                <h2>Formation</h2>
                {% for edu in resume.education_data %}
                <div class="item">
                    <h4>{{ edu.degree }}</h4>
                    <p>{{ edu.institution }} | {{ edu.start_date }} - {{ edu.end_date|default:"En cours" }}</p>
                </div>
                {% endfor %}
            </section>
            {% endif %}
        </main>
    </div>

    {% if watermark %}
    <div class="watermark">PREVIEW</div>
    {% endif %}
</body>
</html>
        """

        modern_css = """
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Arial', sans-serif;
    color: #333;
    background: white;
}

.cv-modern {
    display: flex;
    max-width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
}

.sidebar {
    width: 35%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 30px;
}

.profile-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 20px;
    border: 4px solid white;
}

.profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.sidebar h1 {
    font-size: 24pt;
    margin-bottom: 5px;
    text-align: center;
}

.sidebar .title {
    font-size: 12pt;
    opacity: 0.9;
    text-align: center;
    margin-bottom: 30px;
}

.sidebar h3 {
    font-size: 14pt;
    margin-bottom: 10px;
    border-bottom: 2px solid rgba(255,255,255,0.3);
    padding-bottom: 5px;
}

.sidebar section {
    margin-bottom: 25px;
}

.sidebar p {
    font-size: 10pt;
    margin-bottom: 5px;
    opacity: 0.9;
}

.skill {
    background: rgba(255,255,255,0.2);
    padding: 5px 10px;
    margin: 5px 0;
    border-radius: 3px;
    font-size: 10pt;
}

.main-content {
    width: 65%;
    padding: 40px 30px;
    background: white;
}

.main-content h2 {
    font-size: 18pt;
    color: #667eea;
    border-bottom: 2px solid #667eea;
    padding-bottom: 5px;
    margin-bottom: 15px;
}

.main-content section {
    margin-bottom: 30px;
}

.item {
    margin-bottom: 20px;
}

.item h4 {
    font-size: 13pt;
    color: #333;
    margin-bottom: 5px;
}

.company {
    font-size: 10pt;
    color: #667eea;
    margin-bottom: 8px;
}

.watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 120px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.05);
    z-index: -1;
}

@media print {
    .cv-modern {
        max-width: 100%;
    }
}
        """

        modern_template, created = Template.objects.get_or_create(
            name='Modern',
            defaults={
                'description': 'CV moderne avec sidebar colorée - Premium',
                'is_premium': True,
                'is_active': True,
                'template_html': modern_html,
                'template_css': modern_css,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Template "{modern_template.name}" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠️  Template "{modern_template.name}" existe déjà')
            )

        # Create Professional Template (Premium)
        professional_template, created = Template.objects.get_or_create(
            name='Professional',
            defaults={
                'description': 'CV professionnel épuré - Premium',
                'is_premium': True,
                'is_active': True,
                'template_html': simple_html,  # Réutiliser pour l'instant
                'template_css': simple_css,
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f'✅ Template "{professional_template.name}" créé avec succès')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'⚠️  Template "{professional_template.name}" existe déjà')
            )

        self.stdout.write(
            self.style.SUCCESS('\n🎉 Tous les templates ont été créés !')
        )
