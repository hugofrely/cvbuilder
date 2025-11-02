'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { authService } from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if we have a valid recovery token in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (accessToken && type === 'recovery') {
      setIsValidToken(true);
    } else {
      setError('Le lien de réinitialisation est invalide ou a expiré.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validatePassword = (): boolean => {
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword(formData.password);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken && !error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        py: { xs: 4, md: 8 },
        px: 2,
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
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: success
                  ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                  : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                mb: 2,
              }}
            >
              {success ? (
                <CheckCircleIcon sx={{ fontSize: 32, color: 'white' }} />
              ) : (
                <LockIcon sx={{ fontSize: 32, color: 'white' }} />
              )}
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              {success ? 'Mot de passe réinitialisé !' : 'Nouveau mot de passe'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {success
                ? 'Votre mot de passe a été mis à jour avec succès'
                : 'Choisissez un nouveau mot de passe pour votre compte'}
            </Typography>
          </Box>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Redirection vers la page de connexion...
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Reset Password Form */}
          {!success && isValidToken && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Nouveau mot de passe"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                placeholder="Minimum 6 caractères"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ mb: 3 }}
                placeholder="Confirmez votre mot de passe"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: 3,
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                    Réinitialisation en cours...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </Box>
          )}

          {/* Error state - no valid token */}
          {!isValidToken && error && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link href="/auth/forgot-password" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Demander un nouveau lien
                </Button>
              </Link>
            </Box>
          )}
        </Paper>

        {/* Back to Home Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              ← Retour à l&apos;accueil
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
