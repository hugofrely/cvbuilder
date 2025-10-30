from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)
from .views import (
    UserRegistrationView,
    UserProfileView,
    ChangePasswordView,
    CustomTokenObtainPairView
)
from .oauth_views import (
    GoogleLoginView,
    OAuthCallbackView
)
from .linkedin_oauth import (
    LinkedInOAuthInitiate,
    LinkedInOAuthCallback
)

app_name = 'users'

urlpatterns = [
    # JWT Authentication
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),

    # User Management
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # OAuth Social Authentication
    path('social/google/', GoogleLoginView.as_view(), name='google_login'),
    path('social/linkedin/', LinkedInOAuthInitiate.as_view(), name='linkedin_login'),
    path('social/linkedin/callback/', LinkedInOAuthCallback.as_view(), name='linkedin_callback'),
    path('social/linkedin_oauth2/', LinkedInOAuthInitiate.as_view(), name='linkedin_login_alt'),  # Alias for compatibility
    path('social/callback/', OAuthCallbackView.as_view(), name='oauth_callback'),
]
