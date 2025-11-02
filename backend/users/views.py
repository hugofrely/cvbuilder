from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()

# Note: With Supabase authentication, user registration is handled by Supabase.
# UserRegistrationView is no longer needed.


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile view"""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change password endpoint"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user

            # Check old password
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password': ['Wrong password.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Set new password
            user.set_password(serializer.data.get('new_password'))
            user.save()

            return Response(
                {'message': 'Password updated successfully'},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Note: With Supabase authentication, login is handled by Supabase.
# CustomTokenObtainPairView is no longer needed.


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """
    Logout endpoint - handles session cleanup for Supabase authentication.

    Note: With Supabase, JWT token management is handled client-side.
    This endpoint only handles Django session cleanup for anonymous users.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import logging
        logger = logging.getLogger(__name__)

        # Log the logout attempt
        old_session_key = request.session.session_key

        if request.user.is_authenticated:
            user_id = request.user.id
            user_email = request.user.email
            logger.info(f"Logout: User {user_id} ({user_email}) is logging out")

            # Destroy the authenticated session and create a fresh anonymous one
            request.session.flush()
            request.session.create()
            new_session_key = request.session.session_key

            logger.info(f"Logout: User {user_id} session changed from {old_session_key} to {new_session_key}")
        else:
            logger.info("Logout: Anonymous user attempting logout")

        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
