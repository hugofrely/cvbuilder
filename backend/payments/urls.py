from django.urls import path
from .views import (
    CreateCheckoutSessionView,
    StripeWebhookView,
    PaymentListView,
    SubscriptionDetailView,
    CancelSubscriptionView
)

app_name = 'payments'

urlpatterns = [
    # Stripe Checkout
    path('create-checkout/', CreateCheckoutSessionView.as_view(), name='create_checkout'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe_webhook'),

    # Payment & Subscription Management
    path('payments/', PaymentListView.as_view(), name='payment_list'),
    path('subscription/', SubscriptionDetailView.as_view(), name='subscription_detail'),
    path('subscription/cancel/', CancelSubscriptionView.as_view(), name='subscription_cancel'),
]
