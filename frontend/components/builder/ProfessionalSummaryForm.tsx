'use client';

import React from 'react';
import { Box, TextField, Typography, Chip } from '@mui/material';
import { useCVContext } from '@/context/CVContext';
import { Lightbulb } from '@mui/icons-material';

export default function ProfessionalSummaryForm() {
  const { cvData, updateProfessionalSummary } = useCVContext();

  const suggestions = [
    'Professionnel motivé avec X années d\'expérience...',
    'Passionné par [votre domaine], je possède...',
    'Expert en [compétences] cherchant à contribuer...',
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Résumé professionnel
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Décrivez brièvement votre profil professionnel, vos compétences clés et vos objectifs de
        carrière (2-4 phrases).
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={6}
        value={cvData.professionalSummary}
        onChange={(e) => updateProfessionalSummary(e.target.value)}
        placeholder="Ex: Développeur Full-Stack passionné avec 5 ans d'expérience dans la création d'applications web performantes. Expert en React, Node.js et cloud computing. Recherche un poste stimulant pour apporter mon expertise technique et ma capacité à résoudre des problèmes complexes."
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          p: 2,
          bgcolor: 'info.lighter',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'info.light',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Lightbulb sx={{ color: 'info.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Suggestions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {suggestions.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => updateProfessionalSummary(suggestion)}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'info.light' },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
