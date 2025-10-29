'use client';

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  CheckCircle,
  Star,
  Description,
} from '@mui/icons-material';
import { templateApi } from '@/lib/api/template';
import { Template } from '@/types/resume';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (templateId: number) => void;
  currentTemplateId?: number | null;
}

export default function TemplateSelector({
  open,
  onClose,
  onSelect,
  currentTemplateId,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(currentTemplateId || null);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateApi.getAll();
      setTemplates(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedId) {
      onSelect(selectedId);
      onClose();
    }
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sélectionnez le template qui correspond le mieux à votre profil
            </Typography>

            <RadioGroup
              value={selectedId || ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              <Grid container spacing={3}>
                {templates.map((template) => (
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
                          height: 200,
                          background: template.thumbnail
                            ? `url(${template.thumbnail})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {!template.thumbnail && (
                          <Typography
                            variant="h3"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            }}
                          >
                            {template.name[0]}
                          </Typography>
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

                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <FormControlLabel
                            value={template.id}
                            control={<Radio />}
                            label=""
                            sx={{ m: 0 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {template.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
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

            {templates.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  Aucun template disponible
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
