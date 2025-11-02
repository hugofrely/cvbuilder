'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/api/auth';
import { migrateAnonymousResume } from '@/lib/utils/resumeMigration';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentification en cours...');

  useEffect(() => {
    let isProcessed = false;

    const handleCallback = async () => {
      // Prevent processing multiple times
      if (isProcessed) return;
      isProcessed = true;

      try {
        console.log('Starting Supabase OAuth callback...');

        // Check for error in URL params
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }

        // Supabase handles the session automatically via the auth listener
        // We just need to wait for the session to be established
        console.log('Waiting for Supabase session...');

        // Wait for session to be established (max 5 seconds)
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          const session = await authService.getSession();

          if (session) {
            console.log('Session established, loading user data...');

            // Refresh user data
            await refreshUser();

            console.log('User loaded successfully');

            // Migrate anonymous resume data after successful OAuth login
            await migrateAnonymousResume();

            setStatus('success');
            setMessage('Connexion réussie ! Redirection...');

            // Redirect to builder page
            setTimeout(() => {
              console.log('Redirecting to /builder');
              router.push('/builder');
            }, 1000);

            return;
          }

          // Wait 500ms before trying again
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }

        // If we get here, session was not established
        throw new Error('Timeout: Session not established');

      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Échec de l\'authentification. Veuillez réessayer.');

        // Redirect to login after error
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}
        >
          {status === 'loading' && (
            <Box>
              <CircularProgress
                size={64}
                thickness={4}
                sx={{
                  mb: 3,
                  color: 'primary.main',
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {message}
              </Typography>
            </Box>
          )}

          {status === 'success' && (
            <Box>
              <CheckCircle
                sx={{
                  fontSize: 64,
                  color: 'success.main',
                  mb: 3,
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 600, color: 'text.primary' }}
              >
                {message}
              </Typography>
            </Box>
          )}

          {status === 'error' && (
            <Box>
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                  mb: 3,
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
              >
                {message}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirection vers la page de connexion...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
        }}
      >
        <CircularProgress size={64} sx={{ color: 'white' }} />
      </Box>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
