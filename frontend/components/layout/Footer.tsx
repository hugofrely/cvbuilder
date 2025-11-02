'use client';

import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.50',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" color="primary.light" gutterBottom sx={{ fontWeight: 700 }}>
              moncv.xyz
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.300', lineHeight: 1.7 }}>
              Créez votre CV professionnel en quelques minutes.
              Simple, rapide, et efficace.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: 'grey.50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Liens Rapides
            </Typography>
            <Box component="nav" aria-label="Liens rapides" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink
                href="/"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Accueil
              </MuiLink>
              <MuiLink
                href="/templates"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Templates
              </MuiLink>
              <MuiLink
                href="/pricing"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Tarifs
              </MuiLink>
              <MuiLink
                href="/builder"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Créer un CV
              </MuiLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                color: 'grey.50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Légal
            </Typography>
            <Box component="nav" aria-label="Liens légaux" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink
                href="/legal/terms"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Conditions d'utilisation
              </MuiLink>
              <MuiLink
                href="/legal/privacy"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Politique de confidentialité
              </MuiLink>
              <MuiLink
                href="/contact"
                component={Link}
                underline="hover"
                sx={{
                  color: 'grey.300',
                  '&:hover': {
                    color: 'primary.light',
                  },
                  minHeight: 24,
                  display: 'inline-block',
                }}
              >
                Contact
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'grey.700' }}>
          <Typography variant="body2" sx={{ color: 'grey.400' }} align="center">
            © {new Date().getFullYear()} moncv.xyz. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
