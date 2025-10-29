from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.db.models.signals import post_save
from allauth.socialaccount.signals import pre_social_login
from allauth.account.signals import user_signed_up


@receiver(user_logged_in)
def link_anonymous_resumes_on_login(sender, request, user, **kwargs):
    """
    Associer les CV créés anonymement (avec session_id) à l'utilisateur
    qui vient de se connecter
    """
    from resumes.models import Resume

    session_id = request.session.session_key

    if session_id:
        # Trouver tous les CV créés avec cette session
        anonymous_resumes = Resume.objects.filter(
            session_id=session_id,
            user__isnull=True
        )

        count = anonymous_resumes.count()

        if count > 0:
            # Associer ces CV à l'utilisateur
            anonymous_resumes.update(
                user=user,
                session_id=None
            )

            print(f"✅ {count} CV(s) anonyme(s) associé(s) à {user.email}")


@receiver(pre_social_login)
def link_anonymous_resumes_on_social_login(sender, request, sociallogin, **kwargs):
    """
    Associer les CV anonymes lors de la connexion sociale (Google, LinkedIn)
    Ce signal est déclenché AVANT la création du user
    """
    from resumes.models import Resume

    session_id = request.session.session_key

    if session_id and sociallogin.user.id:
        # Si l'utilisateur existe déjà (reconnexion)
        anonymous_resumes = Resume.objects.filter(
            session_id=session_id,
            user__isnull=True
        )

        count = anonymous_resumes.count()

        if count > 0:
            anonymous_resumes.update(
                user=sociallogin.user,
                session_id=None
            )

            print(f"✅ {count} CV(s) anonyme(s) associé(s) à {sociallogin.user.email} (social login)")


@receiver(user_signed_up)
def link_anonymous_resumes_on_signup(sender, request, user, **kwargs):
    """
    Associer les CV anonymes lors de l'inscription
    (classique ou sociale)
    """
    from resumes.models import Resume

    session_id = request.session.session_key

    if session_id:
        anonymous_resumes = Resume.objects.filter(
            session_id=session_id,
            user__isnull=True
        )

        count = anonymous_resumes.count()

        if count > 0:
            anonymous_resumes.update(
                user=user,
                session_id=None
            )

            print(f"✅ {count} CV(s) anonyme(s) associé(s) à {user.email} (inscription)")


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
