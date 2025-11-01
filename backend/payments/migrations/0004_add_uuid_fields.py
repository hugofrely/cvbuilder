# Generated migration - Add UUID fields

from django.db import migrations, models
import uuid


def gen_uuids(apps, schema_editor):
    """Generate UUIDs for existing records"""
    Payment = apps.get_model('payments', 'Payment')
    Subscription = apps.get_model('payments', 'Subscription')
    WebhookEvent = apps.get_model('payments', 'WebhookEvent')

    for obj in Payment.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in Subscription.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])

    for obj in WebhookEvent.objects.all():
        obj.uuid_new = uuid.uuid4()
        obj.save(update_fields=['uuid_new'])


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0003_initial'),
    ]

    operations = [
        # Add UUID fields to all models
        migrations.AddField(
            model_name='payment',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='subscription',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        migrations.AddField(
            model_name='webhookevent',
            name='uuid_new',
            field=models.UUIDField(null=True, editable=False),
        ),
        # Generate UUIDs
        migrations.RunPython(gen_uuids, reverse_code=migrations.RunPython.noop),
        # Make unique
        migrations.AlterField(
            model_name='payment',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
        migrations.AlterField(
            model_name='webhookevent',
            name='uuid_new',
            field=models.UUIDField(unique=True, editable=False),
        ),
    ]
