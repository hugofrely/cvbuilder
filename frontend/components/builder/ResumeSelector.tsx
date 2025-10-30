'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  IconButton,
  alpha,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Add,
  Close,
  Edit,
  Delete,
  AccessTime,
} from '@mui/icons-material';
import { Resume } from '@/types/resume';
import { resumeApi } from '@/lib/api/resume';

interface ResumeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (resumeId: string) => void;
  onCreateNew: () => void;
}

export default function ResumeSelector({
  open,
  onClose,
  onSelect,
  onCreateNew,
}: ResumeSelectorProps) {
  const theme = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadResumes();
    }
  }, [open]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeApi.getAll();
      // Sort by last updated
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setResumes(sorted);
    } catch (err: any) {
      console.error('Error loading resumes:', err);
      setError(err.message || 'Erreur lors du chargement des CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      return;
    }

    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      alert('Erreur lors de la suppression du CV');
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Jamais';
    const d = new Date(date);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const handleSelectResume = (resumeId: string) => {
    onSelect(resumeId);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNew();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
        }}
      >
        <Typography variant="h5" component="div" fontWeight={700}>
          Choisir un CV
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
            }}
          >
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
            <Button onClick={loadResumes} variant="outlined" sx={{ mt: 2 }}>
              Réessayer
            </Button>
          </Box>
        ) : (resumes.length === 0) ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun CV trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Créez votre premier CV pour commencer
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateNew}
              size="large"
            >
              Créer un nouveau CV
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {resumes.map((resume) => (
              <Grid size={{ xs: 12, sm: 6 }} key={resume.id}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleSelectResume(resume.id!)}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1.5,
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            noWrap
                            sx={{ mb: 0.5 }}
                          >
                            {resume.full_name || 'CV sans nom'}
                          </Typography>
                          {resume.title && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {resume.title}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(resume.id!, e)}
                          sx={{
                            ml: 1,
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Modifié {formatDate(resume.updated_at)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {resume.is_paid && (
                          <Chip
                            label="Premium"
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                        {resume.email && (
                          <Chip
                            label={resume.email}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}

            {/* Bouton créer nouveau CV */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={0}
                sx={{
                  border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  height: '100%',
                  minHeight: 180,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <CardActionArea
                  onClick={handleCreateNew}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      py: 4,
                    }}
                  >
                    <Add
                      sx={{
                        fontSize: 48,
                        color: 'primary.main',
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      Créer un nouveau CV
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commencer un CV vierge
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}
