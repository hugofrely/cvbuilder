'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Description,
  AllInclusive,
  CardGiftcard,
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

const ITEMS_PER_PAGE = 6;

// Color palette for template cards
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

  useEffect(() => {
    if (open) {
      setPage(1);
      loadTemplates(1, filter);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setPage(1);
      loadTemplates(1, filter);
    }
  }, [filter]);

  useEffect(() => {
    if (open) {
      loadTemplates(page, filter);
    }
  }, [page]);

  const loadTemplates = async (currentPage: number, currentFilter: FilterType) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      };

      if (currentFilter === 'free') {
        params.is_premium = false;
      } else if (currentFilter === 'premium') {
        params.is_premium = true;
      }

      const data = await templateApi.getAll(params);
      setTemplates(data.results);
      setTotalCount(data.count);
    } catch (err: any) {
      setError('Erreur lors du chargement des templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleSelect = () => {
    if (selectedId) {
      onSelect(selectedId);
      onClose();
    }
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Description />
          <Typography variant="h6">Choisir un template</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Header with filter and stats */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {totalCount} template{totalCount > 1 ? 's' : ''} disponible{totalCount > 1 ? 's' : ''}
                </Typography>

                <ToggleButtonGroup
                  value={filter}
                  exclusive
                  onChange={handleFilterChange}
                  size="small"
                  aria-label="filter templates"
                >
                  <ToggleButton value="all" aria-label="tous">
                    <AllInclusive sx={{ mr: 0.5, fontSize: 18 }} />
                    Tous
                  </ToggleButton>
                  <ToggleButton value="free" aria-label="gratuits">
                    <CardGiftcard sx={{ mr: 0.5, fontSize: 18 }} />
                    Gratuits
                  </ToggleButton>
                  <ToggleButton value="premium" aria-label="premium">
                    <Star sx={{ mr: 0.5, fontSize: 18 }} />
                    Premium
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
              <Divider />
            </Box>

            <RadioGroup
              value={selectedId || ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              <Grid container spacing={3}>
                {templates.map((template, index) => (
                  <Grid item xs={12} sm={6} md={4} key={template.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedId === template.id ? 'primary.main' : 'transparent',
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: selectedId === template.id ? 'primary.main' : 'grey.300',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => setSelectedId(template.id!)}
                    >
                      {/* Preview image placeholder */}
                      <Box
                        sx={{
                          height: 220,
                          background: template.thumbnail
                            ? `url(${template.thumbnail})`
                            : getGradientForIndex((page - 1) * ITEMS_PER_PAGE + index),
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {!template.thumbnail && (
                          <>
                            <Typography
                              variant="h2"
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                                mb: 1,
                              }}
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
                          </>
                        )}

                        {/* Premium badge */}
                        {(template.isPremium || template.is_premium) && (
                          <Chip
                            icon={<Star sx={{ fontSize: 16 }} />}
                            label="Premium"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}

                        {/* Selected indicator */}
                        {selectedId === template.id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              background: 'white',
                              borderRadius: '50%',
                              p: 0.5,
                            }}
                          >
                            <CheckCircle color="primary" />
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ minHeight: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <FormControlLabel
                            value={template.id}
                            control={<Radio />}
                            label=""
                            sx={{ m: 0, mt: -0.5 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                lineHeight: 1.3,
                              }}
                            >
                              {template.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                lineHeight: 1.5,
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
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {templates.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
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
        >
          Sélectionner ce template
        </Button>
      </DialogActions>
    </Dialog>
  );
}
