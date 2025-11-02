'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Download,
  MoreVert,
  Description,
  Visibility,
  Close,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { resumeApi } from '@/lib/api/resume';
import { Resume } from '@/types/resume';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchResumes();
  }, [isAuthenticated, router]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeApi.getAll();
      setResumes(data);

      // Load thumbnails for each resume
      data.forEach(async (resume) => {
        if (resume.id) {
          loadThumbnail(resume.id);
        }
      });
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Impossible de charger vos CV. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const loadThumbnail = async (resumeId: string) => {
    try {
      const data = await resumeApi.renderHtml(resumeId);
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 20px;
                transform: scale(0.25);
                transform-origin: top left;
                width: 400%;
                height: 400%;
              }
              ${data.css}
            </style>
          </head>
          <body>
            ${data.html}
          </body>
        </html>
      `;
      setThumbnails((prev) => ({ ...prev, [resumeId]: fullHtml }));
    } catch (err) {
      console.error('Error loading thumbnail for resume', resumeId, err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resumeId: string) => {
    setAnchorEl((prev) => ({ ...prev, [resumeId]: event.currentTarget }));
  };

  const handleMenuClose = (resumeId: string) => {
    setAnchorEl((prev) => ({ ...prev, [resumeId]: null }));
  };

  const handleEdit = (resumeId: string) => {
    handleMenuClose(resumeId);
    router.push(`/builder?resumeId=${resumeId}`);
  };

  const handlePreview = async (resumeId: string) => {
    handleMenuClose(resumeId);
    setPreviewOpen(true);
    setPreviewLoading(true);
    try {
      const data = await resumeApi.renderHtml(resumeId);
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>${data.css}</style>
          </head>
          <body>
            ${data.html}
          </body>
        </html>
      `;
      setPreviewHtml(fullHtml);
    } catch (err) {
      console.error('Error loading preview:', err);
      alert('Erreur lors du chargement de la prévisualisation.');
      setPreviewOpen(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewHtml('');
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      return;
    }

    try {
      await resumeApi.delete(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      handleMenuClose(resumeId);
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Erreur lors de la suppression du CV.');
    }
  };

  const handleExportPdf = async (resumeId: string) => {
    try {
      const { blob, filename } = await resumeApi.exportPdf(resumeId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      handleMenuClose(resumeId);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Erreur lors de l\'export du CV.');
    }
  };

  const handleCreateNew = () => {
    router.push('/builder');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Mes CV
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gérez et éditez vos CV professionnels
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{
              minHeight: 48,
              px: 3,
              fontWeight: 600,
            }}
          >
            Créer un nouveau CV
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 12,
            px: 3,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'grey.50',
          }}
        >
          <Description sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Aucun CV pour le moment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Commencez par créer votre premier CV professionnel
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNew}
          >
            Créer mon premier CV
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {resumes.map((resume) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={resume.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                {/* Card Header with Preview */}
                <Box
                  sx={{
                    height: 200,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {thumbnails[resume.id!] ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        '&:hover': {
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                          },
                        },
                      }}
                    >
                      <iframe
                        srcDoc={thumbnails[resume.id!]}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          pointerEvents: 'none',
                        }}
                        title={`Aperçu de ${resume.full_name || resume.fullName || 'CV'}`}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={40} />
                      <Typography variant="caption" color="text.secondary">
                        Chargement...
                      </Typography>
                    </Box>
                  )}
                  {resume.is_paid && (
                    <Chip
                      label="Premium"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>

                {/* Card Content */}
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {resume.full_name || resume.fullName || resume.title || 'CV Sans Titre'}
                  </Typography>
                  {resume.title && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {resume.title}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Modifié le {formatDate(resume.updated_at || resume.updatedAt)}
                  </Typography>
                </CardContent>

                {/* Card Actions */}
                <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEdit(resume.id!)}
                    sx={{ fontWeight: 600 }}
                  >
                    Éditer
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handlePreview(resume.id!)}
                    sx={{ fontWeight: 600 }}
                  >
                    Voir
                  </Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, resume.id!)}
                    aria-label="Plus d'options"
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl[resume.id!]}
                    open={Boolean(anchorEl[resume.id!])}
                    onClose={() => handleMenuClose(resume.id!)}
                  >
                    <MenuItem onClick={() => handleExportPdf(resume.id!)}>
                      <Download sx={{ mr: 1 }} fontSize="small" />
                      Télécharger PDF
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(resume.id!)} sx={{ color: 'error.main' }}>
                      <Delete sx={{ mr: 1 }} fontSize="small" />
                      Supprimer
                    </MenuItem>
                  </Menu>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* User Info */}
      {user && (
        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Connecté en tant que <strong>{user.email}</strong>
          </Typography>
          {user.isPremium && (
            <Chip
              label="Utilisateur Premium"
              color="primary"
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
            />
          )}
        </Box>
      )}

      {/* Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="span">
            Prévisualisation du CV
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePreview}
            aria-label="Fermer"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, overflow: 'auto' }}>
          {previewLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'white',
              }}
            >
              <iframe
                srcDoc={previewHtml}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title="CV Preview"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
