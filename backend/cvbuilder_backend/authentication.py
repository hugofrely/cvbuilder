"""
Custom authentication classes for the API.
"""
from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication without CSRF validation.

    This is used for API endpoints that rely on JWT for authentication
    but still need session support for anonymous users.

    CSRF protection is not needed here because:
    1. JWT tokens already provide authentication
    2. Anonymous users use session for temporary storage only
    3. Sensitive operations require JWT authentication
    """

    def enforce_csrf(self, request):
        """
        Override to skip CSRF validation.
        """
        return  # Skip CSRF check
