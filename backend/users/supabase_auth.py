"""
Supabase Authentication Service
Handles all authentication operations through Supabase
"""
import os
import jwt
from typing import Optional, Dict, Any
from django.conf import settings
from supabase import create_client, Client
from rest_framework.exceptions import AuthenticationFailed


class SupabaseAuthService:
    """Service for managing Supabase authentication"""

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
        self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
        self.jwt_secret = os.getenv('SUPABASE_JWT_SECRET')

        if not all([self.supabase_url, self.supabase_key, self.jwt_secret]):
            raise ValueError(
                "Missing required Supabase environment variables. "
                "Please set SUPABASE_URL, SUPABASE_SERVICE_KEY, and SUPABASE_JWT_SECRET"
            )

        # Client with service key for admin operations
        self.client: Client = create_client(self.supabase_url, self.supabase_key)

    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify a Supabase JWT token

        Args:
            token: The JWT token to verify

        Returns:
            Dict containing the decoded token payload

        Raises:
            AuthenticationFailed: If token is invalid or expired
        """
        try:
            # Decode and verify the JWT token
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=['HS256'],
                audience='authenticated'
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

    def get_user_from_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Get user data from a Supabase access token

        Args:
            token: The access token

        Returns:
            Dict containing user data or None if invalid
        """
        try:
            payload = self.verify_token(token)
            user_id = payload.get('sub')
            email = payload.get('email')

            if not user_id:
                return None

            return {
                'id': user_id,
                'email': email,
                'user_metadata': payload.get('user_metadata', {}),
                'app_metadata': payload.get('app_metadata', {}),
            }
        except AuthenticationFailed:
            return None

    def create_user(self, email: str, password: str, user_metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Create a new user in Supabase

        Args:
            email: User's email
            password: User's password
            user_metadata: Optional metadata to store with the user

        Returns:
            Dict containing user data and session
        """
        try:
            response = self.client.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True,  # Auto-confirm email in development
                "user_metadata": user_metadata or {}
            })
            return response
        except Exception as e:
            raise ValueError(f"Failed to create user: {str(e)}")

    def update_user_metadata(self, user_id: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user metadata in Supabase

        Args:
            user_id: The Supabase user ID
            metadata: Metadata to update

        Returns:
            Updated user data
        """
        try:
            response = self.client.auth.admin.update_user_by_id(
                user_id,
                {"user_metadata": metadata}
            )
            return response
        except Exception as e:
            raise ValueError(f"Failed to update user metadata: {str(e)}")

    def delete_user(self, user_id: str) -> None:
        """
        Delete a user from Supabase

        Args:
            user_id: The Supabase user ID
        """
        try:
            self.client.auth.admin.delete_user(user_id)
        except Exception as e:
            raise ValueError(f"Failed to delete user: {str(e)}")

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user data by ID

        Args:
            user_id: The Supabase user ID

        Returns:
            User data or None if not found
        """
        try:
            response = self.client.auth.admin.get_user_by_id(user_id)
            return response.user if response else None
        except Exception:
            return None


# Singleton instance
supabase_auth = SupabaseAuthService()
