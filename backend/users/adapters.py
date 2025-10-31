from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomAccountAdapter(DefaultAccountAdapter):
    """Custom account adapter for allauth without username"""

    def save_user(self, request, user, form, commit=True):
        """
        Save user without username field
        """
        user = super().save_user(request, user, form, commit=False)
        if commit:
            user.save()
        return user


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Custom social account adapter for allauth without username"""

    def populate_user(self, request, sociallogin, data):
        """
        Populate user data from social account, without username
        """
        user = super().populate_user(request, sociallogin, data)
        return user

    def pre_social_login(self, request, sociallogin):
        """
        Called after a user successfully authenticates via a social provider,
        but before the login is fully processed.
        """
        # Check if user already exists with this email
        if sociallogin.is_existing:
            return

        # If email is verified, try to connect to existing account
        if 'email' in sociallogin.account.extra_data:
            email = sociallogin.account.extra_data['email']
            try:
                user = User.objects.get(email=email)
                sociallogin.connect(request, user)
            except User.DoesNotExist:
                pass
