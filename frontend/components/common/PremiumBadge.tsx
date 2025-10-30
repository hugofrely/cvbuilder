import { Chip, ChipProps } from '@mui/material';
import { WorkspacePremium } from '@mui/icons-material';

interface PremiumBadgeProps extends Omit<ChipProps, 'label' | 'icon'> {
  label?: string;
}

export default function PremiumBadge({ label = 'Premium', ...props }: PremiumBadgeProps) {
  return (
    <Chip
      label={label}
      icon={<WorkspacePremium />}
      color="warning"
      size="small"
      sx={{
        fontWeight: 700,
        '& .MuiChip-icon': {
          fontSize: 18,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
}
