"""
Custom authentication classes for the API.
"""
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from users.supabase_auth import supabase_auth

User = get_user_model()


class SupabaseAuthentication(BaseAuthentication):
    """
    Authentication backend that validates Supabase JWT tokens.

    This backend:
    1. Extracts the Bearer token from Authorization header
    2. Validates the token with Supabase
    3. Syncs the Supabase user with local Django user
    4. Returns the Django user for request.user
    """

    def authenticate(self, request):
        """
        Authenticate the request using Supabase JWT token.

        Returns:
            Tuple of (user, token) or None if not authenticated
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            # Verify token with Supabase
            user_data = supabase_auth.get_user_from_token(token)

            if not user_data:
                raise AuthenticationFailed('Invalid token')

            # Get or create Django user synced with Supabase user
            user = self.get_or_create_user(user_data)

            return (user, token)

        except AuthenticationFailed:
            raise
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def get_or_create_user(self, supabase_user_data):
        """
        Get or create a Django user from Supabase user data.

        Args:
            supabase_user_data: User data from Supabase

        Returns:
            Django User instance
        """
        supabase_id = supabase_user_data['id']
        email = supabase_user_data['email']
        user_metadata = supabase_user_data.get('user_metadata', {})

        try:
            # Try to find user by email
            user = User.objects.get(email=email)

            # Update user metadata if needed
            if user_metadata:
                if user_metadata.get('first_name'):
                    user.first_name = user_metadata['first_name']
                if user_metadata.get('last_name'):
                    user.last_name = user_metadata['last_name']
                user.save()

        except User.DoesNotExist:
            # Create new user
            user = User.objects.create(
                email=email,
                first_name=user_metadata.get('first_name', ''),
                last_name=user_metadata.get('last_name', ''),
                is_active=True,
            )

        return user

    def authenticate_header(self, request):
        """
        Return the authentication scheme.
        """
        return 'Bearer'
