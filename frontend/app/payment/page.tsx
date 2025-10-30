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
  TextField,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Check,
  CreditCard,
  Lock,
  Download,
  WorkspacePremium,
  ArrowBack,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export default function PaymentPage() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get plan from URL
  const planParam = searchParams.get('plan');
  const resumeId = searchParams.get('resumeId'); // For pay-per-download

  // Plan details
  const plans = {
    'pay-per-download': {
      title: 'Paiement par CV',
      price: 2.40,
      description: 'Export PDF de votre CV',
      features: [
        'Export PDF haute qualité',
        'Téléchargement immédiat',
        'Valable pour 1 CV',
      ],
    },
    'premium': {
      title: 'Premium',
      price: 24.00,
      description: 'Accès illimité à tous les modèles',
      features: [
        'Tous les modèles premium',
        'Export PDF illimité',
        'Téléchargement de tous vos CV',
        'Support prioritaire',
      ],
    },
  };

  const selectedPlan = planParam && planParam in plans
    ? plans[planParam as keyof typeof plans]
    : null;

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    // Redirect to pricing if no plan selected
    if (!selectedPlan) {
      router.push('/pricing');
    }
  }, [selectedPlan, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrate with Stripe or other payment provider
      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock payment success
      console.log('Payment processed:', {
        plan: planParam,
        amount: selectedPlan?.price,
        user: user?.email,
        resumeId,
      });

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        if (planParam === 'pay-per-download' && resumeId) {
          router.push(`/builder?resumeId=${resumeId}&download=true`);
        } else if (planParam === 'premium') {
          router.push('/dashboard?premium=true');
        } else {
          router.push('/builder');
        }
      }, 2000);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // Max 16 digits + 3 spaces
    }

    // Format expiry date
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }

    // Format CVV
    if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          {/* Left Column - Payment Form */}
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
                  Informations de paiement
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Toutes les transactions sont sécurisées et cryptées
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Paiement réussi ! Redirection en cours...
                  </Alert>
                )}

                <Box component="form" onSubmit={handlePayment}>
                  <TextField
                    fullWidth
                    label="Numéro de carte"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={handleInputChange('cardNumber')}
                    required
                    disabled={loading || success}
                    InputProps={{
                      startAdornment: (
                        <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Nom sur la carte"
                    placeholder="JEAN DUPONT"
                    value={cardDetails.cardName}
                    onChange={handleInputChange('cardName')}
                    required
                    disabled={loading || success}
                    sx={{ mb: 3 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Date d'expiration"
                        placeholder="MM/AA"
                        value={cardDetails.expiryDate}
                        onChange={handleInputChange('expiryDate')}
                        required
                        disabled={loading || success}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleInputChange('cvv')}
                        required
                        disabled={loading || success}
                        type="password"
                        InputProps={{
                          endAdornment: (
                            <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || success}
                    startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {loading ? 'Traitement...' : `Payer ${selectedPlan.price.toFixed(2)}€`}
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
                    🔒 Paiement 100% sécurisé par cryptage SSL
                  </Typography>
                </Box>
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
                  Récapitulatif de la commande
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

                  <List dense sx={{ py: 0 }}>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Check
                            sx={{
                              fontSize: 18,
                              color: theme.palette.success.main,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Sous-total
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedPlan.price.toFixed(2)}€
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    TVA (20%)
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {(selectedPlan.price * 0.2).toFixed(2)}€
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {(selectedPlan.price * 1.2).toFixed(2)}€
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
