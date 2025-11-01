# Generated migration - Add UUID fields

from django.db import migrations, models
import uuid


def gen_uuids(apps, schema_editor):
    """Generate UUIDs for existing records"""
    Template = apps.get_model('resumes', 'Template')
    Resume = apps.get_model('resumes', 'Resume')
    Experience = apps.get_model('resumes', 'Experience')
    Education = apps.get_model('resumes', 'Education')
    Skill = apps.get_model('resumes', 'Skill')

    for obj in Template.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in Resume.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in Experience.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in Education.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in Skill.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])


class Migration(migrations.Migration):

    dependencies = [
        ('resumes', '0007_education_work_mode_experience_work_mode'),
    ]

    operations = [
        # Add UUID fields to all models
        migrations.AddField(
            model_name='template',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='resume',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='experience',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='education',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='skill',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        # Generate UUIDs
        migrations.RunPython(gen_uuids, reverse_code=migrations.RunPython.noop),
        # Make unique
        migrations.AlterField(
            model_name='template',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='resume',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='experience',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='education',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='skill',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
    ]
