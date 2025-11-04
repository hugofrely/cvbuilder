'use client';

import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { trackCTAClick } from '@/lib/gtm';

interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  ctaLocation: string; // Pour identifier où se trouve le CTA
  endIcon?: ReactNode;
  sx?: any;
  'aria-label'?: string;
}

export default function CTAButton({
  children,
  href,
  onClick,
  variant = 'contained',
  size = 'large',
  ctaLocation,
  endIcon,
  sx,
  'aria-label': ariaLabel,
}: CTAButtonProps) {
  const handleClick = () => {
    // Tracker l'événement GTM
    trackCTAClick(ctaLocation);

    // Appeler la fonction onClick si fournie
    if (onClick) {
      onClick();
    }

    // Rediriger si href est fourni
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      endIcon={endIcon}
      aria-label={ariaLabel}
      sx={sx}
    >
      {children}
    </Button>
  );
}
