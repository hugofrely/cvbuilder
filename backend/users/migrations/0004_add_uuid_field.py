# Generated migration - Add UUID field

from django.db import migrations, models
import uuid


def gen_uuid(apps, schema_editor):
    """Generate UUIDs for existing users"""
    User = apps.get_model('users', 'User')
    for user in User.objects.all():
        user.uuid_new = uuid.uuid4()
        user.save(update_fields=['uuid_new'])


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_user_username'),
    ]

    operations = [
        # Step 1: Add new UUID field (nullable)
        migrations.AddField(
            model_name='user',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        # Step 2: Generate UUIDs for existing records
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
        # Step 3: Add unique constraint to uuid_new
        migrations.AlterField(
            model_name='user',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
    ]
