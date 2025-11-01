# Generated migration - Switch to UUID primary key

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_add_uuid_field'),
        ('resumes', '0009_add_uuid_fk_fields'),
        ('payments', '0005_add_uuid_fk_fields'),
    ]

    operations = [
        # Remove old id field
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        # Rename uuid_new to id and make it primary key
        migrations.RenameField(
            model_name='user',
            old_name='uuid_new',
            new_name='id',
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False),
        ),
    ]
