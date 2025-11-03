'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { templateApi } from '@/lib/api/template';
import { Template, TemplateCategory } from '@/types/resume';

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

export default function TemplatesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<TemplateCategory[]>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, number | boolean | string> = {
        page: page,
        page_size: ITEMS_PER_PAGE,
      };

      if (filter === 'free') {
        params.is_premium = false;
      } else if (filter === 'premium') {
        params.is_premium = true;
      }

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
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
  }, [page, filter, categoryFilter]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await templateApi.getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Reset page to 1 when filter or category changes
  useEffect(() => {
    setPage(1);
  }, [filter, categoryFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/builder?template=${templateId}`);
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType | null,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const getGradientForIndex = (index: number) => {
    return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 12 },
      }}
    >
      {/* Hero Section */}
      <Box
        component="section"
        aria-labelledby="templates-hero-title"
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            id="templates-hero-title"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
            }}
          >
            Choisissez Votre Modèle de CV
          </Typography>
          <Typography
            variant="h2"
            component="p"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.95,
              fontWeight: 400,
            }}
          >
            Des modèles professionnels conçus pour vous démarquer et décrocher l&apos;emploi de vos rêves
          </Typography>
        </Container>
      </Box>

      {/* Templates Grid */}
      <Container maxWidth="lg">
        <Box
          component="section"
          aria-labelledby="templates-list-title"
          sx={{ mb: 6 }}
        >
          <Typography
            variant="h2"
            component="h2"
            id="templates-list-title"
            className="sr-only"
          >
            Liste des modèles disponibles
          </Typography>

          {/* Filter and Stats */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="body1" color="text.secondary" aria-live="polite">
                {loading ? (
                  'Chargement...'
                ) : (
                  <>
                    {totalCount} template{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
                  </>
                )}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="category-filter-label">Catégorie</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    id="category-filter"
                    value={categoryFilter}
                    label="Catégorie"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filtrer par catégorie"
                  >
                    <MenuItem value="all">Toutes les catégories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.slug} value={cat.slug}>
                        {cat.name} ({cat.count})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  size="small"
                  aria-label="Filtrer les templates"
                  fullWidth={isMobile}
                >
                  <ToggleButton value="all" aria-label="Afficher tous les templates">
                    <AllInclusiveIcon sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Tous
                  </ToggleButton>
                  <ToggleButton value="free" aria-label="Afficher uniquement les templates gratuits">
                    <CardGiftcardIcon sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Gratuits
                  </ToggleButton>
                  <ToggleButton value="premium" aria-label="Afficher uniquement les templates premium">
                    <StarIcon sx={{ mr: 0.5, fontSize: 18 }} aria-hidden="true" />
                    Premium
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
            <Divider />
          </Box>

          {/* Loading State */}
          {loading && (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', py: 12 }}
              role="status"
              aria-live="polite"
            >
              <CircularProgress size={48} aria-label="Chargement des templates" />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }} role="alert">
              {error}
            </Alert>
          )}

          {/* Empty State */}
          {!loading && !error && templates.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 12 }} role="status">
              <Typography variant="h3" color="text.secondary" gutterBottom sx={{ fontSize: '1.5rem' }}>
                Aucun template disponible
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {filter === 'premium' && "Il n'y a pas de templates premium pour le moment"}
                {filter === 'free' && "Il n'y a pas de templates gratuits pour le moment"}
                {filter === 'all' && "Aucun template n'est disponible actuellement"}
              </Typography>
            </Box>
          )}

          {/* Templates Grid */}
          {!loading && !error && templates.length > 0 && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: { xs: 2, md: 3 },
                }}
              >
                {templates.map((template, index) => {
                  const isPremium = template.isPremium || template.is_premium;

                  return (
                    <Card
                      key={template.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[12],
                        },
                      }}
                      role="article"
                      aria-labelledby={`template-${template.id}-name`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                        {/* Premium Badge */}
                        {isPremium && (
                          <Chip
                            icon={<StarIcon sx={{ fontSize: 16 }} aria-hidden="true" />}
                            label="Premium"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              zIndex: 1,
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: 'white',
                              fontWeight: 600,
                              boxShadow: 2,
                            }}
                            aria-label="Template premium"
                          />
                        )}

                        {/* Preview Area - Fixed height */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: 280, // Fixed height for consistency
                            background: template.thumbnail
                              ? '#f5f5f5'
                              : getGradientForIndex((page - 1) * ITEMS_PER_PAGE + index),
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                          role="img"
                          aria-label={`Aperçu du modèle ${template.name}`}
                        >
                          {template.thumbnail ? (
                            <Box
                              component="img"
                              src={template.thumbnail}
                              alt={`Aperçu du template ${template.name}`}
                              sx={{
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
                                  fontSize: '3rem',
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
                        </Box>

                        <CardContent
                          sx={{
                            flexGrow: 1,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography
                            variant="h3"
                            component="h3"
                            id={`template-${template.id}-name`}
                            sx={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'text.primary',
                              mb: 1,
                              minHeight: '1.75rem',
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
                              mb: 3,
                              lineHeight: 1.6,
                              minHeight: '4.8rem', // 3 lines × 1.6 line-height
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {template.description}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<VisibilityIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateSelect(template);
                              }}
                              aria-label={`Prévisualiser le modèle ${template.name}`}
                            >
                              Prévisualiser
                            </Button>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template.id!);
                              }}
                              aria-label={`Utiliser le modèle ${template.name}`}
                            >
                              Utiliser
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                  );
                })}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_event, value) => setPage(value)}
                    color="primary"
                    size={isMobile ? 'medium' : 'large'}
                    showFirstButton
                    showLastButton
                    aria-label="Navigation entre les pages de templates"
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Info Section */}
        {!loading && (
          <Box
            component="section"
            aria-labelledby="templates-info-title"
            sx={{
              bgcolor: 'grey.50',
              borderRadius: 2,
              p: { xs: 3, md: 4 },
              mt: 6,
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              id="templates-info-title"
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: 'text.primary',
                mb: 3,
              }}
            >
              Pourquoi choisir nos modèles ?
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 28, mt: 0.5, flexShrink: 0 }} aria-hidden="true" />
                <Box>
                  <Typography variant="h3" gutterBottom sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    Optimisés pour les ATS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tous nos modèles sont conçus pour être compatibles avec les systèmes de suivi des candidatures
                    (ATS), garantissant que votre CV passe les filtres automatiques.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 28, mt: 0.5, flexShrink: 0 }} aria-hidden="true" />
                <Box>
                  <Typography variant="h3" gutterBottom sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    Design professionnel
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Créés par des designers professionnels, nos modèles allient esthétique moderne et lisibilité
                    optimale pour impressionner les recruteurs.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 28, mt: 0.5, flexShrink: 0 }} aria-hidden="true" />
                <Box>
                  <Typography variant="h3" gutterBottom sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    Personnalisables
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adaptez facilement chaque modèle à votre profil et votre secteur d&apos;activité. Modifiez les
                    sections, les couleurs et la mise en page selon vos besoins.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Container>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        aria-labelledby="preview-dialog-title"
        aria-describedby="preview-dialog-description"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon />
            <Typography variant="h2" id="preview-dialog-title" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Aperçu : {selectedTemplate?.name}
            </Typography>
          </Box>
          <IconButton onClick={() => setPreviewOpen(false)} aria-label="Fermer la prévisualisation">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            minHeight: { xs: 'auto', md: '60vh' },
          }}
        >
          {selectedTemplate && (
            <>
              {selectedTemplate.thumbnail ? (
                <Box
                  component="img"
                  src={selectedTemplate.thumbnail}
                  alt={`Aperçu détaillé du modèle ${selectedTemplate.name}`}
                  sx={{
                    width: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getGradientForIndex(0),
                  }}
                >
                  <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, fontSize: '4rem' }}>
                    {selectedTemplate.name.substring(0, 2).toUpperCase()}
                  </Typography>
                </Box>
              )}
              <Box sx={{ p: 3 }}>
                <Typography id="preview-dialog-description" variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedTemplate.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handleUseTemplate(selectedTemplate.id!)}
                  aria-label={`Commencer avec le modèle ${selectedTemplate.name}`}
                >
                  Utiliser ce modèle
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
