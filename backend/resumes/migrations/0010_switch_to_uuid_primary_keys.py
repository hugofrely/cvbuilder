# Generated migration - Switch to UUID primary keys

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('resumes', '0009_add_uuid_fk_fields'),
        ('users', '0005_switch_to_uuid_primary_key'),
    ]

    operations = [
        # Remove old FK fields
        migrations.RemoveField(
            model_name='resume',
            name='user',
        ),
        migrations.RemoveField(
            model_name='resume',
            name='template',
        ),
        migrations.RemoveField(
            model_name='experience',
            name='resume',
        ),
        migrations.RemoveField(
            model_name='education',
            name='resume',
        ),
        migrations.RemoveField(
            model_name='skill',
            name='resume',
        ),
        # Remove old id fields
        migrations.RemoveField(
            model_name='template',
            name='id',
        ),
        migrations.RemoveField(
            model_name='resume',
            name='id',
        ),
        migrations.RemoveField(
            model_name='experience',
            name='id',
        ),
        migrations.RemoveField(
            model_name='education',
            name='id',
        ),
        migrations.RemoveField(
            model_name='skill',
            name='id',
        ),
        # Rename uuid_new fields to id
        migrations.RenameField(
            model_name='template',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='resume',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='education',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='skill',
            old_name='uuid_new',
            new_name='id',
        ),
        # Rename FK UUID fields
        migrations.RenameField(
            model_name='resume',
            old_name='user_uuid',
            new_name='user_id',
        ),
        migrations.RenameField(
            model_name='resume',
            old_name='template_uuid',
            new_name='template_id',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='resume_uuid',
            new_name='resume_id',
        ),
        migrations.RenameField(
            model_name='education',
            old_name='resume_uuid',
            new_name='resume_id',
        ),
        migrations.RenameField(
            model_name='skill',
            old_name='resume_uuid',
            new_name='resume_id',
        ),
        # Set correct field types for IDs (primary keys)
        migrations.AlterField(
            model_name='template',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='resume',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='experience',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='education',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='skill',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
    ]
