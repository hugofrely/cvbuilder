'use client';

import React, { useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import OAuthButtons from '@/components/auth/OAuthButtons';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Email ou mot de passe invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
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
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                mb: 2,
              }}
            >
              <LoginIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Connexion
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connectez-vous pour accéder à vos CV
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* OAuth Buttons */}
          <Box sx={{ mb: 3 }}>
            <OAuthButtons mode="login" />
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Ou continuez avec votre email
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Adresse email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              placeholder="votre@email.com"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              placeholder="Votre mot de passe"
            />

            {/* Remember Me & Forgot Password */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    Se souvenir de moi
                  </Typography>
                }
              />
              <Link href="#" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Mot de passe oublié ?
                </Typography>
              </Link>
            </Box>

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
                background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
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
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Vous n&apos;avez pas de compte ?{' '}
                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Créer un compte
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
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
