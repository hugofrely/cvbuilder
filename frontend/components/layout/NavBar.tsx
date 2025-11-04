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
import CreateIcon from '@mui/icons-material/Create';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
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
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        zIndex: 1200,
        borderRadius: 0,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo et titre */}
          <Link
            href="/"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}
            aria-label="UnCVpro.fr - Retour à l'accueil"
          >
            <Box
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/logo.svg"
                alt="UnCVpro.fr Logo"
                width={40}
                height={40}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
            <Typography
              variant="h6"
              component="div"
              noWrap
              sx={{
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: { xs: '1.2rem', sm: '1.4rem' },
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              <Box component="span" sx={{ fontWeight: 400 }}>Un</Box>CVpro<Box component="span" sx={{ fontWeight: 400 }}>.fr</Box>
            </Typography>
          </Link>

          <Box sx={{ mr: { xs: 2, md: 4 } }} />

          {/* Navigation Desktop */}
          {!isMobile && (
            <>
              <Box
                component="ul"
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  gap: 0.5,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {mainNavItems.map((item) => (
                  <Box component="li" key={item.href}>
                    <Link href={item.href} style={{ textDecoration: 'none' }} passHref tabIndex={-1}>
                      <Button
                        color="inherit"
                        aria-label={item.ariaLabel || item.label}
                        sx={{
                          minHeight: 44,
                          px: 2,
                          fontWeight: 500,
                          color: 'text.primary',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.06)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  </Box>
                ))}
                {userNavItems.map((item) => (
                  <Box component="li" key={item.href}>
                    <Link href={item.href} style={{ textDecoration: 'none' }} passHref tabIndex={-1}>
                      <Button
                        color="inherit"
                        aria-label={item.ariaLabel || item.label}
                        sx={{
                          minHeight: 44,
                          px: 2,
                          fontWeight: 500,
                          color: 'text.primary',
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.06)',
                            color: 'primary.main',
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
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {isAuthenticated ? (
                  <>
                    <Link href="/builder" style={{ textDecoration: 'none' }} tabIndex={-1}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CreateIcon />}
                        aria-label="Créer mon CV"
                        sx={{
                          fontWeight: 600,
                          minHeight: 40,
                          px: 3,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4,
                          },
                        }}
                      >
                        Créer mon CV
                      </Button>
                    </Link>
                    <Button
                      variant="text"
                      color="inherit"
                      onClick={handleLogout}
                      aria-label="Se déconnecter"
                      sx={{
                        minHeight: 40,
                        px: 2,
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          color: 'error.main',
                        },
                      }}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" style={{ textDecoration: 'none' }} tabIndex={-1}>
                      <Button
                        variant="text"
                        color="inherit"
                        aria-label="Se connecter à votre compte"
                        sx={{
                          minHeight: 40,
                          px: 2.5,
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.06)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/register" style={{ textDecoration: 'none' }} tabIndex={-1}>
                      <Button
                        variant="text"
                        color="inherit"
                        aria-label="Créer un nouveau compte"
                        sx={{
                          minHeight: 40,
                          px: 2.5,
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.06)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        S&apos;inscrire
                      </Button>
                    </Link>
                    <Link href="/builder" style={{ textDecoration: 'none' }} tabIndex={-1}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CreateIcon />}
                        aria-label="Créer mon CV"
                        sx={{
                          fontWeight: 600,
                          minHeight: 40,
                          px: 3,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          boxShadow: 2,
                          '&:hover': {
                            boxShadow: 4,
                          },
                        }}
                      >
                        Créer mon CV
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
                  aria-label={item.ariaLabel || item.label}
                  sx={{
                    minHeight: 56,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.06)',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: 'text.primary',
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
                      aria-label={item.ariaLabel || item.label}
                      sx={{
                        minHeight: 56,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'rgba(37, 99, 235, 0.06)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '1rem',
                          color: 'text.primary',
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
        <Box sx={{ p: 3 }} role="group" aria-label="Actions utilisateur">
          <Link href="/builder" style={{ textDecoration: 'none' }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              aria-label="Créer mon CV"
              onClick={handleMobileMenuClose}
              sx={{
                mb: 1.5,
                fontWeight: 600,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 2,
              }}
            >
              Créer mon CV
            </Button>
          </Link>
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="text"
              color="inherit"
              onClick={handleLogout}
              aria-label="Se déconnecter"
              sx={{
                fontWeight: 500,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: 'error.main',
                },
              }}
            >
              Déconnexion
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="text"
                  color="inherit"
                  aria-label="Se connecter à votre compte"
                  onClick={handleMobileMenuClose}
                  sx={{
                    fontWeight: 500,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.06)',
                      color: 'primary.main',
                    },
                  }}
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <Button
                  fullWidth
                  variant="text"
                  color="inherit"
                  aria-label="Créer un nouveau compte"
                  onClick={handleMobileMenuClose}
                  sx={{
                    fontWeight: 500,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.06)',
                      color: 'primary.main',
                    },
                  }}
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
