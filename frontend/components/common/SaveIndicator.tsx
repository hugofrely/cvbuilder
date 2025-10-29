'use client';

import { Box, Chip, CircularProgress } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useResumeStore } from '@/lib/stores/useResumeStore';

export default function SaveIndicator() {
  const { saveStatus } = useResumeStore();

  const getIndicatorProps = () => {
    switch (saveStatus.status) {
      case 'saving':
        return {
          icon: <CircularProgress size={16} />,
          label: 'Sauvegarde en cours...',
          color: 'default' as const,
        };
      case 'saved':
        return {
          icon: <CheckCircle />,
          label: 'Sauvegardé',
          color: 'success' as const,
        };
      case 'error':
        return {
          icon: <Error />,
          label: saveStatus.message || 'Erreur de sauvegarde',
          color: 'error' as const,
        };
      default:
        return null;
    }
  };

  const props = getIndicatorProps();

  if (!props) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 16,
        zIndex: 1100,
      }}
    >
      <Chip
        icon={props.icon}
        label={props.label}
        color={props.color}
        size="small"
      />
    </Box>
  );
}
