'use client';

import { Box, Typography, LinearProgress, Stack, Chip } from '@mui/material';
import {
  Person,
  Work,
  School,
  EmojiObjects,
  Language,
  CardMembership,
  Assignment,
  Description,
  CheckCircle,
} from '@mui/icons-material';

interface CVStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface CVProgressStepperProps {
  currentStep: number;
  completedSteps: string[];
  onStepClick?: (stepIndex: number) => void;
}

const steps: CVStep[] = [
  {
    id: 'personal',
    label: 'Informations',
    icon: <Person />,
    description: 'Coordonnées personnelles',
  },
  {
    id: 'summary',
    label: 'Profil',
    icon: <Description />,
    description: 'Titre et résumé',
  },
  {
    id: 'experience',
    label: 'Expériences',
    icon: <Work />,
    description: 'Parcours professionnel',
  },
  {
    id: 'education',
    label: 'Formation',
    icon: <School />,
    description: 'Études et diplômes',
  },
  {
    id: 'skills',
    label: 'Compétences',
    icon: <EmojiObjects />,
    description: 'Savoir-faire',
  },
  {
    id: 'languages',
    label: 'Langues',
    icon: <Language />,
    description: 'Compétences linguistiques',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: <CardMembership />,
    description: 'Certifications pro',
  },
  {
    id: 'projects',
    label: 'Projets',
    icon: <Assignment />,
    description: 'Réalisations',
  },
];

export default function CVProgressStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: CVProgressStepperProps) {
  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <Box
      component="section"
      aria-label="Progression de création du CV"
      sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
        borderRadius: 3,
        p: 3,
        mb: 3,
        color: 'white',
      }}
    >
      <Stack spacing={3}>
        {/* En-tête */}
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
            Progression de votre CV
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {completedSteps.length} sur {steps.length} sections complétées
          </Typography>
        </Box>

        {/* Barre de progression */}
        <Box role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'white',
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', fontWeight: 600, textAlign: 'center' }}
            aria-live="polite"
          >
            {Math.round(progress)}% complété
          </Typography>
        </Box>

        {/* Liste des étapes */}
        <Box
          component="nav"
          aria-label="Navigation des sections du CV"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep;

            return (
              <Box
                key={step.id}
                onClick={() => onStepClick?.(index)}
                role="button"
                tabIndex={0}
                aria-label={`${step.label}: ${step.description}${isCompleted ? ' - Complété' : ''}${isCurrent ? ' - Section actuelle' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStepClick?.(index);
                  }
                }}
                sx={{
                  position: 'relative',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: isCurrent ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  border: '2px solid',
                  borderColor: isCurrent ? 'white' : 'transparent',
                  cursor: onStepClick ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': onStepClick
                    ? {
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-2px)',
                      }
                    : {},
                  '&:focus-visible': {
                    outline: '3px solid white',
                    outlineOffset: 2,
                  },
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: isCompleted ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <CheckCircle sx={{ fontSize: 24, color: 'white' }} />
                    ) : (
                      <Box sx={{ fontSize: 20 }}>{step.icon}</Box>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: isCurrent ? 700 : 600,
                      fontSize: '0.7rem',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {step.label}
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Box>

        {/* Étape actuelle */}
        {currentStep < steps.length && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}
                aria-hidden="true"
              >
                {steps[currentStep].icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Section actuelle : {steps[currentStep].label}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {steps[currentStep].description}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        {/* Message de complétion */}
        {completedSteps.length === steps.length && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid rgba(34, 197, 94, 0.5)',
              textAlign: 'center',
            }}
            role="status"
            aria-live="polite"
          >
            <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Félicitations ! Votre CV est complet
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Vous pouvez maintenant le télécharger ou continuer à le personnaliser
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
