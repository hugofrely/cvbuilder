'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
  Divider,
  alpha,
} from '@mui/material';
import {
  Visibility,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Palette,
  Edit as EditIcon,
  Close,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [showPreview, setShowPreview] = useState(!isMobile);
  const [previewZoom, setPreviewZoom] = useState(75);
  const [mobileShowPreview, setMobileShowPreview] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  // Use resume hook
  const {
    resumeId,
    saveStatus: hookSaveStatus,
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

  // Update preview visibility on screen size change
  useEffect(() => {
    setShowPreview(!isMobile);
  }, [isMobile]);

  const handleZoomIn = () => {
    setPreviewZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setPreviewZoom((prev) => Math.max(prev - 10, 30));
  };

  const handleExportPDF = async () => {
    if (!resumeId) {
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
    setSelectedTemplateId(templateId);
    await saveResume(cvData, templateId);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Contenu principal */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', pb: { xs: 10, md: 12 } }}>
        {/* Mode Desktop : Layout côte à côte */}
        {!isMobile ? (
          <>
            {/* Panneau d'édition */}
            <Box
              sx={{
                width: showPreview ? '50%' : '100%',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  px: { xs: 2, sm: 3, md: 4 },
                  py: 4,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '4px',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.3),
                    },
                  },
                }}
              >
                <Container maxWidth="md" sx={{ px: 0 }}>
                  <BuilderStepper />
                  <Fade in timeout={300}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 3, sm: 4 },
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 3,
                        bgcolor: 'white',
                        boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}`,
                      }}
                    >
                      {renderStepContent()}
                    </Paper>
                  </Fade>
                </Container>
              </Box>
            </Box>

            {/* Panneau de prévisualisation */}
            <Fade in={showPreview} timeout={300}>
              <Box
                sx={{
                  width: showPreview ? '50%' : 0,
                  bgcolor: alpha(theme.palette.grey[100], 0.4),
                  borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  display: showPreview ? 'flex' : 'none',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    py: 4,
                    px: 2,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      bgcolor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      borderRadius: '4px',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      transform: `scale(${previewZoom / 100})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <CVPreview />
                  </Box>
                </Box>
              </Box>
            </Fade>
          </>
        ) : (
          /* Mode Mobile */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!mobileShowPreview ? (
              /* Formulaire sur mobile */
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  px: 2,
                  py: 3,
                  pb: 12,
                }}
              >
                <BuilderStepper />
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
                  }}
                >
                  {renderStepContent()}
                </Paper>
              </Box>
            ) : (
              /* Preview sur mobile */
              <Box
                sx={{
                  flex: 1,
                  bgcolor: alpha(theme.palette.grey[100], 0.4),
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  p: 2,
                  pb: 12,
                }}
              >
                <Box
                  sx={{
                    transform: 'scale(0.4)',
                    transformOrigin: 'top center',
                  }}
                >
                  <CVPreview />
                </Box>
              </Box>
            )}

          </Box>
        )}
      </Box>

      {/* Toolbar fixe en bas */}
      <Fade in timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'white',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 -4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            zIndex: 1100,
            py: { xs: 1.5, md: 2 },
            px: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth={false}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1, md: 2 },
                flexWrap: 'wrap',
              }}
            >
              {/* Zoom Controls */}
              {!isMobile && showPreview && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 1,
                      bgcolor: alpha(theme.palette.grey[100], 0.5),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Tooltip title="Zoom arrière">
                      <IconButton
                        size="small"
                        onClick={handleZoomOut}
                        disabled={previewZoom <= 30}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <ZoomOut fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 50,
                        textAlign: 'center',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {previewZoom}%
                    </Typography>
                    <Tooltip title="Zoom avant">
                      <IconButton
                        size="small"
                        onClick={handleZoomIn}
                        disabled={previewZoom >= 200}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <ZoomIn fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Toggle Preview (Desktop) */}
              {!isMobile && (
                <>
                  <Tooltip title={showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}>
                    <Button
                      variant={showPreview ? 'contained' : 'outlined'}
                      size="medium"
                      startIcon={showPreview ? <Close /> : <Visibility />}
                      onClick={() => setShowPreview(!showPreview)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        minWidth: 140,
                      }}
                    >
                      {showPreview ? 'Masquer' : 'Aperçu'}
                    </Button>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Toggle Preview (Mobile) */}
              {isMobile && (
                <>
                  <Button
                    variant={mobileShowPreview ? 'outlined' : 'contained'}
                    size="medium"
                    startIcon={mobileShowPreview ? <EditIcon /> : <Visibility />}
                    onClick={() => setMobileShowPreview(!mobileShowPreview)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    {mobileShowPreview ? 'Modifier' : 'Aperçu'}
                  </Button>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Template Button */}
              <Button
                variant="outlined"
                size="medium"
                startIcon={<Palette />}
                onClick={() => setTemplateSelectorOpen(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', md: 120 },
                  px: { xs: 2, md: 3 },
                }}
              >
                {isMobile ? 'Modèle' : 'Modèle'}
              </Button>

              {/* Save Button */}
              <Button
                variant="outlined"
                size="medium"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', md: 140 },
                  px: { xs: 2, md: 3 },
                }}
              >
                Sauvegarder
              </Button>

              <Divider orientation="vertical" flexItem />

              {/* Download Button */}
              <Button
                variant="contained"
                size="medium"
                startIcon={<Download />}
                onClick={handleExportPDF}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: { xs: 'auto', md: 150 },
                  px: { xs: 2, md: 3 },
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 5,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Télécharger
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>

      {/* Template Selector Dialog */}
      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
        onSelect={handleTemplateSelect}
        currentTemplateId={selectedTemplateId}
      />

      {/* Saving Snackbar */}
      <Snackbar
        open={saveStatus.status === 'saving'}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{
            minWidth: 200,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          Sauvegarde en cours...
        </Alert>
      </Snackbar>

      {/* Saved Snackbar */}
      <Snackbar
        open={saveStatus.status === 'saved'}
        autoHideDuration={2000}
        onClose={() => setSaveStatus({ status: 'idle' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            minWidth: 200,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          Sauvegardé avec succès !
        </Alert>
      </Snackbar>

      {/* Save Error Snackbar */}
      <Snackbar
        open={saveStatus.status === 'error'}
        autoHideDuration={4000}
        onClose={() => setSaveStatus({ status: 'idle' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            minWidth: 200,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {saveStatus.message || 'Erreur de sauvegarde'}
        </Alert>
      </Snackbar>

      {/* General Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
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
