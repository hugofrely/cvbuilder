'use client';

import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  IconButton,
  Avatar,
  Button,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVContext();
  const { personalInfo } = cvData;

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updatePersonalInfo({ [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Informations personnelles
      </Typography>

      {/* Photo Upload */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Avatar
          src={personalInfo.photo}
          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          size="small"
        >
          Ajouter une photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  updatePersonalInfo({ photo: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Prénom"
            value={personalInfo.firstName}
            onChange={handleChange('firstName')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nom"
            value={personalInfo.lastName}
            onChange={handleChange('lastName')}
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Titre du poste"
            value={personalInfo.jobTitle}
            onChange={handleChange('jobTitle')}
            required
            placeholder="Ex: Développeur Full-Stack, Chef de projet..."
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
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Téléphone"
            value={personalInfo.phone}
            onChange={handleChange('phone')}
            required
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
