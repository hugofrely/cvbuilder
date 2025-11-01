# Generated migration - Add UUID-based foreign keys for payments

from django.conf import settings
from django.db import migrations, models


def copy_fk_relations(apps, schema_editor):
    """Copy foreign key relations to UUID-based fields"""
    Payment = apps.get_model('payments', 'Payment')
    Subscription = apps.get_model('payments', 'Subscription')
    User = apps.get_model('users', 'User')
    Resume = apps.get_model('resumes', 'Resume')

    # Map old IDs to UUIDs
    user_id_to_uuid = {user.id: user.uuid_new for user in User.objects.all()}
    resume_id_to_uuid = {resume.id: resume.uuid_new for resume in Resume.objects.all()}

    # Copy Payment foreign keys
    for payment in Payment.objects.all():
        if payment.user_id:
            payment.user_uuid = user_id_to_uuid.get(payment.user_id)
        if payment.resume_id:
            payment.resume_uuid = resume_id_to_uuid.get(payment.resume_id)
        payment.save(update_fields=['user_uuid', 'resume_uuid'])

    # Copy Subscription foreign keys
    for subscription in Subscription.objects.all():
        if subscription.user_id:
            subscription.user_uuid = user_id_to_uuid.get(subscription.user_id)
            subscription.save(update_fields=['user_uuid'])


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payments', '0004_add_uuid_fields'),
        ('users', '0004_add_uuid_field'),
        ('resumes', '0008_add_uuid_fields'),
    ]

    operations = [
        # Add temporary UUID-based foreign key fields
        migrations.AddField(
            model_name='payment',
            name='user_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='payment',
            name='resume_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        migrations.AddField(
            model_name='subscription',
            name='user_uuid',
            field=models.UUIDField(null=True, db_index=True),
        ),
        # Copy relations
        migrations.RunPython(copy_fk_relations, reverse_code=migrations.RunPython.noop),
    ]
