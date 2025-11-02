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
              moncv.xyz
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
              <MuiLink href="/" component={Link} color="inherit" underline="hover">
                Accueil
              </MuiLink>
              <MuiLink href="/templates" component={Link} color="inherit" underline="hover">
                Templates
              </MuiLink>
              <MuiLink href="/pricing" component={Link} color="inherit" underline="hover">
                Tarifs
              </MuiLink>
              <MuiLink href="/builder" component={Link} color="inherit" underline="hover">
                Créer un CV
              </MuiLink>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Légal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/legal/terms" component={Link} color="inherit" underline="hover">
                Conditions d'utilisation
              </MuiLink>
              <MuiLink href="/legal/privacy" component={Link} color="inherit" underline="hover">
                Politique de confidentialité
              </MuiLink>
              <MuiLink href="/contact" component={Link} color="inherit" underline="hover">
                Contact
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} moncv.xyz. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
