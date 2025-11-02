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
  Divider,
  CircularProgress,
  Grid,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import OAuthButtons from '@/components/auth/OAuthButtons';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      // Generate username from email (before @)
      const username = formData.email.split('@')[0];
      await register({
        ...formData,
        username,
      });
      router.push('/builder');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
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
          background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
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
              <PersonAdd sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Créer un compte
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Rejoignez moncv.xyz et créez votre CV professionnel
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
            <OAuthButtons mode="register" />
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Ou créez un compte avec votre email
            </Typography>
          </Divider>

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="first_name"
                  name="first_name"
                  label="Prénom"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jean"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="last_name"
                  name="last_name"
                  label="Nom"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dupont"
                />
              </Grid>
            </Grid>

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
              sx={{ mt: 2 }}
              placeholder="votre@email.com"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              sx={{ mt: 2 }}
              placeholder="Au moins 8 caractères"
              helperText="Minimum 8 caractères"
            />

            <TextField
              fullWidth
              id="password2"
              name="password2"
              label="Confirmer le mot de passe"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password2}
              onChange={handleChange}
              sx={{ mt: 2 }}
              placeholder="Retapez votre mot de passe"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
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
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>

            {/* Terms & Privacy */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 2 }}
            >
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="/legal/terms" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Conditions d&apos;utilisation
                </Typography>
              </Link>{' '}
              et notre{' '}
              <Link href="/legal/privacy" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Politique de confidentialité
                </Typography>
              </Link>
            </Typography>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Vous avez déjà un compte ?{' '}
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
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
                    Se connecter
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
