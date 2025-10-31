from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    ChangePasswordSerializer
)

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""

    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        tokens = get_tokens_for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


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


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns user data along with tokens"""

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Get the user from the email
            email = request.data.get('email')
            try:
                user = User.objects.get(email=email)
                response.data['user'] = UserSerializer(user).data
            except User.DoesNotExist:
                pass

        return response


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """
    Logout endpoint - handles both JWT and session cleanup.

    For authenticated users:
    - Blacklists the JWT refresh token
    - Destroys the current session
    - Creates a new anonymous session

    This ensures that after logout:
    - JWT tokens can't be reused (blacklisted)
    - User becomes truly anonymous with a fresh session
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

            # Blacklist the refresh token if provided
            refresh_token = request.data.get('refresh')
            if refresh_token:
                try:
                    from rest_framework_simplejwt.tokens import RefreshToken
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                    logger.info(f"Logout: Refresh token blacklisted for user {user_id}")
                except Exception as e:
                    logger.warning(f"Logout: Failed to blacklist token: {e}")

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
