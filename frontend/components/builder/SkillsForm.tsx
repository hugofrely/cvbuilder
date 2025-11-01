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
  Slider,
  Stack,
  Chip,
} from '@mui/material';
import { Add, Delete, StarOutline } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { Skill } from '@/types/cv';
import { BuilderNavigation } from './BuilderStepper';

export default function SkillsForm() {
  const { cvData, addSkill, updateSkill, deleteSkill } = useCVContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });

  const handleAdd = () => {
    if (newSkill.name.trim()) {
      addSkill({ ...newSkill, id: Date.now().toString() });
      setNewSkill({ name: '', level: 3 });
      setIsAdding(false);
    }
  };

  const levelLabels: { [key: number]: string } = {
    1: 'Débutant',
    2: 'Élémentaire',
    3: 'Intermédiaire',
    4: 'Avancé',
    5: 'Expert',
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Compétences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ajoutez vos compétences techniques et soft skills
      </Typography>

      {/* Liste des compétences */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {cvData.skills.map((skill) => (
          <Card key={skill.id} variant="outlined" component="article" aria-label={`Compétence: ${skill.name}`}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Slider
                      value={skill.level}
                      onChange={(_, value) => updateSkill(skill.id, { level: value as number })}
                      min={1}
                      max={5}
                      marks
                      step={1}
                      sx={{ flex: 1, maxWidth: 300 }}
                      aria-label={`Niveau de maîtrise de ${skill.name}`}
                      aria-valuetext={levelLabels[skill.level]}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => levelLabels[value]}
                    />
                    <Chip
                      label={levelLabels[skill.level]}
                      size="small"
                      color="primary"
                      variant="outlined"
                      aria-hidden="true"
                    />
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => deleteSkill(skill.id)}
                  color="error"
                  aria-label={`Supprimer la compétence ${skill.name}`}
                >
                  <Delete aria-hidden="true" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Formulaire d'ajout */}
      {isAdding ? (
        <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }} component="section" aria-label="Formulaire d'ajout de compétence">
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Ajouter une compétence
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nom de la compétence"
                value={newSkill.name}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: JavaScript, Communication, Gestion de projet..."
                required
                aria-required="true"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ mb: 1 }} id="skill-level-label">
                Niveau de maîtrise: <strong>{levelLabels[newSkill.level]}</strong>
              </Typography>
              <Slider
                value={newSkill.level}
                onChange={(_, value) => setNewSkill((prev) => ({ ...prev, level: value as number }))}
                min={1}
                max={5}
                marks={[
                  { value: 1, label: 'Débutant' },
                  { value: 2, label: 'Élémentaire' },
                  { value: 3, label: 'Intermédiaire' },
                  { value: 4, label: 'Avancé' },
                  { value: 5, label: 'Expert' },
                ]}
                step={1}
                aria-labelledby="skill-level-label"
                aria-valuetext={levelLabels[newSkill.level]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => levelLabels[value]}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" onClick={handleAdd} aria-label="Confirmer l'ajout de la compétence">
              Ajouter
            </Button>
            <Button variant="outlined" onClick={() => setIsAdding(false)} aria-label="Annuler l'ajout">
              Annuler
            </Button>
          </Box>
        </Card>
      ) : (
        <Button
          variant="outlined"
          startIcon={<Add aria-hidden="true" />}
          onClick={() => setIsAdding(true)}
          fullWidth
          sx={{ py: 1.5 }}
          aria-label="Ajouter une nouvelle compétence"
        >
          Ajouter une compétence
        </Button>
      )}

      <BuilderNavigation />
    </Box>
  );
}
