'use client';

import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              CV Builder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Créez votre CV professionnel en quelques minutes.
              Simple, rapide, et efficace.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Liens Rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Accueil
                </MuiLink>
              </Link>
              <Link href="/templates" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Templates
                </MuiLink>
              </Link>
              <Link href="/pricing" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Tarifs
                </MuiLink>
              </Link>
              <Link href="/builder" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Créer un CV
                </MuiLink>
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Légal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/legal/terms" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Conditions d'utilisation
                </MuiLink>
              </Link>
              <Link href="/legal/privacy" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Politique de confidentialité
                </MuiLink>
              </Link>
              <Link href="/contact" passHref legacyBehavior>
                <MuiLink color="inherit" underline="hover">
                  Contact
                </MuiLink>
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} CV Builder. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
