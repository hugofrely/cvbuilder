import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Payment, Subscription, WebhookEvent
from .serializers import (
    PaymentSerializer,
    SubscriptionSerializer,
    CreateCheckoutSessionSerializer
)
from resumes.models import Resume

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    """
    Create a Stripe checkout session for payment.

    Supports:
    - Single CV purchase
    - Monthly subscription
    - Yearly subscription
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CreateCheckoutSessionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payment_type = serializer.validated_data['payment_type']
        resume_id = serializer.validated_data.get('resume_id')
        success_url = serializer.validated_data.get(
            'success_url',
            f"{settings.FRONTEND_URL}/payment/success"
        )
        cancel_url = serializer.validated_data.get(
            'cancel_url',
            f"{settings.FRONTEND_URL}/payment/cancel"
        )

        try:
            # Determine price ID based on payment type
            if payment_type == 'single':
                if not resume_id:
                    return Response({
                        'error': 'Resume ID is required for single CV purchase'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Verify resume exists
                try:
                    resume = Resume.objects.get(id=resume_id)
                except Resume.DoesNotExist:
                    return Response({
                        'error': 'Resume not found'
                    }, status=status.HTTP_404_NOT_FOUND)

                price_id = settings.STRIPE_SINGLE_CV_PRICE_ID
                mode = 'payment'
                metadata = {
                    'payment_type': 'single',
                    'resume_id': resume_id
                }

            elif payment_type == 'monthly':
                price_id = settings.STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID
                mode = 'subscription'
                metadata = {
                    'payment_type': 'monthly'
                }

            elif payment_type == 'yearly':
                price_id = settings.STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID
                mode = 'subscription'
                metadata = {
                    'payment_type': 'yearly'
                }

            else:
                return Response({
                    'error': 'Invalid payment type'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Add user ID to metadata if authenticated
            if request.user.is_authenticated:
                metadata['user_id'] = str(request.user.id)
            # Add session ID for anonymous users
            elif request.session.session_key:
                metadata['session_id'] = request.session.session_key
            else:
                # Create session if it doesn't exist
                request.session.create()
                metadata['session_id'] = request.session.session_key

            # Create Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode=mode,
                success_url=success_url + '?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=cancel_url,
                metadata=metadata,
                client_reference_id=metadata.get('user_id', metadata.get('session_id'))
            )

            # Create Payment record
            payment_data = {
                'stripe_checkout_session_id': checkout_session.id,
                'amount': checkout_session.amount_total / 100,  # Convert from cents
                'currency': checkout_session.currency or 'usd',
                'payment_type': payment_type,
                'status': 'pending'
            }

            if request.user.is_authenticated:
                payment_data['user'] = request.user

            if resume_id:
                payment_data['resume_id'] = resume_id

            Payment.objects.create(**payment_data)

            return Response({
                'checkout_url': checkout_session.url,
                'session_id': checkout_session.id
            }, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            return Response({
                'error': 'Stripe error',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'error': 'Failed to create checkout session',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class StripeWebhookView(APIView):
    """
    Stripe webhook handler.

    Handles:
    - checkout.session.completed
    - customer.subscription.created
    - customer.subscription.updated
    - customer.subscription.deleted
    - invoice.payment_succeeded
    - invoice.payment_failed
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError:
            # Invalid payload
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            return HttpResponse(status=400)

        # Log webhook event
        webhook_event = WebhookEvent.objects.create(
            event_id=event['id'],
            event_type=event['type'],
            payload=event
        )

        try:
            # Handle the event
            if event['type'] == 'checkout.session.completed':
                self._handle_checkout_completed(event)

            elif event['type'] == 'customer.subscription.created':
                self._handle_subscription_created(event)

            elif event['type'] == 'customer.subscription.updated':
                self._handle_subscription_updated(event)

            elif event['type'] == 'customer.subscription.deleted':
                self._handle_subscription_deleted(event)

            elif event['type'] == 'invoice.payment_succeeded':
                self._handle_invoice_payment_succeeded(event)

            elif event['type'] == 'invoice.payment_failed':
                self._handle_invoice_payment_failed(event)

            # Mark webhook as processed
            webhook_event.processed = True
            webhook_event.save()

        except Exception as e:
            webhook_event.error_message = str(e)
            webhook_event.save()
            return HttpResponse(status=500)

        return HttpResponse(status=200)

    def _handle_checkout_completed(self, event):
        """Handle successful checkout completion"""
        session = event['data']['object']
        session_id = session['id']
        metadata = session.get('metadata', {})

        # Update Payment record
        try:
            payment = Payment.objects.get(stripe_checkout_session_id=session_id)
            payment.stripe_payment_intent_id = session.get('payment_intent')
            payment.status = 'succeeded'

            # Update user if authenticated
            user_id = metadata.get('user_id')
            if user_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                try:
                    payment.user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    pass

            payment.save()

            # If single CV purchase, mark resume as paid
            if metadata.get('payment_type') == 'single':
                resume_id = metadata.get('resume_id')
                if resume_id:
                    try:
                        resume = Resume.objects.get(id=resume_id)
                        resume.is_paid = True
                        resume.payment_type = 'single'
                        resume.save()
                    except Resume.DoesNotExist:
                        pass

        except Payment.DoesNotExist:
            pass

    def _handle_subscription_created(self, event):
        """Handle subscription creation"""
        subscription = event['data']['object']
        customer_id = subscription['customer']
        subscription_id = subscription['id']
        metadata = subscription.get('metadata', {})

        user_id = metadata.get('user_id')
        if not user_id:
            return

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)

            # Determine subscription type
            price_id = subscription['items']['data'][0]['price']['id']
            if price_id == settings.STRIPE_SUBSCRIPTION_MONTHLY_PRICE_ID:
                subscription_type = 'monthly'
            elif price_id == settings.STRIPE_SUBSCRIPTION_YEARLY_PRICE_ID:
                subscription_type = 'yearly'
            else:
                subscription_type = 'monthly'

            # Create or update Subscription
            Subscription.objects.update_or_create(
                user=user,
                defaults={
                    'stripe_subscription_id': subscription_id,
                    'stripe_customer_id': customer_id,
                    'stripe_price_id': price_id,
                    'subscription_type': subscription_type,
                    'status': subscription['status'],
                    'current_period_start': subscription['current_period_start'],
                    'current_period_end': subscription['current_period_end']
                }
            )

            # Update user subscription info
            user.stripe_customer_id = customer_id
            user.stripe_subscription_id = subscription_id
            user.is_premium = True
            user.subscription_type = subscription_type
            user.save()

        except User.DoesNotExist:
            pass

    def _handle_subscription_updated(self, event):
        """Handle subscription updates"""
        subscription = event['data']['object']
        subscription_id = subscription['id']

        try:
            sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
            sub.status = subscription['status']
            sub.current_period_start = subscription['current_period_start']
            sub.current_period_end = subscription['current_period_end']
            sub.cancel_at_period_end = subscription.get('cancel_at_period_end', False)

            if subscription.get('canceled_at'):
                from django.utils import timezone
                sub.canceled_at = timezone.datetime.fromtimestamp(
                    subscription['canceled_at']
                )

            sub.save()

            # Update user premium status
            user = sub.user
            if subscription['status'] == 'active':
                user.is_premium = True
            else:
                user.is_premium = False
            user.save()

        except Subscription.DoesNotExist:
            pass

    def _handle_subscription_deleted(self, event):
        """Handle subscription cancellation"""
        subscription = event['data']['object']
        subscription_id = subscription['id']

        try:
            sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
            sub.status = 'canceled'
            from django.utils import timezone
            sub.canceled_at = timezone.now()
            sub.save()

            # Update user premium status
            user = sub.user
            user.is_premium = False
            user.save()

        except Subscription.DoesNotExist:
            pass

    def _handle_invoice_payment_succeeded(self, event):
        """Handle successful invoice payment"""
        invoice = event['data']['object']
        subscription_id = invoice.get('subscription')

        if subscription_id:
            try:
                sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
                sub.status = 'active'
                sub.save()

                # Ensure user is premium
                user = sub.user
                user.is_premium = True
                user.save()

            except Subscription.DoesNotExist:
                pass

    def _handle_invoice_payment_failed(self, event):
        """Handle failed invoice payment"""
        invoice = event['data']['object']
        subscription_id = invoice.get('subscription')

        if subscription_id:
            try:
                sub = Subscription.objects.get(stripe_subscription_id=subscription_id)
                sub.status = 'past_due'
                sub.save()

            except Subscription.DoesNotExist:
                pass


class PaymentListView(generics.ListAPIView):
    """
    List user's payment history.
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-created_at')


class SubscriptionDetailView(generics.RetrieveAPIView):
    """
    Get user's current subscription details.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return Subscription.objects.get(user=self.request.user)
        except Subscription.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({
                'message': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CancelSubscriptionView(APIView):
    """
    Cancel user's subscription (at period end).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            subscription = Subscription.objects.get(user=request.user)

            # Cancel subscription at period end in Stripe
            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=True
            )

            # Update local record
            subscription.cancel_at_period_end = True
            subscription.save()

            return Response({
                'message': 'Subscription will be canceled at the end of the current period',
                'current_period_end': subscription.current_period_end
            }, status=status.HTTP_200_OK)

        except Subscription.DoesNotExist:
            return Response({
                'error': 'No active subscription found'
            }, status=status.HTTP_404_NOT_FOUND)

        except stripe.error.StripeError as e:
            return Response({
                'error': 'Stripe error',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
