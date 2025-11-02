'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { authService } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authService.resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
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
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                mb: 2,
              }}
            >
              <EmailIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: 'text.primary' }}
            >
              Mot de passe oublié ?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </Typography>
          </Box>

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Reset Password Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Adresse email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="votre@email.com"
              disabled={loading || success}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || success}
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
                  Envoi en cours...
                </>
              ) : success ? (
                'Email envoyé !'
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>

            {/* Back to Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 58, 138, 0.04)',
                    },
                  }}
                >
                  Retour à la connexion
                </Button>
              </Link>
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
