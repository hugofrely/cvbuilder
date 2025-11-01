# Generated migration - Switch to UUID primary keys for payments

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0005_add_uuid_fk_fields'),
        ('users', '0005_switch_to_uuid_primary_key'),
        ('resumes', '0010_switch_to_uuid_primary_keys'),
    ]

    operations = [
        # Remove old FK fields
        migrations.RemoveField(
            model_name='payment',
            name='user',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='resume',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='user',
        ),
        # Remove old id fields
        migrations.RemoveField(
            model_name='payment',
            name='id',
        ),
        migrations.RemoveField(
            model_name='subscription',
            name='id',
        ),
        migrations.RemoveField(
            model_name='webhookevent',
            name='id',
        ),
        # Rename uuid_new fields to id
        migrations.RenameField(
            model_name='payment',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='subscription',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='webhookevent',
            old_name='uuid_new',
            new_name='id',
        ),
        # Rename FK UUID fields
        migrations.RenameField(
            model_name='payment',
            old_name='user_uuid',
            new_name='user_id',
        ),
        migrations.RenameField(
            model_name='payment',
            old_name='resume_uuid',
            new_name='resume_id',
        ),
        migrations.RenameField(
            model_name='subscription',
            old_name='user_uuid',
            new_name='user_id',
        ),
        # Set correct field types for IDs (primary keys)
        migrations.AlterField(
            model_name='payment',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
        migrations.AlterField(
            model_name='webhookevent',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
    ]
