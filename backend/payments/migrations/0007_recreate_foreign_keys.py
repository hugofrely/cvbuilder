# Generated migration - Recreate foreign keys with UUID for payments

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('resumes', '0011_recreate_foreign_keys'),
        ('payments', '0006_switch_to_uuid_primary_keys'),
    ]

    operations = [
        # Rename FK fields to Django convention (without _id suffix in model definition)
        migrations.RenameField(
            model_name='payment',
            old_name='user_id',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='payment',
            old_name='resume_id',
            new_name='resume',
        ),
        migrations.RenameField(
            model_name='subscription',
            old_name='user_id',
            new_name='user',
        ),
        # Recreate foreign keys with proper constraints
        migrations.AlterField(
            model_name='payment',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='payments',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='payment',
            name='resume',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='payments',
                to='resumes.resume',
                help_text='Related resume for single CV purchase',
            ),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='user',
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='subscription',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
