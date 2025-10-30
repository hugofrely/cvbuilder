'use client';

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
                icon={isPast ? <Check /> : (step.icon as React.ReactElement)}
                label={isSmall ? '' : step.label}
                onClick={() => handleStepClick(step.id)}
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

      {/* Titre et description élégants */}
      <Fade in timeout={300}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 3,
            py: 3,
            px: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(
              theme.palette.primary.light,
              0.06
            )} 100%)`,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {steps[currentStepIndex].icon}
            </Box>
            <Box
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.5px',
              }}
            >
              {steps[currentStepIndex].label}
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: '0.9rem',
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            {steps[currentStepIndex].description}
          </Box>
        </Box>
      </Fade>

      {/* Boutons de navigation élégants */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          startIcon={<KeyboardArrowLeft />}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            color: 'primary.main',
            '&:hover': {
              border: `2px solid ${theme.palette.primary.main}`,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              transform: 'translateX(-2px)',
            },
            '&:disabled': {
              border: `2px solid ${alpha(theme.palette.grey[300], 0.5)}`,
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Précédent
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          endIcon={<KeyboardArrowRight />}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateX(2px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Suivant
        </Button>
      </Box>
    </Box>
  );
}
