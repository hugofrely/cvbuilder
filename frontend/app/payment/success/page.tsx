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
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Home,
  HourglassEmpty,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackPaymentSuccess } from '@/lib/analytics';

function PaymentSuccessContent() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'succeeded' | 'failed'>('pending');
  const [statusMessage, setStatusMessage] = useState('Vérification du paiement...');

  const sessionId = searchParams.get('session_id');
  const resumeId = searchParams.get('resumeId');

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setPaymentStatus('failed');
      setStatusMessage('Session de paiement introuvable');
      return;
    }

    let pollCount = 0;
    const maxPolls = 30; // 30 attempts = 30 seconds max
    const pollInterval = 1000; // Poll every 1 second

    const checkPaymentStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const params = new URLSearchParams({ session_id: sessionId });
        if (resumeId) {
          params.append('resume_id', resumeId);
        }

        const response = await fetch(`${apiUrl}/api/payments/check-status?${params.toString()}`);
        const data = await response.json();

        if (data.status === 'succeeded') {
          // Payment confirmed!
          setPaymentStatus('succeeded');
          setStatusMessage('Paiement confirmé avec succès');
          setLoading(false);

          // Track payment success event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            trackPaymentSuccess(data.amount || 0);
          }

          return true; // Stop polling
        } else if (data.status === 'failed') {
          setPaymentStatus('failed');
          setStatusMessage('Le paiement a échoué');
          setLoading(false);
          return true; // Stop polling
        } else {
          // Still processing
          setPaymentStatus('processing');
          setStatusMessage('Validation du paiement en cours... (moins d\'une minute)');
          return false; // Continue polling
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        if (pollCount >= maxPolls) {
          setPaymentStatus('failed');
          setStatusMessage('Impossible de vérifier le statut du paiement');
          setLoading(false);
          return true; // Stop polling
        }
        return false; // Continue polling
      }
    };

    // Initial check
    checkPaymentStatus();

    // Set up polling
    const intervalId = setInterval(async () => {
      pollCount++;
      const shouldStop = await checkPaymentStatus();

      if (shouldStop || pollCount >= maxPolls) {
        clearInterval(intervalId);
        if (pollCount >= maxPolls && paymentStatus !== 'succeeded') {
          setPaymentStatus('processing');
          setStatusMessage('La validation prend plus de temps que prévu. Votre paiement sera confirmé sous peu.');
          setLoading(false);
        }
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [sessionId, resumeId, paymentStatus]);

  // Processing state - show validation message
  if (loading || paymentStatus === 'processing') {
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
              <HourglassEmpty
                sx={{
                  fontSize: 80,
                  color: theme.palette.warning.main,
                  mb: 3,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />

              <Typography variant="h4" fontWeight={700} gutterBottom>
                Validation en cours
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {statusMessage}
              </Typography>

              <LinearProgress
                sx={{
                  mb: 3,
                  borderRadius: 1,
                  height: 6,
                }}
              />

              <Typography variant="caption" color="text.secondary">
                Veuillez patienter, ne fermez pas cette page
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Failed state
  if (paymentStatus === 'failed') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(180deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
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
              border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <ErrorIcon
                sx={{
                  fontSize: 80,
                  color: theme.palette.error.main,
                  mb: 3,
                }}
              />

              <Typography variant="h4" fontWeight={700} gutterBottom>
                Erreur de paiement
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {statusMessage}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/pricing')}
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

  // Success state
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
              Votre paiement a été confirmé avec succès. Vous pouvez maintenant télécharger votre CV.
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
                onClick={() => {
                  if (resumeId) {
                    router.push(`/builder?resumeId=${resumeId}`);
                  } else {
                    router.push('/builder');
                  }
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Retourner à l&apos;édition du CV
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
