from django.dispatch import receiver
from django.db.models.signals import post_save

# Note: With Supabase authentication, user login/signup is handled on the frontend.
# Anonymous resume linking is now done via the /api/resumes/migrate-anonymous/ endpoint
# which is called from the frontend after successful authentication.


@receiver(post_save, sender='users.User')
def update_user_premium_status(sender, instance, created, **kwargs):
    """
    Mettre à jour automatiquement le statut premium de l'utilisateur
    en fonction de son abonnement actif
    """
    if not created and instance.subscription_end_date:
        from django.utils import timezone

        # Vérifier si l'abonnement est toujours valide
        is_active = timezone.now() < instance.subscription_end_date

        if instance.is_premium != is_active:
            instance.is_premium = is_active
            instance.save(update_fields=['is_premium'])

            status = "activé" if is_active else "expiré"
            print(f"✅ Statut premium {status} pour {instance.email}")
