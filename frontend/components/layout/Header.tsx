'use client';

import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 4,
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
              }}
            >
              uncvpro.fr
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button color="inherit">Accueil</Button>
            </Link>
            <Link href="/templates" style={{ textDecoration: 'none' }}>
              <Button color="inherit">Templates</Button>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Button color="inherit">Tarifs</Button>
            </Link>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <Button color="inherit">Dashboard</Button>
                </Link>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" color="primary">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
