'use client';

import React from 'react';
import {
  Box,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Person,
  Description,
  Work,
  School,
  Star,
  MoreHoriz,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { BuilderStep, StepConfig } from '@/types/cv';

const steps: StepConfig[] = [
  {
    id: 'personal-info',
    label: 'Informations',
    description: 'Vos informations personnelles',
    icon: <Person />,
  },
  {
    id: 'professional-summary',
    label: 'Résumé',
    description: 'Votre profil professionnel',
    icon: <Description />,
  },
  {
    id: 'experience',
    label: 'Expérience',
    description: 'Votre parcours professionnel',
    icon: <Work />,
  },
  {
    id: 'education',
    label: 'Formation',
    description: 'Votre parcours académique',
    icon: <School />,
  },
  {
    id: 'skills',
    label: 'Compétences',
    description: 'Vos compétences clés',
    icon: <Star />,
  },
  {
    id: 'additional',
    label: 'Autres',
    description: 'Langues, loisirs, références',
    icon: <MoreHoriz />,
  },
];

export default function BuilderStepper() {
  const { currentStep, setCurrentStep } = useCVContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: BuilderStep) => {
    setCurrentStep(stepId);
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Navigation par onglets */}
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        {steps.map((step, index) => (
          <Chip
            key={step.id}
            icon={step.icon}
            label={isMobile ? '' : step.label}
            onClick={() => handleStepClick(step.id)}
            color={currentStep === step.id ? 'primary' : 'default'}
            variant={currentStep === step.id ? 'filled' : 'outlined'}
            sx={{
              px: isMobile ? 0.5 : 1,
              height: isMobile ? 36 : 38,
              fontSize: '0.8rem',
              fontWeight: currentStep === step.id ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: isMobile ? 36 : 'auto',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
              '& .MuiChip-icon': {
                fontSize: 18,
                margin: isMobile ? 0 : undefined,
              },
              '& .MuiChip-label': {
                px: isMobile ? 0 : 1,
              },
            }}
          />
        ))}
      </Box>

      {/* Barre de progression */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Étape {currentStepIndex + 1} sur {steps.length}
          </Box>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'primary.main' }}>
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 8,
            bgcolor: 'grey.200',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              height: '100%',
              bgcolor: 'primary.main',
              transition: 'width 0.3s ease',
              borderRadius: 4,
            }}
          />
        </Box>
      </Box>

      {/* Titre et description de l'étape courante */}
      <Box sx={{ textAlign: 'center', mb: 3, py: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Box sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }}>
          {steps[currentStepIndex].label}
        </Box>
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          {steps[currentStepIndex].description}
        </Box>
      </Box>

      {/* Boutons de navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          startIcon={<KeyboardArrowLeft />}
          fullWidth
        >
          Précédent
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          endIcon={<KeyboardArrowRight />}
          fullWidth
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
}
