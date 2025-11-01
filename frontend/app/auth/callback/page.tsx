'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/api/auth';
import { migrateAnonymousResume } from '@/lib/utils/resumeMigration';

export default function AuthCallbackPage() {
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
        console.log('Starting OAuth callback...');

        // Get tokens from URL params (sent by backend after OAuth)
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');
        const errorParam = searchParams.get('error');

        console.log('Tokens received:', { hasAccess: !!access, hasRefresh: !!refresh, error: errorParam });

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (access && refresh) {
          console.log('Storing tokens...');
          // Store the tokens
          authService.setTokens({ access, refresh });

          console.log('Loading user data...');
          // Refresh user data
          await refreshUser();

          console.log('User loaded successfully');

          // Migrate anonymous resume data after successful OAuth login
          await migrateAnonymousResume();

          // Wait a bit to ensure user is set in context
          await new Promise(resolve => setTimeout(resolve, 500));

          setStatus('success');
          setMessage('Connexion réussie ! Redirection...');

          // Redirect to builder page
          setTimeout(() => {
            console.log('Redirecting to /builder');
            router.push('/builder');
          }, 1000);
        } else {
          throw new Error('Aucun token reçu');
        }
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
              <Error
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
