'use client';

import { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Home,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentSuccessContent() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate verification (in production, verify with backend)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
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
        background: `linear-gradient(180deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
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
            border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
          }}
        >
          <CardContent sx={{ p: 5, textAlign: 'center' }}>
            <CheckCircle
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 3,
              }}
            />

            <Typography variant="h4" fontWeight={700} gutterBottom>
              Paiement réussi !
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Votre paiement a été traité avec succès. Vous pouvez maintenant profiter de votre accès.
            </Typography>

            {sessionId && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mb: 4,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                }}
              >
                ID de transaction : {sessionId}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={() => router.push('/builder')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Accéder au Builder
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
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
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
