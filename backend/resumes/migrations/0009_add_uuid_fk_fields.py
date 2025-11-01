# Generated migration - Add UUID-based foreign keys

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def copy_fk_relations(apps, schema_editor):
    """Copy foreign key relations to UUID-based fields"""
    Resume = apps.get_model('resumes', 'Resume')
    Experience = apps.get_model('resumes', 'Experience')
    Education = apps.get_model('resumes', 'Education')
    Skill = apps.get_model('resumes', 'Skill')
    User = apps.get_model('users', 'User')
    Template = apps.get_model('resumes', 'Template')

    # Map old IDs to UUIDs for users
    user_id_to_uuid = {user.id: user.uuid_new for user in User.objects.all()}

    # Map old IDs to UUIDs for templates
    template_id_to_uuid = {template.id: template.uuid_new for template in Template.objects.all()}

    # Map old IDs to UUIDs for resumes
    resume_id_to_uuid = {resume.id: resume.uuid_new for resume in Resume.objects.all()}

    # Copy Resume foreign keys
    for resume in Resume.objects.all():
        if resume.user_id:
            resume.user_uuid = user_id_to_uuid.get(resume.user_id)
        if resume.template_id:
            resume.template_uuid = template_id_to_uuid.get(resume.template_id)
        resume.save(update_fields=['user_uuid', 'template_uuid'])

    # Copy Experience foreign keys
    for exp in Experience.objects.all():
        if exp.resume_id:
            exp.resume_uuid = resume_id_to_uuid.get(exp.resume_id)
            exp.save(update_fields=['resume_uuid'])

    # Copy Education foreign keys
    for edu in Education.objects.all():
        if edu.resume_id:
            edu.resume_uuid = resume_id_to_uuid.get(edu.resume_id)
            edu.save(update_fields=['resume_uuid'])

    # Copy Skill foreign keys
    for skill in Skill.objects.all():
        if skill.resume_id:
            skill.resume_uuid = resume_id_to_uuid.get(skill.resume_id)
            skill.save(update_fields=['resume_uuid'])


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('resumes', '0008_add_uuid_fields'),
        ('users', '0004_add_uuid_field'),
    ]

    operations = [
        # Add temporary UUID-based foreign key fields
        migrations.AddField(
            model_name='resume',
            name='user_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='resume',
            name='template_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='experience',
            name='resume_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='education',
            name='resume_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='skill',
            name='resume_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        # Copy relations
        migrations.RunPython(copy_fk_relations, reverse_code=migrations.RunPython.noop),
    ]
