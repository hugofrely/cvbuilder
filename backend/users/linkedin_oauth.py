"""
Custom LinkedIn OAuth handler using OpenID Connect
"""
import requests
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .views import get_tokens_for_user
from .serializers import UserSerializer
import secrets


class LinkedInOAuthInitiate(APIView):
    """
    Initiate LinkedIn OAuth flow
    GET /api/auth/social/linkedin/
    """
    permission_classes = []

    def get(self, request):
        client_id = settings.LINKEDIN_CLIENT_ID
        redirect_uri = f"{request.scheme}://{request.get_host()}/api/auth/social/linkedin/callback/"
        state = secrets.token_urlsafe(32)

        # Store state in session for verification
        request.session['linkedin_oauth_state'] = state

        # Build authorization URL with OpenID Connect scopes
        auth_url = (
            f"https://www.linkedin.com/oauth/v2/authorization"
            f"?response_type=code"
            f"&client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            f"&state={state}"
            f"&scope=openid profile email"
        )

        return redirect(auth_url)


class LinkedInOAuthCallback(APIView):
    """
    Handle LinkedIn OAuth callback
    GET /api/auth/social/linkedin/callback/
    """
    permission_classes = []

    def get(self, request):
        # Get authorization code and state
        code = request.GET.get('code')
        state = request.GET.get('state')
        error = request.GET.get('error')

        # Check for errors
        if error:
            error_description = request.GET.get('error_description', 'Unknown error')
            frontend_url = settings.FRONTEND_URL
            return redirect(f'{frontend_url}/auth/login?error=linkedin_{error}')

        # Verify state to prevent CSRF
        stored_state = request.session.get('linkedin_oauth_state')
        if not state or state != stored_state:
            frontend_url = settings.FRONTEND_URL
            return redirect(f'{frontend_url}/auth/login?error=invalid_state')

        # Exchange code for access token
        token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        redirect_uri = f"{request.scheme}://{request.get_host()}/api/auth/social/linkedin/callback/"

        token_data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': settings.LINKEDIN_CLIENT_ID,
            'client_secret': settings.LINKEDIN_CLIENT_SECRET,
        }

        try:
            # Get access token
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            token_json = token_response.json()
            access_token = token_json.get('access_token')

            if not access_token:
                raise Exception('No access token received')

            # Get user profile using OpenID Connect userinfo endpoint
            userinfo_url = "https://api.linkedin.com/v2/userinfo"
            headers = {'Authorization': f'Bearer {access_token}'}

            profile_response = requests.get(userinfo_url, headers=headers)
            profile_response.raise_for_status()
            profile_data = profile_response.json()

            # Extract user information
            linkedin_id = profile_data.get('sub')  # OpenID Connect subject (user ID)
            email = profile_data.get('email')
            given_name = profile_data.get('given_name', '')
            family_name = profile_data.get('family_name', '')
            picture = profile_data.get('picture')

            if not email:
                raise Exception('Email not provided by LinkedIn')

            # Create or get user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': given_name,
                    'last_name': family_name,
                }
            )

            # Update user info if already exists
            if not created:
                user.first_name = given_name or user.first_name
                user.last_name = family_name or user.last_name
                user.save()

            # Generate JWT tokens
            tokens = get_tokens_for_user(user)

            # Redirect to frontend with tokens
            frontend_url = settings.FRONTEND_URL
            callback_url = f'{frontend_url}/auth/callback?access={tokens["access"]}&refresh={tokens["refresh"]}'

            return redirect(callback_url)

        except requests.exceptions.RequestException as e:
            print(f"LinkedIn OAuth error: {str(e)}")
            frontend_url = settings.FRONTEND_URL
            return redirect(f'{frontend_url}/auth/login?error=linkedin_api_error')
        except Exception as e:
            print(f"LinkedIn OAuth error: {str(e)}")
            frontend_url = settings.FRONTEND_URL
            return redirect(f'{frontend_url}/auth/login?error=authentication_failed')
