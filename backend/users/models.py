from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid


class UserManager(BaseUserManager):
    """Custom user manager that uses email instead of username"""

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular user with the given email and password"""
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a superuser with the given email and password"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


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

    objects = UserManager()

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
