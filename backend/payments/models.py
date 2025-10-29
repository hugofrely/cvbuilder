from django.db import models
from django.conf import settings


class Payment(models.Model):
    """Payment transactions model"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        blank=True,
        null=True
    )

    resume = models.ForeignKey(
        'resumes.Resume',
        on_delete=models.SET_NULL,
        related_name='payments',
        blank=True,
        null=True,
        help_text="Related resume for single CV purchase"
    )

    # Stripe IDs
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_checkout_session_id = models.CharField(max_length=255, unique=True)

    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')

    payment_type = models.CharField(
        max_length=20,
        choices=[
            ('single', 'Single CV Purchase'),
            ('subscription', 'Subscription'),
        ]
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('succeeded', 'Succeeded'),
            ('failed', 'Failed'),
            ('refunded', 'Refunded'),
        ],
        default='pending'
    )

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency} ({self.status})"


class Subscription(models.Model):
    """Subscription model tracking user subscriptions"""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription'
    )

    # Stripe IDs
    stripe_subscription_id = models.CharField(max_length=255, unique=True)
    stripe_customer_id = models.CharField(max_length=255)
    stripe_price_id = models.CharField(max_length=255)

    subscription_type = models.CharField(
        max_length=20,
        choices=[
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ]
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('canceled', 'Canceled'),
            ('past_due', 'Past Due'),
            ('incomplete', 'Incomplete'),
            ('trialing', 'Trialing'),
        ],
        default='active'
    )

    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()

    cancel_at_period_end = models.BooleanField(default=False)
    canceled_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Subscription {self.id} - {self.user.email} ({self.subscription_type})"


class WebhookEvent(models.Model):
    """Track Stripe webhook events for debugging and auditing"""

    event_id = models.CharField(max_length=255, unique=True)
    event_type = models.CharField(max_length=100)
    payload = models.JSONField()
    processed = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'webhook_events'
        ordering = ['-created_at']

    def __str__(self):
        return f"Webhook {self.event_type} - {self.event_id}"
