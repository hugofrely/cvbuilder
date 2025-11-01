'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Add, Delete, Language, SportsEsports, Person } from '@mui/icons-material';
import { useCVContext } from '@/context/CVContext';
import { BuilderNavigation } from './BuilderStepper';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdditionalForm() {
  const {
    cvData,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addHobby,
    deleteHobby,
    addReference,
    updateReference,
    deleteReference,
  } = useCVContext();

  const [currentTab, setCurrentTab] = useState(0);

  // États pour les langues
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });

  // États pour les loisirs
  const [newHobby, setNewHobby] = useState('');

  // États pour les références
  const [isAddingReference, setIsAddingReference] = useState(false);
  const [newReference, setNewReference] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
  });

  const languageLevels = [
    'Débutant',
    'Intermédiaire',
    'Avancé',
    'Courant',
    'Langue maternelle',
  ];

  const handleAddLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      addLanguage({ ...newLanguage, id: Date.now().toString() });
      setNewLanguage({ name: '', level: '' });
      setIsAddingLanguage(false);
    }
  };

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      addHobby({ id: Date.now().toString(), name: newHobby });
      setNewHobby('');
    }
  };

  const handleAddReference = () => {
    if (newReference.name && newReference.email) {
      addReference({ ...newReference, id: Date.now().toString() });
      setNewReference({ name: '', company: '', position: '', email: '', phone: '' });
      setIsAddingReference(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Informations complémentaires
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<Language />} label="Langues" iconPosition="start" />
          <Tab icon={<SportsEsports />} label="Loisirs" iconPosition="start" />
          <Tab icon={<Person />} label="Références" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Onglet Langues */}
      <TabPanel value={currentTab} index={0}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {cvData.languages.map((lang) => (
            <Card key={lang.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {lang.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lang.level}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => deleteLanguage(lang.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {isAddingLanguage ? (
          <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Langue"
                  value={newLanguage.name}
                  onChange={(e) =>
                    setNewLanguage((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Anglais, Espagnol..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Niveau</InputLabel>
                  <Select
                    value={newLanguage.level}
                    label="Niveau"
                    onChange={(e) =>
                      setNewLanguage((prev) => ({ ...prev, level: e.target.value }))
                    }
                  >
                    {languageLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleAddLanguage}>
                Ajouter
              </Button>
              <Button variant="outlined" onClick={() => setIsAddingLanguage(false)}>
                Annuler
              </Button>
            </Box>
          </Card>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsAddingLanguage(true)}
            fullWidth
          >
            Ajouter une langue
          </Button>
        )}
      </TabPanel>

      {/* Onglet Loisirs */}
      <TabPanel value={currentTab} index={1}>
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {cvData.hobbies.map((hobby) => (
              <Chip
                key={hobby.id}
                label={hobby.name}
                onDelete={() => deleteHobby(hobby.id)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Ajouter un loisir"
            value={newHobby}
            onChange={(e) => setNewHobby(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddHobby();
              }
            }}
            placeholder="Ex: Photographie, Randonnée..."
          />
          <Button variant="contained" onClick={handleAddHobby} sx={{ minWidth: 100 }}>
            Ajouter
          </Button>
        </Box>
      </TabPanel>

      {/* Onglet Références */}
      <TabPanel value={currentTab} index={2}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {cvData.references.map((ref) => (
            <Card key={ref.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {ref.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {ref.position} chez {ref.company}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {ref.email} • {ref.phone}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => deleteReference(ref.id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {isAddingReference ? (
          <Card variant="outlined" sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  value={newReference.name}
                  onChange={(e) =>
                    setNewReference((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Entreprise"
                  value={newReference.company}
                  onChange={(e) =>
                    setNewReference((prev) => ({ ...prev, company: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Poste"
                  value={newReference.position}
                  onChange={(e) =>
                    setNewReference((prev) => ({ ...prev, position: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newReference.email}
                  onChange={(e) =>
                    setNewReference((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={newReference.phone}
                  onChange={(e) =>
                    setNewReference((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleAddReference}>
                Ajouter
              </Button>
              <Button variant="outlined" onClick={() => setIsAddingReference(false)}>
                Annuler
              </Button>
            </Box>
          </Card>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsAddingReference(true)}
            fullWidth
          >
            Ajouter une référence
          </Button>
        )}
      </TabPanel>

      <BuilderNavigation />
    </Box>
  );
}
