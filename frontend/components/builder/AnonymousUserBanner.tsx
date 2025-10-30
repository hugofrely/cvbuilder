'use client';

import { useState, useEffect } from 'react';
import { Box, Button, IconButton, Paper, Typography, alpha, useTheme, useMediaQuery, Slide } from '@mui/material';
import { Close, Login, PersonAdd, CloudUpload } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/useAuthStore';

/**
 * Banner to encourage anonymous users to sign up or log in
 * to save their CV permanently
 */
export default function AnonymousUserBanner() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const isDismissed = sessionStorage.getItem('anonymous_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show if user is authenticated or has dismissed
  if (isAuthenticated || dismissed) {
    return null;
  }

  const handleSignup = () => {
    router.push('/auth/register');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleDismiss = () => {
    setShow(false);
    setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem('anonymous_banner_dismissed', 'true');
    }, 300);
  };

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1200,
          maxWidth: { xs: '100%', sm: 600, md: 700 },
          mx: 'auto',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            position: 'relative',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)} 0%, ${alpha(theme.palette.primary.dark, 0.95)} 100%)`,
            color: 'white',
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            backdropFilter: 'blur(20px)',
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.3)}`,
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          }}
        >
          {/* Close button */}
          <IconButton
            size="small"
            onClick={handleDismiss}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.common.white, 0.15),
                flexShrink: 0,
              }}
            >
              <CloudUpload sx={{ fontSize: 28, color: 'white' }} />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pr: { xs: 4, sm: 0 } }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                Sauvegardez votre CV en ligne
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.95,
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  lineHeight: 1.5,
                }}
              >
                Créez un compte pour sauvegarder votre CV et y accéder depuis n'importe quel appareil
              </Typography>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexShrink: 0,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                variant="outlined"
                size={isMobile ? 'medium' : 'medium'}
                startIcon={isMobile ? undefined : <Login />}
                onClick={handleLogin}
                sx={{
                  flex: { xs: 1, sm: 'initial' },
                  color: 'white',
                  borderColor: alpha(theme.palette.common.white, 0.4),
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: { xs: 2, sm: 2.5 },
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                Connexion
              </Button>
              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'medium'}
                startIcon={isMobile ? undefined : <PersonAdd />}
                onClick={handleSignup}
                sx={{
                  flex: { xs: 1, sm: 'initial' },
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2,
                  px: { xs: 2, sm: 2.5 },
                  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.common.white, 0.95),
                    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.25)}`,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Inscription
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
}
