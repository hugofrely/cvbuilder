"""
Supabase Authentication Views
All authentication is handled by Supabase on the client side.
These views only handle profile management and sync.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


class UserProfileView(APIView):
    """
    Get or update user profile.
    Authentication is handled by SupabaseAuthentication middleware.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        """Update user profile"""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update user profile (full update)"""
        serializer = UserSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSyncView(APIView):
    """
    Sync user data from Supabase to Django.
    This is called after authentication to ensure local user data is up to date.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Sync user data.
        The user is already authenticated via SupabaseAuthentication,
        so we just return the current user data.
        """
        serializer = UserSerializer(request.user)
        return Response({
            'user': serializer.data,
            'message': 'User synced successfully'
        })


class LogoutView(APIView):
    """
    Logout endpoint.
    With Supabase, logout is handled on the client side.
    This endpoint just confirms logout on the server side.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Confirm logout.
        Actual session/token invalidation is handled by Supabase on client.
        """
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
