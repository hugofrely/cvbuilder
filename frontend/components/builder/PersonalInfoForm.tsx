'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  IconButton,
  Avatar,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { personalInfo } = cvData;
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo({ [field]: event.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setPhotoError('La photo ne doit pas dépasser 5 MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Le fichier doit être une image');
      return;
    }

    setPhotoError('');
    setPhotoLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      updatePersonalInfo({ photo: reader.result as string });
      setPhotoLoading(false);
    };
    reader.onerror = () => {
      setPhotoError('Erreur lors du chargement de la photo');
      setPhotoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDelete = () => {
    updatePersonalInfo({ photo: '' });
    setPhotoError('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Informations personnelles
      </Typography>

      {/* Photo Upload */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={personalInfo.photo}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          {photoLoading && (
            <CircularProgress
              size={120}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          )}
          {personalInfo.photo && !photoLoading && (
            <IconButton
              onClick={handlePhotoDelete}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'error.main',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': {
                  bgcolor: 'error.dark',
                },
              }}
              size="small"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            size="small"
            disabled={photoLoading}
          >
            {personalInfo.photo ? 'Changer la photo' : 'Ajouter une photo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            Max 5 MB - JPG, PNG, GIF
          </Typography>
        </Box>
        {photoError && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: 300, mx: 'auto' }}>
            {photoError}
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Prénom *"
            value={personalInfo.firstName}
            onChange={handleChange('firstName')}
            required
            slotProps={{
              inputLabel: {
                sx: {
                  '& .MuiFormLabel-asterisk': {
                    color: 'error.main',
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nom *"
            value={personalInfo.lastName}
            onChange={handleChange('lastName')}
            required
            slotProps={{
              inputLabel: {
                sx: {
                  '& .MuiFormLabel-asterisk': {
                    color: 'error.main',
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Titre du poste *"
            value={personalInfo.jobTitle}
            onChange={handleChange('jobTitle')}
            required
            placeholder="Ex: Développeur Full-Stack, Chef de projet..."
            slotProps={{
              inputLabel: {
                sx: {
                  '& .MuiFormLabel-asterisk': {
                    color: 'error.main',
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email *"
            type="email"
            value={personalInfo.email}
            onChange={handleChange('email')}
            required
            slotProps={{
              inputLabel: {
                sx: {
                  '& .MuiFormLabel-asterisk': {
                    color: 'error.main',
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Téléphone *"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
            required
            slotProps={{
              inputLabel: {
                sx: {
                  '& .MuiFormLabel-asterisk': {
                    color: 'error.main',
                  },
                },
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Adresse"
            value={personalInfo.address}
            onChange={handleChange('address')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Code postal"
            value={personalInfo.postalCode}
            onChange={handleChange('postalCode')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ville"
            value={personalInfo.city}
            onChange={handleChange('city')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Date de naissance"
            type="date"
            value={personalInfo.dateOfBirth || ''}
            onChange={handleChange('dateOfBirth')}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nationalité"
            value={personalInfo.nationality || ''}
            onChange={handleChange('nationality')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Permis de conduire"
            value={personalInfo.drivingLicense || ''}
            onChange={handleChange('drivingLicense')}
            placeholder="Ex: Permis B"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={personalInfo.linkedin || ''}
            onChange={handleChange('linkedin')}
            placeholder="https://linkedin.com/in/votre-profil"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Site web / Portfolio"
            value={personalInfo.website || ''}
            onChange={handleChange('website')}
            placeholder="https://votre-site.com"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
