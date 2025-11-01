from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    """Custom user model with additional fields"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Remove username requirement and use email as the unique identifier
    username = None
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    # Subscription status
    is_premium = models.BooleanField(default=False)
    subscription_type = models.CharField(
        max_length=20,
        choices=[
            ('none', 'None'),
            ('lifetime', 'Lifetime'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ],
        default='none'
    )
    subscription_start_date = models.DateTimeField(blank=True, null=True)
    subscription_end_date = models.DateTimeField(blank=True, null=True)

    # Stripe customer ID
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def is_subscription_active(self):
        """Check if user has an active subscription"""
        if not self.subscription_end_date:
            return False
        from django.utils import timezone
        return timezone.now() < self.subscription_end_date
