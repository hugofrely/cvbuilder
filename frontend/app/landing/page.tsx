import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import {
  Speed,
  CheckCircle,
  CloudDownload,
  ArrowForward,
  Star,
} from '@mui/icons-material';
import type { Metadata } from 'next';

// Métadonnées optimisées pour Google Ads
export const metadata: Metadata = {
  title: 'Créer un CV Gratuit en 5 Minutes | Sans Inscription - uncvpro.fr',
  description:
    'Créez votre CV professionnel gratuitement en ligne. Plus de 15 modèles modernes. Téléchargement PDF gratuit. Sans inscription. Commencez maintenant !',
  robots: {
    index: true,
    follow: true,
  },
};

const themeColors = {
  primary: {
    main: '#1e3a8a',
    light: '#3b82f6',
  },
  secondary: {
    main: '#0ea5e9',
  },
};

export default function LandingPage() {
  const benefits = [
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: '100% Gratuit',
      description: 'Créez et téléchargez votre CV gratuitement, sans frais cachés',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      title: 'Sans Inscription',
      description: 'Commencez immédiatement, aucun compte requis',
    },
    {
      icon: <CloudDownload sx={{ fontSize: 40 }} />,
      title: 'Export PDF Gratuit',
      description: 'Téléchargez votre CV en PDF de haute qualité',
    },
  ];

  const steps = [
    '1. Choisissez un modèle professionnel',
    '2. Remplissez vos informations',
    '3. Téléchargez votre CV en PDF',
  ];

  return (
    <Box component="main">
      {/* Hero Section - Optimisé pour la conversion */}
      <Box
        component="section"
        sx={{
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              mb: 3,
            }}
          >
            Créez Votre CV Professionnel Gratuitement
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              opacity: 0.95,
            }}
          >
            Plus de 15 modèles modernes • Sans inscription • Téléchargement PDF gratuit
          </Typography>

          {/* CTA Principal */}
          <Link href="/builder" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 700,
                py: 2,
                px: 6,
                mb: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Créer mon CV Gratuit
            </Button>
          </Link>

          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            ✓ Aucune carte bancaire requise • ✓ Téléchargement immédiat
          </Typography>
        </Container>
      </Box>

      {/* Social Proof */}
      <Box sx={{ bgcolor: 'white', py: 4, borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                10,000+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CV créés
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" spacing={0.5} justifyContent="center" mb={0.5}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} sx={{ color: '#FFA500', fontSize: 20 }} />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                4.9/5 - 500+ avis
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                5 min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temps moyen
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Bénéfices clés */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, mb: 6 }}
          >
            Pourquoi choisir uncvpro.fr ?
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 3,
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Comment ça marche */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'white' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, mb: 6 }}
          >
            En 3 étapes simples
          </Typography>
          <Stack spacing={3}>
            {steps.map((step, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {step}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.secondary.main} 100%)`,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 800,
              mb: 3,
            }}
          >
            Prêt à créer votre CV professionnel ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Rejoignez plus de 10,000 utilisateurs satisfaits
          </Typography>
          <Link href="/builder" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 700,
                py: 2,
                px: 6,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Commencer Maintenant - C&apos;est Gratuit
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  );
}
