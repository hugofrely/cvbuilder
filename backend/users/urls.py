from django.urls import path
from .supabase_views import (
    UserProfileView,
    UserSyncView,
    LogoutView
)

app_name = 'users'

urlpatterns = [
    # User Management (Supabase handles auth on client side)
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('sync/', UserSyncView.as_view(), name='sync'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
