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
  Divider,
} from '@mui/material';
import {
  Check,
  Download,
  WorkspacePremium,
  CheckCircle,
  Star,
  Palette,
  Security,
  Speed,
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
      router.push('/payment?plan=pay-per-download');
    }
  };

  const handlePremium = () => {
    if (!isAuthenticated) {
      router.push('/auth/register?returnTo=/pricing&plan=premium');
    } else {
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
        'Téléchargement illimité',
        'Création de CV illimitée',
      ],
      cta: 'Commencer gratuitement',
      onAction: () => router.push('/builder'),
      popular: false,
      icon: CheckCircle,
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
      icon: Download,
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
        'CV illimités',
        'Téléchargement de tous vos CV',
        'Stockage sécurisé',
        'Support prioritaire',
      ],
      cta: 'Devenir Premium',
      onAction: handlePremium,
      popular: true,
      icon: WorkspacePremium,
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
        <Box sx={{ textAlign: 'center', mb: 10 }}>
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
              lineHeight: 1.6,
            }}
          >
            Commencez gratuitement ou choisissez la formule qui vous convient.
            <br />
            Modèles gratuits sans limite ou accès premium selon vos besoins.
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 10 }}>
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                <Card
                  elevation={plan.popular ? 12 : 2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'visible',
                    border: plan.popular
                      ? `3px solid ${plan.color}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: plan.popular ? 'scale(1.08)' : 'scale(1.03)',
                      boxShadow: plan.popular ? 16 : 8,
                    },
                  }}
                >
                  {/* Popular Badge - IMPROVED VISIBILITY */}
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: plan.color,
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        boxShadow: `0 8px 24px ${alpha(plan.color, 0.4)}`,
                        zIndex: 10,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      <Star sx={{ fontSize: 20 }} />
                      Le plus populaire
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      pt: plan.popular ? 7 : 4,
                      pb: 3,
                      px: 3,
                      textAlign: 'center',
                    }}
                  >
                    {/* Icon - CENTERED */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(plan.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Icon sx={{ fontSize: 40, color: plan.color }} />
                    </Box>

                    {/* Title - CENTERED */}
                    <Typography
                      variant="h5"
                      component="h3"
                      fontWeight={700}
                      gutterBottom
                      sx={{ textAlign: 'center' }}
                    >
                      {plan.title}
                    </Typography>

                    {/* Description - CENTERED */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, textAlign: 'center', minHeight: 40 }}
                    >
                      {plan.description}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    {/* Price - CENTERED */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'center',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="h2"
                          component="span"
                          fontWeight={800}
                          color={plan.color}
                          sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }}
                        >
                          {plan.price}€
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center' }}
                      >
                        {plan.period}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Features - LEFT ALIGNED for readability */}
                    <List sx={{ py: 0, flex: 1 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Check
                              sx={{
                                color: plan.color,
                                fontSize: 20,
                                fontWeight: 700,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: 'text.primary',
                              fontWeight: 500,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  {/* CTA Button - CENTERED */}
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant={plan.popular ? 'contained' : 'outlined'}
                      size="large"
                      fullWidth
                      onClick={plan.onAction}
                      sx={{
                        py: 1.75,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: plan.popular ? 3 : 0,
                        ...(plan.popular
                          ? {
                              bgcolor: plan.color,
                              color: 'white',
                              '&:hover': {
                                bgcolor: alpha(plan.color, 0.9),
                                boxShadow: 6,
                                transform: 'translateY(-2px)',
                              },
                            }
                          : {
                              borderWidth: 2,
                              borderColor: plan.color,
                              color: plan.color,
                              '&:hover': {
                                borderWidth: 2,
                                borderColor: plan.color,
                                bgcolor: alpha(plan.color, 0.08),
                                transform: 'translateY(-2px)',
                              },
                            }),
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Info - CENTERED */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            🔒 Paiement sécurisé • 💳 Sans engagement • ✅ Satisfaction garantie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Besoin d'aide pour choisir ?{' '}
            <Box
              component="a"
              href="mailto:support@cvbuilder.com"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 700,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Contactez-nous
            </Box>
          </Typography>
        </Box>

        {/* Features Comparison - ALL CENTERED */}
        <Box sx={{ mt: 10, mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Pourquoi choisir nos formules ?
          </Typography>

          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  }}
                >
                  <Palette sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Modèles professionnels
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  Des templates conçus par des experts RH pour maximiser vos chances
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.success.main, 0.15),
                    },
                  }}
                >
                  <Speed sx={{ fontSize: 50, color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Rapide et simple
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  Créez votre CV professionnel en moins de 5 minutes chrono
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.warning.main, 0.15),
                    },
                  }}
                >
                  <Security sx={{ fontSize: 50, color: theme.palette.warning.main }} />
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Sécurisé et fiable
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  Vos données sont protégées et stockées de manière sécurisée
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
