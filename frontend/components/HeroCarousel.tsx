'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';

const cvImages = [
  '023f0553-baf8-4bab-9a4e-d80801426bb6-two-column-elegant.png',
  '7cec8b01-75e7-47da-a61c-2414171f0743-bold-contrast-modern.png',
  '4182b7a6-17c2-44b5-aa60-3e3b5de41659-minimalist-japanese-zen.png',
  '8f8db005-9b83-4ebd-a4f1-b8f053901968-grid-modern-boxes.png',
  '595ef688-5ad8-44a1-ab41-ac4c47fac5d8-asymmetric-creative-split.png'
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cvImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '110%',
          height: '110%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: 4,
          zIndex: 0,
        },
      }}
    >
      {/* Images Container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 'auto',
          aspectRatio: '210 / 297', // A4 ratio
        }}
      >
        {cvImages.map((img, index) => (
          <Box
            key={img}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '3px solid rgba(255,255,255,0.3)',
              opacity: currentIndex === index ? 1 : 0,
              transform: currentIndex === index ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
              zIndex: currentIndex === index ? 1 : 0,
              overflow: 'hidden',
            }}
          >
            <Image
              src={`/${img}`}
              alt={`Exemple de CV professionnel ${index + 1}`}
              fill
              sizes="400px"
              style={{
                objectFit: 'cover',
                objectPosition: 'top',
              }}
              priority={index === 0}
            />
          </Box>
        ))}
      </Box>

      {/* Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1.5,
          zIndex: 2,
        }}
      >
        {cvImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: currentIndex === index ? 32 : 12,
              height: 12,
              borderRadius: 6,
              bgcolor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'white',
              },
            }}
            role="button"
            aria-label={`Voir l'exemple de CV ${index + 1}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentIndex(index);
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
