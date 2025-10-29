'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  FormControlLabel,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Delete, Edit, SchoolOutlined, DragIndicator, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { Education } from '@/types/cv';

export default function EducationForm() {
  const { cvData, addEducation, updateEducation, deleteEducation, reorderEducation } = useCVContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    degree: '',
    school: '',
    city: '',
    startDate: '',
    endDate: '',
    currentStudy: false,
    description: '',
    workMode: undefined,
  });

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      currentStudy: event.target.checked,
      endDate: event.target.checked ? '' : prev.endDate,
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateEducation(editingId, formData);
      setEditingId(null);
    } else {
      addEducation({ ...formData, id: Date.now().toString() });
    }
    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      degree: edu.degree,
      school: edu.school,
      city: edu.city,
      startDate: edu.startDate,
      endDate: edu.endDate,
      currentStudy: edu.currentStudy,
      description: edu.description,
      workMode: edu.workMode,
    });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      school: '',
      city: '',
      startDate: '',
      endDate: '',
      currentStudy: false,
      description: '',
      workMode: undefined,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newEducation = [...cvData.education];
    [newEducation[index - 1], newEducation[index]] = [newEducation[index], newEducation[index - 1]];
    reorderEducation(newEducation);
  };

  const handleMoveDown = (index: number) => {
    if (index === cvData.education.length - 1) return;
    const newEducation = [...cvData.education];
    [newEducation[index], newEducation[index + 1]] = [newEducation[index + 1], newEducation[index]];
    reorderEducation(newEducation);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Formation
      </Typography>

      {/* Liste des formations */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {cvData.education.map((edu, index) => (
          <Card
            key={edu.id}
            variant="outlined"
            role="article"
            aria-label={`Formation ${index + 1}: ${edu.degree} à ${edu.school}`}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 2 }}>
                {/* Reorder controls */}
                <Box
                  role="group"
                  aria-label="Réorganiser la formation"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label="Déplacer vers le haut"
                    title="Déplacer vers le haut"
                    sx={{
                      opacity: index === 0 ? 0.3 : 1,
                      '&:hover': { backgroundColor: index === 0 ? 'transparent' : undefined },
                    }}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <DragIndicator fontSize="small" color="action" aria-hidden="true" />
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === cvData.education.length - 1}
                    aria-label="Déplacer vers le bas"
                    title="Déplacer vers le bas"
                    sx={{
                      opacity: index === cvData.education.length - 1 ? 0.3 : 1,
                      '&:hover': {
                        backgroundColor: index === cvData.education.length - 1 ? 'transparent' : undefined,
                      },
                    }}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content */}
                <Box component="article" sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SchoolOutlined color="primary" aria-hidden="true" />
                    <Typography component="h3" variant="h6" sx={{ fontWeight: 600 }}>
                      {edu.degree}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {edu.school} • {edu.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <time dateTime={edu.startDate}>{edu.startDate}</time> -{' '}
                    {edu.currentStudy ? (
                      'En cours'
                    ) : (
                      <time dateTime={edu.endDate}>{edu.endDate}</time>
                    )}
                    {edu.workMode && ` • ${edu.workMode === 'remote' ? 'À distance' : edu.workMode === 'onsite' ? 'Sur site' : 'Hybride'}`}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2">{edu.description}</Typography>
                  )}
                </Box>

                {/* Action buttons */}
                <Box role="group" aria-label="Actions de la formation">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(edu)}
                    color="primary"
                    aria-label="Modifier la formation"
                    title="Modifier"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteEducation(edu.id)}
                    color="error"
                    aria-label="Supprimer la formation"
                    title="Supprimer"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Formulaire d'ajout/édition */}
      {isAdding ? (
        <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {editingId ? 'Modifier la formation' : 'Ajouter une formation'}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Diplôme / Formation"
                value={formData.degree}
                onChange={handleChange('degree')}
                required
                placeholder="Ex: Master en Informatique"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Établissement"
                value={formData.school}
                onChange={handleChange('school')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ville"
                value={formData.city}
                onChange={handleChange('city')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="work-mode-label">Mode</InputLabel>
                <Select
                  labelId="work-mode-label"
                  id="work-mode"
                  value={formData.workMode || ''}
                  label="Mode"
                  onChange={(e) => setFormData((prev) => ({ ...prev, workMode: e.target.value as 'remote' | 'onsite' | 'hybrid' | undefined }))}
                >
                  <MenuItem value="">Non spécifié</MenuItem>
                  <MenuItem value="onsite">Sur site</MenuItem>
                  <MenuItem value="remote">À distance</MenuItem>
                  <MenuItem value="hybrid">Hybride</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Date de début"
                type="month"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Date de fin"
                type="month"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={formData.currentStudy}
                required={!formData.currentStudy}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={formData.currentStudy} onChange={handleCheckboxChange} />
                }
                label="Formation en cours"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (optionnelle)"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Cours principaux, spécialisation, mentions..."
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            <Button variant="outlined" onClick={resetForm}>
              Annuler
            </Button>
          </Box>
        </Card>
      ) : (
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsAdding(true)}
          fullWidth
          sx={{ py: 1.5 }}
        >
          Ajouter une formation
        </Button>
      )}
    </Box>
  );
}
