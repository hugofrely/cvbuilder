'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  Paper,
  Chip,
} from '@mui/material';
import {
  Check,
  Lock,
  Download,
  WorkspacePremium,
  ArrowBack,
  Security,
  VerifiedUser,
  CreditCard,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { paymentApi } from '@/lib/api/payment';

function PaymentContent() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get plan from URL
  const planParam = searchParams.get('plan');
  const resumeId = searchParams.get('resumeId'); // For pay-per-download

  // Plan details
  const plans = {
    'pay-per-download': {
      title: 'Paiement par CV Premium',
      price: 2.40,
      paymentType: 'single' as const,
      description: 'Parfait pour un besoin ponctuel',
      features: [
        'Accès à 1 modèle premium',
        'Modifications illimitées',
        'Téléchargements PDF illimités',
        'Pas d\'abonnement',
        'Sans inscription possible',
        '1 template CV premium = 1 paiement',
      ],
      color: theme.palette.primary.main,
      icon: Download,
    },
    'premium': {
      title: 'Premium Illimité',
      price: 24.00,
      paymentType: 'lifetime' as const,
      description: 'Pour créer tous vos CV sans limite',
      features: [
        'Tous les modèles premium',
        'Export PDF',
        'CV illimités',
        'Téléchargement de tous vos CV',
      ],
      color: theme.palette.warning.main,
      icon: WorkspacePremium,
    },
  };

  const selectedPlan = planParam && planParam in plans
    ? plans[planParam as keyof typeof plans]
    : null;

  useEffect(() => {
    // Redirect to pricing if no plan selected
    if (!selectedPlan) {
      router.push('/pricing');
    }
  }, [selectedPlan, router]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate resume ID for single CV purchase
      if (selectedPlan?.paymentType === 'single' && !resumeId) {
        setError('ID du CV manquant. Veuillez réessayer depuis la page du builder.');
        setLoading(false);
        return;
      }

      // Create checkout session with Stripe
      const response = await paymentApi.createCheckoutSession({
        payment_type: selectedPlan!.paymentType,
        resume_id: resumeId || undefined,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      });

      // Redirect to Stripe Checkout
      window.location.assign(response.checkout_url);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Une erreur est survenue lors de la création de la session de paiement'
      );
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  const PlanIcon = selectedPlan.icon;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        pt: { xs: 10, md: 12 },
        pb: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{
            mb: 4,
            textTransform: 'none',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              bgcolor: alpha('#fff', 0.1),
            },
          }}
        >
          Retour
        </Button>

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="Paiement sécurisé"
            sx={{
              mb: 2,
              bgcolor: alpha('#fff', 0.2),
              color: 'white',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Finalisez votre commande
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.9),
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            Paiement rapide et sécurisé avec Stripe
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Left Column - Payment Info */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                {/* Title */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Informations de paiement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vous serez redirigé vers Stripe pour finaliser votre paiement en toute sécurité.
                  </Typography>
                </Box>

                {/* Errors & Warnings */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {!isAuthenticated && selectedPlan.paymentType === 'lifetime' && (
                  <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Connexion requise
                    </Typography>
                    <Typography variant="body2">
                      Vous devez être connecté pour acheter l'accès Premium à vie.
                    </Typography>
                  </Alert>
                )}

                {/* Security Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Security sx={{ color: theme.palette.info.main, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                        Paiement 100% sécurisé
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vos informations de paiement sont traitées de manière sécurisée par Stripe.
                        Nous ne stockons jamais vos informations de carte bancaire.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Features Included */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    mb: 4,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                    ✓ Ce qui est inclus dans votre achat
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check
                            sx={{
                              fontSize: 22,
                              color: theme.palette.success.main,
                              fontWeight: 700,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Payment Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || (!isAuthenticated && selectedPlan.paymentType === 'lifetime')}
                  onClick={handlePayment}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Lock />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.action.disabled, 0.12),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Redirection vers Stripe...' : 'Continuer vers le paiement sécurisé'}
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    mt: 2,
                  }}
                >
                  En cliquant sur &quot;Continuer&quot;, vous acceptez nos{' '}
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    conditions de service
                  </Box>
                </Typography>
              </CardContent>
            </Paper>

            {/* Trust Badges */}
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <Chip
                icon={<VerifiedUser />}
                label="Paiement sécurisé SSL"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<CreditCard />}
                label="Stripe certifié PCI"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<Lock />}
                label="Données cryptées"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: 4,
                position: { md: 'sticky' },
                top: { md: 100 },
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              {/* Header with gradient */}
              <Box
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${selectedPlan.color} 0%, ${alpha(selectedPlan.color, 0.8)} 100%)`,
                  color: 'white',
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Récapitulatif de commande
                </Typography>
              </Box>

              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                {/* Plan Details */}
                <Box
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha(selectedPlan.color, 0.08),
                    border: `2px solid ${alpha(selectedPlan.color, 0.2)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: alpha(selectedPlan.color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlanIcon sx={{ fontSize: 28, color: selectedPlan.color }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {selectedPlan.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedPlan.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Pricing Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      Sous-total HT
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {(selectedPlan.price / 1.20).toFixed(2)}€
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      TVA 20% (incluse)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(selectedPlan.price - (selectedPlan.price / 1.20)).toFixed(2)}€
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Total */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(selectedPlan.color, 0.08),
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Total à payer
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color={selectedPlan.color}>
                    {selectedPlan.price.toFixed(2)}€
                  </Typography>
                </Box>

                {selectedPlan.paymentType === 'lifetime' && (
                  <Alert
                    severity="success"
                    icon={<WorkspacePremium />}
                    sx={{ mt: 3, borderRadius: 2 }}
                  >
                    <Typography variant="caption" fontWeight={600}>
                      Accès permanent • Aucun abonnement • Paiement unique
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    }>
      <PaymentContent />
    </Suspense>
  );
}
