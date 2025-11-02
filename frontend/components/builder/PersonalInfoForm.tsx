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
import { BuilderNavigation } from './BuilderStepper';

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { personalInfo } = cvData;
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo({ [field]: event.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      // Get current resume ID from localStorage
      const resumeId = localStorage.getItem('currentResumeId');

      if (!resumeId) {
        setPhotoError('Impossible de trouver le CV. Veuillez recharger la page.');
        setPhotoLoading(false);
        return;
      }

      // Upload photo to backend
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/upload_photo/`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de l\'upload de la photo');
      }

      const data = await response.json();

      // Update local state with the photo URL from server
      updatePersonalInfo({ photo: data.photo_url });
      setPhotoLoading(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setPhotoError(error instanceof Error ? error.message : 'Erreur lors de l\'upload de la photo');
      setPhotoLoading(false);
    }
  };

  const handlePhotoDelete = async () => {
    setPhotoLoading(true);
    setPhotoError('');

    try {
      // Get current resume ID from localStorage
      const resumeId = localStorage.getItem('currentResumeId');

      if (!resumeId) {
        setPhotoError('Impossible de trouver le CV. Veuillez recharger la page.');
        setPhotoLoading(false);
        return;
      }

      // Delete photo from backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}/delete_photo/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la suppression de la photo');
      }

      // Update local state
      updatePersonalInfo({ photo: '' });
      setPhotoLoading(false);
    } catch (error) {
      console.error('Error deleting photo:', error);
      setPhotoError(error instanceof Error ? error.message : 'Erreur lors de la suppression de la photo');
      setPhotoLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Informations personnelles
      </Typography>

      {/* Photo Upload */}
      <Box sx={{ mb: 4, textAlign: 'center' }} role="group" aria-label="Photo de profil">
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={personalInfo.photo}
            sx={{ width: 120, height: 120, mb: 2 }}
            alt={personalInfo.photo ? `Photo de profil de ${personalInfo.firstName} ${personalInfo.lastName}` : 'Photo de profil non définie'}
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
              aria-label="Chargement de la photo en cours"
            />
          )}
          {personalInfo.photo && !photoLoading && (
            <IconButton
              onClick={handlePhotoDelete}
              aria-label="Supprimer la photo de profil"
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
              <Delete fontSize="small" aria-hidden="true" />
            </IconButton>
          )}
        </Box>
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera aria-hidden="true" />}
            size="small"
            disabled={photoLoading}
            aria-label={personalInfo.photo ? 'Changer la photo de profil' : 'Ajouter une photo de profil'}
          >
            {personalInfo.photo ? 'Changer la photo' : 'Ajouter une photo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoUpload}
              aria-label="Sélectionner un fichier image"
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

      <Grid container spacing={3} component="form" aria-label="Formulaire d'informations personnelles">
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Prénom"
            value={personalInfo.firstName}
            onChange={handleChange('firstName')}
            required
            aria-required="true"
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
            label="Nom"
            value={personalInfo.lastName}
            onChange={handleChange('lastName')}
            required
            aria-required="true"
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
            label="Titre du poste"
            value={personalInfo.jobTitle}
            onChange={handleChange('jobTitle')}
            required
            aria-required="true"
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
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={handleChange('email')}
            required
            aria-required="true"
            inputProps={{
              'aria-label': 'Adresse e-mail',
            }}
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
            label="Téléphone"
            type="tel"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
            required
            aria-required="true"
            inputProps={{
              'aria-label': 'Numéro de téléphone',
            }}
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

      <BuilderNavigation />
    </Box>
  );
}
