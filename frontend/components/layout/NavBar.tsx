'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // Navigation principale
  const mainNavItems: NavItem[] = [
    {
      label: 'Accueil',
      href: '/',
      icon: <HomeIcon fontSize="small" />,
      ariaLabel: "Aller à la page d'accueil"
    },
    {
      label: 'Templates',
      href: '/templates',
      icon: <DescriptionIcon fontSize="small" />,
      ariaLabel: 'Voir les modèles de CV'
    },
    {
      label: 'Tarifs',
      href: '/pricing',
      icon: <AttachMoneyIcon fontSize="small" />,
      ariaLabel: 'Consulter les tarifs'
    },
  ];

  // Navigation utilisateur authentifié
  const userNavItems: NavItem[] = isAuthenticated
    ? [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <DashboardIcon fontSize="small" />,
          ariaLabel: 'Accéder au tableau de bord'
        },
      ]
    : [];

  return (
    <AppBar
      position="fixed"
      component="nav"
      role="navigation"
      aria-label="Navigation principale"
      color="default"
      elevation={1}
      sx={{ bgcolor: 'white' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo et titre */}
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
            aria-label="CV Builder - Retour à l'accueil"
          >
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{
                mr: { xs: 2, md: 4 },
                fontWeight: 700,
                color: 'primary.main',
                cursor: 'pointer',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              CV Builder
            </Typography>
          </Link>

          {/* Navigation Desktop */}
          {!isMobile && (
            <>
              <Box
                component="ul"
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  gap: 1,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
                role="menubar"
              >
                {mainNavItems.map((item) => (
                  <Box component="li" key={item.href} role="none">
                    <Link href={item.href} style={{ textDecoration: 'none' }} passHref>
                      <Button
                        color="inherit"
                        role="menuitem"
                        aria-label={item.ariaLabel || item.label}
                        startIcon={item.icon}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.04)',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </Box>
                ))}
                {userNavItems.map((item) => (
                  <Box component="li" key={item.href} role="none">
                    <Link href={item.href} style={{ textDecoration: 'none' }} passHref>
                      <Button
                        color="inherit"
                        role="menuitem"
                        aria-label={item.ariaLabel || item.label}
                        startIcon={item.icon}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.04)',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </Box>
                ))}
              </Box>

              {/* Boutons d'authentification Desktop */}
              <Box sx={{ display: 'flex', gap: 1 }} role="group" aria-label="Actions utilisateur">
                {isAuthenticated ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    aria-label="Se déconnecter"
                  >
                    Déconnexion
                  </Button>
                ) : (
                  <>
                    <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<LoginIcon />}
                        aria-label="Se connecter à votre compte"
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        aria-label="Créer un nouveau compte"
                      >
                        S&apos;inscrire
                      </Button>
                    </Link>
                  </>
                )}
              </Box>
            </>
          )}

          {/* Menu burger Mobile */}
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                color="inherit"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenuToggle}
                edge="end"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Drawer Menu Mobile */}
      <Drawer
        id="mobile-menu"
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        role="navigation"
        aria-label="Menu mobile"
        ModalProps={{
          keepMounted: true, // Meilleure performance sur mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Menu
            </Typography>
            <IconButton
              onClick={handleMobileMenuClose}
              aria-label="Fermer le menu"
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {isAuthenticated && user && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Connecté en tant que
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <List component="nav" aria-label="Navigation principale mobile">
          {mainNavItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <Link
                href={item.href}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                onClick={handleMobileMenuClose}
              >
                <ListItemButton
                  role="menuitem"
                  aria-label={item.ariaLabel || item.label}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              {userNavItems.map((item) => (
                <ListItem key={item.href} disablePadding>
                  <Link
                    href={item.href}
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                    onClick={handleMobileMenuClose}
                  >
                    <ListItemButton
                      role="menuitem"
                      aria-label={item.ariaLabel || item.label}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        {item.icon}
                      </Box>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </>
          )}
        </List>

        <Divider />

        {/* Boutons d'authentification Mobile */}
        <Box sx={{ p: 2 }} role="group" aria-label="Actions utilisateur">
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              aria-label="Se déconnecter"
              sx={{ justifyContent: 'flex-start', px: 2 }}
            >
              Déconnexion
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<LoginIcon />}
                  aria-label="Se connecter à votre compte"
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  aria-label="Créer un nouveau compte"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
