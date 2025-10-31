'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Cancel,
  ArrowBack,
  Home,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          }}
        >
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            <Cancel
              sx={{
                fontSize: 80,
                color: theme.palette.warning.main,
                mb: 3,
              }}
            />

            <Typography variant="h4" fontWeight={700} gutterBottom>
              Paiement annulé
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Votre paiement a été annulé. Aucun montant n&apos;a été débité.
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Si vous avez rencontré un problème, n&apos;hésitez pas à nous contacter.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => router.back()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Réessayer
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Home />}
                onClick={() => router.push('/')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Accueil
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
