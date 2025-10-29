'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Radio,
  FormControlLabel,
  RadioGroup,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Description,
  AllInclusive,
  CardGiftcard,
  Visibility,
  Close,
} from '@mui/icons-material';
import { templateApi } from '@/lib/api/template';
import { Template } from '@/types/resume';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: number) => void;
  currentTemplateId?: number | null;
}

type FilterType = 'all' | 'free' | 'premium';

const ITEMS_PER_PAGE = 9;

// Color palette for template cards (fallback when no image)
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
];

export default function TemplateSelector({
  open,
  onClose,
  onSelect,
  currentTemplateId,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(currentTemplateId || null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);

  // Preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, number | boolean> = {
        page: page,
        page_size: ITEMS_PER_PAGE,
      };

      if (filter === 'free') {
        params.is_premium = false;
      } else if (filter === 'premium') {
        params.is_premium = true;
      }

      const data = await templateApi.getAll(params);
      setTemplates(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setError('Erreur lors du chargement des templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  // Load templates when dialog opens, or when page/filter changes
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open, loadTemplates]);

  // Reset page to 1 when dialog opens
  useEffect(() => {
    if (open) {
      setPage(1);
    }
  }, [open]);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleSelect = () => {
    if (selectedId) {
      onSelect(selectedId);
      onClose();
    }
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType | null,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleOpenPreview = (template: Template) => {
    if (template.thumbnail) {
      setPreviewTemplate(template);
      setPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewTemplate(null);
  };

  const getGradientForIndex = (index: number) => {
    return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: { minHeight: '80vh' },
        },
      }}
      aria-labelledby="template-selector-title"
      aria-describedby="template-selector-description"
    >
      <DialogTitle id="template-selector-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description aria-hidden="true" />
          <Typography variant="h6" component="h2">
            Choisir un template
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography id="template-selector-description" variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Sélectionnez un template de CV parmi notre collection. Cliquez sur "Voir l'aperçu" pour voir le template en grand.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }} role="status" aria-live="polite">
            <CircularProgress aria-label="Chargement des templates" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} role="alert">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Header with filter and stats */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" aria-live="polite">
                  {totalCount} template{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
                </Typography>

                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  size="small"
                  aria-label="Filtrer les templates"
                >
                  <ToggleButton value="all" aria-label="Afficher tous les templates">
                    <AllInclusive sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Tous
                  </ToggleButton>
                  <ToggleButton value="free" aria-label="Afficher uniquement les templates gratuits">
                    <CardGiftcard sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Gratuits
                  </ToggleButton>
                  <ToggleButton value="premium" aria-label="Afficher uniquement les templates premium">
                    <Star sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Premium
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Divider />
            </Box>

            <RadioGroup
              value={selectedId || ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              aria-label="Sélection du template"
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {templates.map((template, index) => {
                  const isPremium = template.isPremium || template.is_premium;
                  const isSelected = selectedId === template.id;

                  return (
                    <Box key={template.id} sx={{ display: 'flex' }}>
                      <Card
                        component="article"
                        sx={{
                          cursor: 'pointer',
                          border: 2,
                          borderColor: isSelected ? 'primary.main' : 'transparent',
                          position: 'relative',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            borderColor: isSelected ? 'primary.main' : 'grey.300',
                            boxShadow: 6,
                            transform: 'translateY(-4px)',
                          },
                          '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: 6,
                          },
                        }}
                        onClick={() => setSelectedId(template.id!)}
                        role="group"
                        aria-label={`Template ${template.name}${isPremium ? ' (Premium)' : ''}`}
                      >
                        {/* A4 Preview image - ratio 1:1.414 (A4 format) */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '141.4%', // A4 ratio
                            background: template.thumbnail
                              ? 'transparent'
                              : getGradientForIndex((page - 1) * ITEMS_PER_PAGE + index),
                            overflow: 'hidden',
                          }}
                        >
                          {template.thumbnail ? (
                            <Box
                              component="img"
                              src={template.thumbnail}
                              alt={`Aperçu du template ${template.name}`}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'top',
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography
                                variant="h2"
                                sx={{
                                  color: 'white',
                                  fontWeight: 700,
                                  textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                  mb: 1,
                                }}
                                aria-hidden="true"
                              >
                                {template.name.substring(0, 2).toUpperCase()}
                              </Typography>
                              <Box
                                sx={{
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  backdropFilter: 'blur(10px)',
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 2,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                  }}
                                >
                                  Template
                                </Typography>
                              </Box>
                            </Box>
                          )}

                          {/* Premium badge */}
                          {isPremium && (
                            <Chip
                              icon={<Star sx={{ fontSize: 16 }} aria-hidden="true" />}
                              label="Premium"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                fontWeight: 600,
                                boxShadow: 2,
                              }}
                              aria-label="Template premium"
                            />
                          )}

                          {/* Selected indicator */}
                          {isSelected && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                background: 'white',
                                borderRadius: '50%',
                                p: 0.5,
                                boxShadow: 2,
                              }}
                              aria-hidden="true"
                            >
                              <CheckCircle color="primary" />
                            </Box>
                          )}
                        </Box>

                        <CardContent
                          sx={{
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            p: 2,
                            gap: 1.5,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <FormControlLabel
                              value={template.id}
                              control={
                                <Radio
                                  inputProps={{
                                    'aria-label': `Sélectionner le template ${template.name}`,
                                  }}
                                />
                              }
                              label=""
                              sx={{ m: 0, mt: -0.5, flexShrink: 0 }}
                            />
                            <Box sx={{ flex: 1, minHeight: 0 }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '1.05rem',
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {template.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  lineHeight: 1.5,
                                  fontSize: '0.875rem',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {template.description}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Preview button */}
                          {template.thumbnail && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPreview(template);
                              }}
                              fullWidth
                              sx={{
                                textTransform: 'none',
                                borderColor: 'divider',
                                color: 'text.secondary',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  color: 'primary.main',
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            >
                              Voir l'aperçu
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </RadioGroup>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  aria-label="Navigation entre les pages de templates"
                />
              </Box>
            )}

            {templates.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }} role="status">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucun template disponible
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filter === 'premium' && "Il n'y a pas de templates premium pour le moment"}
                  {filter === 'free' && "Il n'y a pas de templates gratuits pour le moment"}
                  {filter === 'all' && "Aucun template n'est disponible actuellement"}
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={handleSelect}
          variant="contained"
          disabled={!selectedId || loading}
          aria-label={selectedId ? "Confirmer la sélection du template" : "Sélectionner un template d'abord"}
        >
          Sélectionner ce template
        </Button>
      </DialogActions>

      {/* Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        aria-labelledby="preview-dialog-title"
      >
        <DialogTitle id="preview-dialog-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility />
            <Typography variant="h6" component="h2">
              Aperçu : {previewTemplate?.name}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClosePreview}
            size="small"
            aria-label="Fermer l'aperçu"
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.100' }}>
          {previewTemplate?.thumbnail && (
            <Box
              component="img"
              src={previewTemplate.thumbnail}
              alt={`Aperçu complet du template ${previewTemplate.name}`}
              sx={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClosePreview} variant="outlined">
            Fermer
          </Button>
          {previewTemplate && (
            <Button
              onClick={() => {
                setSelectedId(previewTemplate.id!);
                handleClosePreview();
              }}
              variant="contained"
            >
              Sélectionner ce template
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
