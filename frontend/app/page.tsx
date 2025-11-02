import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
} from '@mui/material';
import Link from 'next/link';
import {
  Palette,
  CloudDownload,
  CheckCircle,
  Speed,
  Security,
  Devices,
  AutoAwesome,
  EmojiEvents,
  Star,
  ArrowForward,
} from '@mui/icons-material';

// Couleurs du thème extraites pour éviter useTheme() et garder le Server Component
const themeColors = {
  primary: {
    main: '#1e3a8a',
    light: '#3b82f6',
    dark: '#1e293b',
  },
  secondary: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0284c7',
  },
  grey: {
    50: '#f9fafb',
  },
  background: {
    default: '#f9fafb',
  },
};

export default function Home() {
  const features = [
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Rapide et intuitif',
      description: 'Créez votre CV professionnel en moins de 5 minutes grâce à notre interface intuitive',
    },
    {
      icon: <Palette sx={{ fontSize: 48 }} />,
      title: 'Templates professionnels',
      description: 'Choisissez parmi une bibliothèque de modèles conçus par des experts en recrutement',
    },
    {
      icon: <CloudDownload sx={{ fontSize: 48 }} />,
      title: 'Export multi-formats',
      description: 'Téléchargez votre CV en PDF, Google Docs, Word ou OpenOffice en un clic',
    },
    {
      icon: <CheckCircle sx={{ fontSize: 48 }} />,
      title: 'Sans inscription',
      description: 'Commencez immédiatement sans créer de compte, votre temps est précieux',
    },
    {
      icon: <Devices sx={{ fontSize: 48 }} />,
      title: 'Responsive design',
      description: 'Travaillez sur votre CV depuis n\'importe quel appareil, mobile, tablette ou desktop',
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Données sécurisées',
      description: 'Vos informations personnelles sont protégées et stockées de manière sécurisée',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Remplissez vos informations',
      description: 'Entrez vos données personnelles, expériences, formations et compétences',
    },
    {
      number: '02',
      title: 'Choisissez un template',
      description: 'Sélectionnez le design qui correspond le mieux à votre profil professionnel',
    },
    {
      number: '03',
      title: 'Prévisualisez en temps réel',
      description: 'Visualisez instantanément les modifications apportées à votre CV',
    },
    {
      number: '04',
      title: 'Téléchargez votre CV',
      description: 'Exportez votre CV au format souhaité et postulez à vos emplois de rêve',
    },
  ];

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Développeuse Full-Stack',
      avatar: 'SM',
      rating: 5,
      comment: 'Interface très intuitive ! J\'ai créé mon CV en 10 minutes et j\'ai décroché 3 entretiens la semaine suivante.',
    },
    {
      name: 'Thomas Dubois',
      role: 'Chef de projet',
      avatar: 'TD',
      rating: 5,
      comment: 'Les templates sont vraiment professionnels. Le rendu PDF est parfait, exactement ce que je cherchais.',
    },
    {
      name: 'Marie Lefèvre',
      role: 'Designer UX/UI',
      avatar: 'ML',
      rating: 5,
      comment: 'Excellent service ! La prévisualisation en temps réel est un vrai plus. Je recommande vivement.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'CV créés' },
    { number: '95%', label: 'Taux de satisfaction' },
    { number: '24/7', label: 'Disponibilité' },
    { number: '15+', label: 'Templates premium' },
  ];

  return (
    <Box component="main" id="main-content">
      {/* Skip to main content link for keyboard navigation - WCAG 2.4.1 */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1rem',
          backgroundColor: 'primary.main',
          color: 'white',
          textDecoration: 'none',
          '&:focus': {
            left: '50%',
            top: '1rem',
            transform: 'translateX(-50%)',
          },
        }}
      >
        Aller au contenu principal
      </Box>

      {/* Hero Section avec dégradé */}
      <Box
        component="section"
        aria-labelledby="hero-title"
        sx={{
          background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.secondary.main} 100%)`,
          color: 'white',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="overline"
                  component="p"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    gap: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  <AutoAwesome aria-hidden="true" /> Créateur de CV professionnel
                </Typography>
                <Typography
                  variant="h1"
                  component="h1"
                  id="hero-title"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  Créez votre CV professionnel en{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #ffffff 0%, #f0f0f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: 'none',
                    }}
                  >
                    5 minutes
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    fontWeight: 400,
                    opacity: 0.98,
                    lineHeight: 1.6,
                    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                >
                  Simple, rapide et professionnel. Aucune inscription requise pour commencer.
                  Choisissez parmi nos templates modernes et démarquez-vous.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                >
                  <Link href="/builder" style={{ textDecoration: 'none' }} tabIndex={-1}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward aria-hidden="true" />}
                      aria-label="Commencer à créer votre CV gratuitement"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        minHeight: 56,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                        },
                        '&:focus-visible': {
                          outline: '3px solid',
                          outlineColor: 'primary.dark',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      Créer mon CV gratuitement
                    </Button>
                  </Link>
                  <Link href="/templates" style={{ textDecoration: 'none' }} tabIndex={-1}>
                    <Button
                      variant="outlined"
                      size="large"
                      aria-label="Découvrir les modèles de CV disponibles"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        minHeight: 56,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)',
                        },
                        '&:focus-visible': {
                          outline: '3px solid white',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      Voir les templates
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '110%',
                      height: '110%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      borderRadius: 4,
                      zIndex: 0,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/2-moderne.png"
                    alt="Exemple de CV professionnel moderne"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      border: '3px solid rgba(255,255,255,0.3)',
                      position: 'relative',
                      zIndex: 1,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        component="section"
        aria-label="Statistiques de moncv.xyz"
        role="region"
        sx={{
          bgcolor: 'white',
          py: 6,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    component="p"
                    sx={{
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        component="section"
        aria-labelledby="features-title"
        role="region"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${themeColors.background.default} 0%, ${themeColors.grey[50]} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              id="features-title"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
              }}
            >
              Pourquoi choisir moncv.xyz ?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Des fonctionnalités pensées pour vous faire gagner du temps et créer le CV parfait
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: 'white',
                      }}
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 1.5 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works Section */}
      <Box
        component="section"
        aria-labelledby="how-it-works-title"
        role="region"
        sx={{
          py: { xs: 8, md: 12 },
          background: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              id="how-it-works-title"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
              }}
            >
              Comment ça marche ?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Créez votre CV professionnel en 4 étapes simples
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    position: 'relative',
                    '&::after':
                      index < steps.length - 1
                        ? {
                            content: '""',
                            position: 'absolute',
                            top: 60,
                            right: { xs: '50%', md: -20 },
                            width: { xs: 2, md: 40 },
                            height: { xs: 40, md: 2 },
                            background: `linear-gradient(${
                              index % 2 === 0 ? '90deg' : '270deg'
                            }, ${themeColors.primary.main} 0%, ${themeColors.secondary.main} 100%)`,
                            opacity: 0.3,
                            display: { xs: 'none', md: 'block' },
                          }
                        : {},
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${themeColors.primary.main} 0%, ${themeColors.primary.light} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 3,
                      position: 'relative',
                      boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)',
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '2.5rem',
                      }}
                      aria-label={`Étape ${step.number}`}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 1.5 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        component="section"
        aria-labelledby="testimonials-title"
        role="region"
        aria-label="Témoignages d'utilisateurs"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${themeColors.grey[50]} 0%, ${themeColors.background.default} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              id="testimonials-title"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
              }}
            >
              Ce que disent nos utilisateurs
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}
            >
              Rejoignez des milliers d&apos;utilisateurs satisfaits
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  component="article"
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                    background: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{ display: 'flex', gap: 0.5 }}
                        role="img"
                        aria-label={`Note: ${testimonial.rating} sur 5 étoiles`}
                      >
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: '#FFA500', fontSize: 20 }} aria-hidden="true" />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: 'italic',
                          color: 'text.secondary',
                          lineHeight: 1.8,
                          mb: 2,
                        }}
                      >
                        &ldquo;{testimonial.comment}&rdquo;
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                            fontWeight: 600,
                          }}
                          aria-label={`Photo de profil de ${testimonial.name}`}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section avec dégradé */}
      <Box
        component="section"
        aria-labelledby="cta-title"
        role="region"
        aria-label="Appel à l'action"
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${themeColors.primary.dark} 0%, ${themeColors.primary.main} 50%, ${themeColors.secondary.main} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <EmojiEvents sx={{ fontSize: 80, mb: 3, opacity: 0.9 }} aria-hidden="true" />
            <Typography
              variant="h2"
              component="h2"
              id="cta-title"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.8rem' },
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              Prêt à créer votre CV professionnel ?
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mb: 5,
                opacity: 0.98,
                fontWeight: 400,
                lineHeight: 1.7,
                textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              }}
            >
              Rejoignez plus de 10,000 utilisateurs qui ont déjà créé leur CV avec moncv.xyz.
              Commencez gratuitement dès maintenant, aucune carte de crédit requise.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Link href="/builder" style={{ textDecoration: 'none' }} tabIndex={-1}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward aria-hidden="true" />}
                  aria-label="Commencer à créer votre CV maintenant"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    minHeight: 56,
                    px: 5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                    },
                    '&:focus-visible': {
                      outline: '3px solid',
                      outlineColor: 'primary.dark',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Créer mon CV maintenant
                </Button>
              </Link>
              <Link href="/templates" style={{ textDecoration: 'none' }} tabIndex={-1}>
                <Button
                  variant="outlined"
                  size="large"
                  aria-label="Explorer tous les modèles disponibles"
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderWidth: 2,
                    minHeight: 56,
                    px: 5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                    },
                    '&:focus-visible': {
                      outline: '3px solid white',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Explorer les templates
                </Button>
              </Link>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
