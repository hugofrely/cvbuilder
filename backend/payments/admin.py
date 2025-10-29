from django.contrib import admin
from .models import Payment, Subscription, WebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'resume', 'amount', 'currency', 'payment_type', 'status', 'created_at']
    list_filter = ['payment_type', 'status', 'currency', 'created_at']
    search_fields = ['user__email', 'stripe_checkout_session_id', 'stripe_payment_intent_id']
    readonly_fields = ['created_at', 'updated_at', 'stripe_payment_intent_id', 'stripe_checkout_session_id']
    date_hierarchy = 'created_at'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'subscription_type', 'status', 'current_period_end', 'cancel_at_period_end']
    list_filter = ['subscription_type', 'status', 'cancel_at_period_end', 'created_at']
    search_fields = ['user__email', 'stripe_subscription_id', 'stripe_customer_id']
    readonly_fields = ['created_at', 'updated_at', 'stripe_subscription_id', 'stripe_customer_id']
    date_hierarchy = 'created_at'


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ['event_id', 'event_type', 'processed', 'created_at']
    list_filter = ['processed', 'event_type', 'created_at']
    search_fields = ['event_id', 'event_type']
    readonly_fields = ['created_at', 'event_id', 'event_type', 'payload']
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False  # Les webhooks sont créés automatiquement
