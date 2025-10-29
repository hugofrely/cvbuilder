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
} from '@mui/material';
import { Add, Delete, Edit, WorkOutline } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { Experience } from '@/types/cv';

export default function ExperienceForm() {
  const { cvData, addExperience, updateExperience, deleteExperience } = useCVContext();
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
    });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Expérience professionnelle
      </Typography>

      {/* Liste des expériences */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {cvData.experiences.map((exp) => (
          <Card key={exp.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <WorkOutline color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {exp.jobTitle}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="primary" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {exp.employer} • {exp.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {exp.startDate} - {exp.currentJob ? 'Présent' : exp.endDate}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleEdit(exp)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteExperience(exp.id)}
                    color="error"
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
    </Box>
  );
}
