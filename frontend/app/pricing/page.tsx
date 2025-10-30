'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Check,
  Download,
  Palette,
  Star,
  WorkspacePremium,
  CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export default function PricingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handlePayPerDownload = () => {
    if (!isAuthenticated) {
      router.push('/auth/register?returnTo=/pricing&plan=pay-per-download');
    } else {
      // Redirect to payment for pay-per-download
      router.push('/payment?plan=pay-per-download');
    }
  };

  const handlePremium = () => {
    if (!isAuthenticated) {
      router.push('/auth/register?returnTo=/pricing&plan=premium');
    } else {
      // Redirect to payment for premium
      router.push('/payment?plan=premium');
    }
  };

  const pricingPlans = [
    {
      id: 'free',
      title: 'Gratuit',
      price: '0',
      period: 'toujours gratuit',
      description: 'Pour démarrer rapidement',
      color: theme.palette.success.main,
      features: [
        'Accès aux modèles gratuits',
        'Export PDF gratuit',
        'Sans inscription',
        'Téléchargement illimité des modèles gratuits',
        'Création de CV illimitée',
      ],
      cta: 'Commencer gratuitement',
      onAction: () => router.push('/builder'),
      popular: false,
      isFree: true,
    },
    {
      id: 'pay-per-download',
      title: 'Paiement par CV Premium',
      price: '2,40',
      period: 'par CV premium exporté',
      description: 'Parfait pour un besoin ponctuel',
      color: theme.palette.primary.main,
      features: [
        'Accès à 1 modèle premium',
        'Export PDF haute qualité',
        'Téléchargement immédiat',
        'Pas d\'abonnement',
        'Sans inscription possible',
        '1 CV premium = 1 paiement',
      ],
      cta: 'Choisir un modèle premium',
      onAction: handlePayPerDownload,
      popular: false,
      isFree: false,
    },
    {
      id: 'premium',
      title: 'Premium Illimité',
      price: '24',
      period: 'accès illimité',
      description: 'Pour créer tous vos CV sans limite',
      color: theme.palette.warning.main,
      features: [
        'Tous les modèles premium',
        'Export PDF illimité',
        'Créez autant de CV que vous voulez',
        'Téléchargement de tous vos CV',
        'Stockage sécurisé',
        'Support prioritaire',
      ],
      cta: 'Devenir Premium',
      onAction: handlePremium,
      popular: true,
      isFree: false,
    },
  ];

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
        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Chip
            label="Tarifs"
            color="primary"
            variant="outlined"
            sx={{
              mb: 3,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choisissez votre formule
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.125rem' },
            }}
          >
            Commencez gratuitement ou choisissez la formule qui vous convient. Modèles gratuits sans limite ou accès premium selon vos besoins.
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {pricingPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                elevation={plan.popular ? 12 : 2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: 4,
                  border: plan.popular
                    ? `2px solid ${plan.color}`
                    : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease-in-out',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: plan.popular ? 16 : 8,
                  },
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: plan.color,
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      boxShadow: 4,
                    }}
                  >
                    <Star sx={{ fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={700}>
                      Le plus populaire
                    </Typography>
                  </Box>
                )}

                <CardContent
                  sx={{
                    flex: 1,
                    pt: plan.popular ? 6 : 4,
                    pb: 2,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 3,
                      bgcolor: alpha(plan.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {plan.id === 'premium' ? (
                      <WorkspacePremium sx={{ fontSize: 32, color: plan.color }} />
                    ) : plan.id === 'free' ? (
                      <CheckCircle sx={{ fontSize: 32, color: plan.color }} />
                    ) : (
                      <Download sx={{ fontSize: 32, color: plan.color }} />
                    )}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h5"
                    component="h3"
                    fontWeight={700}
                    gutterBottom
                  >
                    {plan.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {plan.description}
                  </Typography>

                  {/* Price */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography
                        variant="h3"
                        component="span"
                        fontWeight={800}
                        color={plan.color}
                      >
                        {plan.price}€
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <List sx={{ py: 0 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Check
                            sx={{
                              color: plan.color,
                              fontSize: 20,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.primary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                {/* CTA Button */}
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    size="large"
                    fullWidth
                    onClick={plan.onAction}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      ...(plan.popular
                        ? {
                            bgcolor: plan.color,
                            '&:hover': {
                              bgcolor: alpha(plan.color, 0.9),
                            },
                          }
                        : {
                            borderColor: plan.color,
                            color: plan.color,
                            '&:hover': {
                              borderColor: alpha(plan.color, 0.9),
                              bgcolor: alpha(plan.color, 0.05),
                            },
                          }),
                    }}
                  >
                    {plan.cta}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            🔒 Paiement sécurisé • 💳 Sans engagement • ✅ Satisfaction garantie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Besoin d'aide pour choisir ? Contactez-nous à{' '}
            <Box
              component="a"
              href="mailto:support@cvbuilder.com"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              support@cvbuilder.com
            </Box>
          </Typography>
        </Box>

        {/* Features Comparison */}
        <Box
          sx={{
            mt: 10,
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Pourquoi choisir nos formules ?
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Palette sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Modèles professionnels
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Des templates conçus par des experts RH pour maximiser vos chances
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Download sx={{ fontSize: 40, color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Export haute qualité
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF optimisé pour l'impression et l'envoi par email
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <WorkspacePremium
                    sx={{ fontSize: 40, color: theme.palette.warning.main }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Sans engagement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Payez uniquement ce dont vous avez besoin, quand vous en avez besoin
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
