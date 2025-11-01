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
  Divider,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Delete, Edit, WorkOutline, DragIndicator, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { Experience } from '@/types/cv';
import { BuilderNavigation } from './BuilderStepper';

export default function ExperienceForm() {
  const { cvData, addExperience, updateExperience, deleteExperience, reorderExperiences } = useCVContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    jobTitle: '',
    employer: '',
    city: '',
    startDate: '',
    endDate: '',
    currentJob: false,
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
      currentJob: event.target.checked,
      endDate: event.target.checked ? '' : prev.endDate,
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience({ ...formData, id: Date.now().toString() });
    }
    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      jobTitle: exp.jobTitle,
      employer: exp.employer,
      city: exp.city,
      startDate: exp.startDate,
      endDate: exp.endDate,
      currentJob: exp.currentJob,
      description: exp.description,
      workMode: exp.workMode,
    });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      employer: '',
      city: '',
      startDate: '',
      endDate: '',
      currentJob: false,
      description: '',
      workMode: undefined,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newExperiences = [...cvData.experiences];
    [newExperiences[index - 1], newExperiences[index]] = [newExperiences[index], newExperiences[index - 1]];
    reorderExperiences(newExperiences);
  };

  const handleMoveDown = (index: number) => {
    if (index === cvData.experiences.length - 1) return;
    const newExperiences = [...cvData.experiences];
    [newExperiences[index], newExperiences[index + 1]] = [newExperiences[index + 1], newExperiences[index]];
    reorderExperiences(newExperiences);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Expérience professionnelle
      </Typography>

      {/* Liste des expériences */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {cvData.experiences.map((exp, index) => (
          <Card
            key={exp.id}
            variant="outlined"
            role="article"
            aria-label={`Expérience ${index + 1}: ${exp.jobTitle} chez ${exp.employer}`}
          >
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                {/* Reorder controls */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    pt: 0.5
                  }}
                  role="group"
                  aria-label="Réorganiser l'expérience"
                >
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    aria-label="Déplacer vers le haut"
                    title="Déplacer vers le haut"
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:disabled': { opacity: 0.3 }
                    }}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <DragIndicator
                    sx={{
                      color: 'action.disabled',
                      fontSize: 20,
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' }
                    }}
                    aria-hidden="true"
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === cvData.experiences.length - 1}
                    aria-label="Déplacer vers le bas"
                    title="Déplacer vers le bas"
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:disabled': { opacity: 0.3 }
                    }}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WorkOutline color="primary" aria-hidden="true" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }} component="h3">
                      {exp.jobTitle}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {exp.employer}{exp.city && ` • ${exp.city}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <time dateTime={exp.startDate}>{exp.startDate}</time> - {exp.currentJob ? 'Présent' : <time dateTime={exp.endDate}>{exp.endDate}</time>}
                    {exp.workMode && ` • ${exp.workMode === 'remote' ? 'Télétravail' : exp.workMode === 'onsite' ? 'Sur site' : 'Hybride'}`}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {exp.description}
                    </Typography>
                  )}
                </Box>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(exp)}
                    color="primary"
                    aria-label={`Modifier l'expérience ${exp.jobTitle}`}
                    title="Modifier"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteExperience(exp.id)}
                    color="error"
                    aria-label={`Supprimer l'expérience ${exp.jobTitle}`}
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
            {editingId ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Titre du poste"
                value={formData.jobTitle}
                onChange={handleChange('jobTitle')}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Employeur"
                value={formData.employer}
                onChange={handleChange('employer')}
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
                <InputLabel id="work-mode-label">Mode de travail</InputLabel>
                <Select
                  labelId="work-mode-label"
                  id="work-mode"
                  value={formData.workMode || ''}
                  label="Mode de travail"
                  onChange={(e) => setFormData((prev) => ({ ...prev, workMode: e.target.value as 'remote' | 'onsite' | 'hybrid' | undefined }))}
                >
                  <MenuItem value="">Non spécifié</MenuItem>
                  <MenuItem value="onsite">Sur site</MenuItem>
                  <MenuItem value="remote">Télétravail</MenuItem>
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
                disabled={formData.currentJob}
                required={!formData.currentJob}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={formData.currentJob} onChange={handleCheckboxChange} />
                }
                label="Je travaille actuellement à ce poste"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Décrivez vos missions, responsabilités et réalisations principales..."
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
          Ajouter une expérience
        </Button>
      )}

      <BuilderNavigation />
    </Box>
  );
}
