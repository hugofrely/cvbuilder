"""
OAuth views for Google and LinkedIn authentication
Returns JWT tokens instead of session-based authentication
"""
from django.shortcuts import redirect
from django.conf import settings
from django.http import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class GoogleLoginView(APIView):
    """
    Initiate Google OAuth login
    GET /api/auth/social/google/
    """
    permission_classes = []

    def get(self, request):
        # Redirect to allauth Google login
        return HttpResponseRedirect('/accounts/google/login/')


class LinkedInLoginView(APIView):
    """
    Initiate LinkedIn OAuth login
    GET /api/auth/social/linkedin_oauth2/
    """
    permission_classes = []

    def get(self, request):
        # Redirect to allauth LinkedIn login
        return HttpResponseRedirect('/accounts/linkedin_oauth2/login/')


class OAuthCallbackView(APIView):
    """
    Handle OAuth callback and return JWT tokens
    This view is called after successful OAuth authentication
    """
    permission_classes = []

    def get(self, request):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            # Redirect to login page on frontend
            frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
            return redirect(f'{frontend_url}/auth/login?error=oauth_failed')

        # Generate tokens for the authenticated user
        tokens = get_tokens_for_user(request.user)
        user_data = UserSerializer(request.user).data

        # Redirect to frontend with tokens in URL params (will be extracted and stored)
        frontend_url = settings.FRONTEND_URL or 'http://localhost:3000'
        callback_url = f'{frontend_url}/auth/callback?access={tokens["access"]}&refresh={tokens["refresh"]}'

        return redirect(callback_url)


class OAuthStatusView(APIView):
    """
    API endpoint to get OAuth authentication status and tokens
    Called by frontend after OAuth redirect
    """
    permission_classes = []

    def post(self, request):
        """
        Expects: { "access": "token", "refresh": "token" }
        Returns user data if tokens are valid
        """
        access_token = request.data.get('access')
        refresh_token = request.data.get('refresh')

        if not access_token or not refresh_token:
            return Response(
                {'error': 'Missing tokens'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the access token and get user
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)

            return Response({
                'user': UserSerializer(user).data,
                'access': access_token,
                'refresh': refresh_token,
            })
        except Exception as e:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
