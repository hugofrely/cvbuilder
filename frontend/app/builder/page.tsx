'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  IconButton,
  Drawer,
  Button,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Menu as MenuIcon,
  CheckCircle,
  Palette,
} from '@mui/icons-material';
import { CVProvider, useCVContext } from '@/context/CVContext';
import BuilderStepper from '@/components/builder/BuilderStepper';
import PersonalInfoForm from '@/components/builder/PersonalInfoForm';
import ProfessionalSummaryForm from '@/components/builder/ProfessionalSummaryForm';
import ExperienceForm from '@/components/builder/ExperienceForm';
import EducationForm from '@/components/builder/EducationForm';
import SkillsForm from '@/components/builder/SkillsForm';
import AdditionalForm from '@/components/builder/AdditionalForm';
import CVPreview from '@/components/builder/CVPreview';
import TemplateSelector from '@/components/builder/TemplateSelector';
import { useResume } from '@/hooks/useResume';

function BuilderContent() {
  const { currentStep, cvData, loadCVData, saveStatus, setSaveStatus, selectedTemplateId, setSelectedTemplateId } = useCVContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showPreview, setShowPreview] = useState(!isMobile);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileShowPreview, setMobileShowPreview] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  // Use resume hook
  const {
    resumeId,
    saveStatus: hookSaveStatus,
    isLoading,
    error,
    saveResume,
    loadResume,
    exportPDF,
    scheduleAutoSave,
  } = useResume({ autoSave: true, autoSaveDelay: 3000 });

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal-info':
        return <PersonalInfoForm />;
      case 'professional-summary':
        return <ProfessionalSummaryForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'additional':
        return <AdditionalForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  // Load existing resume on mount
  useEffect(() => {
    const loadExistingResume = async () => {
      const storedResumeId = localStorage.getItem('currentResumeId');
      if (storedResumeId) {
        const result = await loadResume(storedResumeId);
        if (result) {
          loadCVData(result.cvData);
          // Charger le template ID depuis le backend
          if (result.templateId) {
            setSelectedTemplateId(result.templateId);
          }
        }
      }
    };

    loadExistingResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save when CV data or template changes
  useEffect(() => {
    scheduleAutoSave(cvData, selectedTemplateId);
  }, [cvData, selectedTemplateId, scheduleAutoSave]);

  // Sync save status from hook to context
  useEffect(() => {
    setSaveStatus(hookSaveStatus);
  }, [hookSaveStatus, setSaveStatus]);

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleExportPDF = async () => {
    if (!resumeId) {
      // Save first if no resume ID
      await saveResume(cvData);
    }

    if (resumeId) {
      try {
        await exportPDF(resumeId);
      } catch (err) {
        console.error('Export error:', err);
      }
    }
  };

  const handleSave = async () => {
    await saveResume(cvData, selectedTemplateId);
  };

  const handleTemplateSelect = async (templateId: number) => {
    // Update context avec le nouveau template
    setSelectedTemplateId(templateId);
    // Save with new template
    await saveResume(cvData, templateId);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Barre d'outils supérieure */}
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Création de CV
          </Typography>

          {/* Save status indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, flexGrow: 1 }}>
            {saveStatus.status === 'saving' && (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Sauvegarde...
                </Typography>
              </>
            )}
            {saveStatus.status === 'saved' && (
              <>
                <CheckCircle color="success" sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  Sauvegardé
                </Typography>
              </>
            )}
            {saveStatus.status === 'error' && (
              <Typography variant="body2" color="error">
                {saveStatus.message || 'Erreur de sauvegarde'}
              </Typography>
            )}
          </Box>

          {!isMobile && (
            <>
              <Tooltip title="Zoom -">
                <IconButton onClick={handleZoomOut} disabled={previewZoom <= 50}>
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ mx: 1, minWidth: 50, textAlign: 'center' }}>
                {previewZoom}%
              </Typography>
              <Tooltip title="Zoom +">
                <IconButton onClick={handleZoomIn} disabled={previewZoom >= 150}>
                  <ZoomIn />
                </IconButton>
              </Tooltip>

              <Tooltip title={showPreview ? 'Masquer l\'aperçu' : 'Afficher l\'aperçu'}>
                <IconButton onClick={() => setShowPreview(!showPreview)} sx={{ ml: 1 }}>
                  {showPreview ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                startIcon={<Palette />}
                onClick={() => setTemplateSelectorOpen(true)}
                sx={{ ml: 2 }}
              >
                Template
              </Button>

              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ ml: 1 }}
              >
                Sauvegarder
              </Button>
            </>
          )}

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportPDF}
            sx={{ ml: 2 }}
          >
            Télécharger
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 'calc(100vh - 64px)' }}>
        {/* Panneau de formulaire - Desktop */}
        {!isMobile && (
          <Box
            sx={{
              width: showPreview ? '45%' : '100%',
              p: 4,
              overflowY: 'auto',
              height: 'calc(100vh - 64px)',
              transition: 'width 0.3s ease',
            }}
          >
            <Container maxWidth="md">
              <BuilderStepper />
              <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider' }}>
                {renderStepContent()}
              </Paper>
            </Container>
          </Box>
        )}

        {/* Mobile - Affichage formulaire ou preview */}
        {isMobile && (
          <Box sx={{ width: '100%', p: 2, overflowY: 'auto', pb: 10 }}>
            {!mobileShowPreview ? (
              // Formulaire sur mobile
              <Box>
                <BuilderStepper />
                <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                  {renderStepContent()}
                </Paper>
              </Box>
            ) : (
              // Preview sur mobile
              <Box sx={{ bgcolor: 'grey.200', p: 1, borderRadius: 2 }}>
                <Box
                  sx={{
                    transform: 'scale(0.85)',
                    transformOrigin: 'top center',
                  }}
                >
                  <CVPreview />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Panneau de prévisualisation - Desktop */}
        {!isMobile && showPreview && (
          <Box
            sx={{
              width: '55%',
              bgcolor: 'grey.200',
              p: 4,
              overflowY: 'auto',
              height: 'calc(100vh - 64px)',
              borderLeft: 1,
              borderColor: 'divider',
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease',
              }}
            >
              <CVPreview />
            </Box>
          </Box>
        )}

        {/* Bouton flottant pour basculer entre formulaire et preview sur mobile */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              startIcon={mobileShowPreview ? <MenuIcon /> : <Visibility />}
              onClick={() => setMobileShowPreview(!mobileShowPreview)}
              size="large"
              sx={{
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              {mobileShowPreview ? 'Modifier' : 'Aperçu'}
            </Button>
          </Box>
        )}
      </Box>

      {/* Template Selector Dialog */}
      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
        onSelect={handleTemplateSelect}
        currentTemplateId={selectedTemplateId}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function BuilderPage() {
  return (
    <CVProvider>
      <BuilderContent />
    </CVProvider>
  );
}
