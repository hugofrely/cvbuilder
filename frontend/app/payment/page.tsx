'use client';

import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Check,
  Lock,
  Download,
  WorkspacePremium,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { paymentApi } from '@/lib/api/payment';

export default function PaymentPage() {
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
      title: 'Paiement par CV',
      price: 2.40,
      paymentType: 'single' as const,
      description: 'Export PDF de votre CV premium',
      features: [
        'Export PDF haute qualité',
        'Téléchargement immédiat',
        'Valable pour 1 CV premium',
      ],
    },
    'premium': {
      title: 'Premium à Vie',
      price: 24.00,
      paymentType: 'lifetime' as const,
      description: 'Accès illimité permanent à tous les modèles',
      features: [
        'Tous les modèles premium',
        'Export PDF illimité',
        'Créez autant de CV que vous voulez',
        'Accès à vie (paiement unique)',
        'Support prioritaire',
      ],
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
        resume_id: resumeId ? parseInt(resumeId) : undefined,
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
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        pt: 12,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{
            mb: 4,
            textTransform: 'none',
            color: 'text.secondary',
          }}
        >
          Retour
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Payment Info */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Paiement sécurisé avec Stripe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Vous serez redirigé vers Stripe pour finaliser votre paiement en toute sécurité.
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {!isAuthenticated && selectedPlan.paymentType === 'lifetime' && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    Vous devez être connecté pour acheter l'accès Premium à vie.
                  </Alert>
                )}

                {/* Payment Info */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    🔒 Paiement 100% sécurisé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vos informations de paiement sont traitées de manière sécurisée par Stripe.
                    Nous ne stockons jamais vos informations de carte bancaire.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    mb: 4,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    ✓ Ce qui est inclus
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check sx={{ fontSize: 20, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          slotProps={{
                            primary: {
                              variant: 'body2',
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading || (!isAuthenticated && selectedPlan.paymentType === 'lifetime')}
                  onClick={handlePayment}
                  startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Redirection vers Stripe...' : 'Continuer vers le paiement'}
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
                  En cliquant sur &quot;Continuer&quot;, vous acceptez nos conditions de service
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                position: 'sticky',
                top: 100,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Récapitulatif
                </Typography>

                <Box
                  sx={{
                    my: 3,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {planParam === 'premium' ? (
                      <WorkspacePremium
                        sx={{ fontSize: 32, color: theme.palette.warning.main, mr: 2 }}
                      />
                    ) : (
                      <Download
                        sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }}
                      />
                    )}
                    <Box>
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Paiement unique
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPlan.price.toFixed(2)}€
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {selectedPlan.price.toFixed(2)}€
                  </Typography>
                </Box>

                {selectedPlan.paymentType === 'lifetime' && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                  >
                    Accès permanent • Aucun abonnement
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
