# Generated migration - Recreate foreign keys with UUID

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('resumes', '0010_switch_to_uuid_primary_keys'),
    ]

    operations = [
        # Rename FK fields to Django convention (without _id suffix in model definition)
        # Note: Django automatically adds _id suffix to the database column name
        migrations.RenameField(
            model_name='resume',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='resume',
            old_name='template_id',
            new_name='template',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='resume_id',
            new_name='resume',
        ),
        migrations.RenameField(
            model_name='education',
            old_name='resume_id',
            new_name='resume',
        ),
        migrations.RenameField(
            model_name='skill',
            old_name='resume_id',
            new_name='resume',
        ),
        # Recreate foreign keys with proper constraints
        migrations.AlterField(
            model_name='resume',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='resumes',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='resume',
            name='template',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='resumes',
                to='resumes.template',
            ),
        ),
        migrations.AlterField(
            model_name='experience',
            name='resume',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='experiences',
                to='resumes.resume',
            ),
        ),
        migrations.AlterField(
            model_name='education',
            name='resume',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='education',
                to='resumes.resume',
            ),
        ),
        migrations.AlterField(
            model_name='skill',
            name='resume',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='skills',
                to='resumes.resume',
            ),
        ),
    ]
