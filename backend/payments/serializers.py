from rest_framework import serializers
from .models import Payment, Subscription, WebhookEvent


class PaymentSerializer(serializers.ModelSerializer):
    """Payment serializer"""

    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'resume', 'stripe_checkout_session_id',
            'amount', 'currency', 'payment_type', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'status']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Subscription serializer"""

    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'stripe_subscription_id', 'subscription_type',
            'status', 'current_period_start', 'current_period_end',
            'cancel_at_period_end', 'canceled_at', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class CreateCheckoutSessionSerializer(serializers.Serializer):
    """Serializer for creating Stripe checkout session"""

    payment_type = serializers.ChoiceField(choices=['single', 'monthly', 'yearly'])
    resume_id = serializers.IntegerField(required=False, allow_null=True)
    success_url = serializers.URLField(required=False)
    cancel_url = serializers.URLField(required=False)

    def validate(self, attrs):
        if attrs['payment_type'] == 'single' and not attrs.get('resume_id'):
            raise serializers.ValidationError({
                "resume_id": "Resume ID is required for single CV purchase"
            })
        return attrs
