'use client';

import React from 'react';
import { Box, Button, Chip, useMediaQuery, useTheme, alpha, Fade } from '@mui/material';
import {
  Person,
  Description,
  Work,
  School,
  Star,
  MoreHoriz,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Check,
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
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Navigation par étapes élégante */}
      <Box
        component="nav"
        role="navigation"
        aria-label="Étapes de création du CV"
        sx={{
          display: 'flex',
          gap: 1,
          mb: 3,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isPast = index < currentStepIndex;

          return (
            <Fade in key={step.id} timeout={300 + index * 50}>
              <Chip
                icon={isPast ? <Check /> : step.icon}
                label={isSmall ? '' : step.label}
                onClick={() => handleStepClick(step.id)}
                aria-label={`${step.label}: ${step.description}${isActive ? ' (étape actuelle)' : ''}${isPast ? ' (complétée)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                component="button"
                sx={{
                  height: isSmall ? 40 : 44,
                  px: isSmall ? 0 : 2,
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: isSmall ? 40 : 'auto',
                  bgcolor: isActive
                    ? theme.palette.primary.main
                    : isPast
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.grey[500], 0.08),
                  color: isActive
                    ? 'white'
                    : isPast
                    ? theme.palette.success.main
                    : theme.palette.text.secondary,
                  border: `2px solid ${
                    isActive
                      ? theme.palette.primary.main
                      : isPast
                      ? alpha(theme.palette.success.main, 0.3)
                      : 'transparent'
                  }`,
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: isActive
                      ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`
                      : `0 6px 20px ${alpha(theme.palette.grey[500], 0.2)}`,
                    bgcolor: isActive
                      ? theme.palette.primary.dark
                      : isPast
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.grey[500], 0.12),
                  },
                  '&:focus-visible': {
                    outline: '3px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                  '& .MuiChip-icon': {
                    fontSize: 20,
                    color: isActive ? 'white' : isPast ? theme.palette.success.main : 'inherit',
                    margin: isSmall ? 0 : undefined,
                  },
                  '& .MuiChip-label': {
                    px: isSmall ? 0 : 1.5,
                  },
                }}
              />
            </Fade>
          );
        })}
      </Box>

      {/* Barre de progression moderne */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'text.secondary',
              letterSpacing: '0.5px',
            }}
            aria-hidden="true"
          >
            Étape {currentStepIndex + 1} sur {steps.length}
          </Box>
          <Box
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'primary.main',
              px: 1.5,
              py: 0.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 2,
            }}
            aria-hidden="true"
          >
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 10,
            bgcolor: alpha(theme.palette.grey[300], 0.3),
            borderRadius: 5,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: `inset 0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
          }}
          role="progressbar"
          aria-valuenow={Math.round(((currentStepIndex + 1) / steps.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression du CV: ${Math.round(((currentStepIndex + 1) / steps.length) * 100)}% complétée`}
        >
          <Box
            sx={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: 5,
              position: 'relative',
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
              },
              '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

// Export navigation buttons as a separate component
export function BuilderNavigation() {
  const { currentStep, setCurrentStep } = useCVContext();
  const theme = useTheme();

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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }} role="group" aria-label="Navigation entre les étapes">
      <Button
        variant="outlined"
        onClick={handleBack}
        disabled={currentStepIndex === 0}
        startIcon={<KeyboardArrowLeft aria-hidden="true" />}
        aria-label={`Retour à l'étape précédente${currentStepIndex > 0 ? `: ${steps[currentStepIndex - 1].label}` : ''}`}
        size="small"
        sx={{
          py: 0.75,
          px: 2,
          borderRadius: 1.5,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.813rem',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          color: 'primary.main',
          '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          },
          '&:disabled': {
            border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
          },
          transition: 'all 0.2s ease',
        }}
      >
        Précédent
      </Button>
      <Button
        variant="contained"
        onClick={handleNext}
        disabled={currentStepIndex === steps.length - 1}
        endIcon={<KeyboardArrowRight aria-hidden="true" />}
        aria-label={`Passer à l'étape suivante${currentStepIndex < steps.length - 1 ? `: ${steps[currentStepIndex + 1].label}` : ''}`}
        size="small"
        sx={{
          py: 0.75,
          px: 2,
          borderRadius: 1.5,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.813rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 1,
          },
          transition: 'all 0.2s ease',
        }}
      >
        Suivant
      </Button>
    </Box>
  );
}
