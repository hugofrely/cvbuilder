from django.urls import path
from .views import (
    CreateCheckoutSessionView,
    StripeWebhookView,
    PaymentListView,
    SubscriptionDetailView,
    CancelSubscriptionView,
    CheckPaymentStatusView
)

app_name = 'payments'

urlpatterns = [
    # Stripe Checkout
    path('create-checkout/', CreateCheckoutSessionView.as_view(), name='create_checkout'),
    path('create-checkout', CreateCheckoutSessionView.as_view(), name='create_checkout_no_slash'),

    # Stripe Webhook - Support both with and without trailing slash
    path('webhook/', StripeWebhookView.as_view(), name='stripe_webhook'),
    path('webhook', StripeWebhookView.as_view(), name='stripe_webhook_no_slash'),

    # Payment Status Check
    path('check-status/', CheckPaymentStatusView.as_view(), name='check_payment_status'),
    path('check-status', CheckPaymentStatusView.as_view(), name='check_payment_status_no_slash'),

    # Payment & Subscription Management
    path('payments/', PaymentListView.as_view(), name='payment_list'),
    path('payments', PaymentListView.as_view(), name='payment_list_no_slash'),
    path('subscription/', SubscriptionDetailView.as_view(), name='subscription_detail'),
    path('subscription', SubscriptionDetailView.as_view(), name='subscription_detail_no_slash'),
    path('subscription/cancel/', CancelSubscriptionView.as_view(), name='subscription_cancel'),
    path('subscription/cancel', CancelSubscriptionView.as_view(), name='subscription_cancel_no_slash'),
]
