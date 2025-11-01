'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  FolderOpen,
  MoreVert,
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
import ResumeSelector from '@/components/builder/ResumeSelector';
import { useResume } from '@/hooks/useResume';
import { useRouter } from 'next/navigation';
import { resumeApi } from '@/lib/api/resume';

function BuilderContent() {
  const { currentStep, cvData, loadCVData, saveStatus, setSaveStatus, selectedTemplateId, setSelectedTemplateId } = useCVContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [showPreview, setShowPreview] = useState(!isMobile);
  const [previewZoom, setPreviewZoom] = useState(85);
  const [mobileShowPreview, setMobileShowPreview] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [resumeSelectorOpen, setResumeSelectorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use resume hook
  const {
    resumeId,
    saveStatus: hookSaveStatus,
    error,
    saveResume,
    loadResume,
    exportPDF,
    scheduleAutoSave,
    clearResumeId,
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

  // Set template from URL parameter on mount
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const templateId = parseInt(templateParam, 10);
      if (!isNaN(templateId)) {
        setSelectedTemplateId(templateId);
      }
    }
  }, [searchParams, setSelectedTemplateId]);

  // Load existing resume on mount or show selector
  useEffect(() => {
    const initializeResume = async () => {
      // First check if there's a resumeId in the URL
      const urlResumeId = searchParams.get('resumeId');

      if (urlResumeId) {
        // Load resume from URL parameter
        const result = await loadResume(urlResumeId);
        if (result) {
          loadCVData(result.cvData);
          // Only set template from resume if no template param in URL
          if (result.templateId && !searchParams.get('template')) {
            setSelectedTemplateId(result.templateId);
          }
          // Store the resume ID for future use
          localStorage.setItem('currentResumeId', urlResumeId);
          return; // Successfully loaded, exit
        }
      }

      // If no URL param, check localStorage
      const storedResumeId = localStorage.getItem('currentResumeId');

      if (storedResumeId) {
        // Try to load the stored resume
        const result = await loadResume(storedResumeId);
        if (result) {
          loadCVData(result.cvData);
          // Only set template from resume if no template param in URL
          if (result.templateId && !searchParams.get('template')) {
            setSelectedTemplateId(result.templateId);
          }
          return; // Successfully loaded, exit
        }
        // If load failed, clear invalid ID
        localStorage.removeItem('currentResumeId');
      }

      // IMPROVED: Check if user has existing resumes before showing selector
      try {
        const existingResumes = await resumeApi.getAll();
        if (existingResumes && existingResumes.length > 0) {
          // User has existing CVs, show selector to choose
          setResumeSelectorOpen(true);
        } else {
          // No existing CVs - start fresh with empty CV (better UX for first-time users)
          // User can access their CVs later via "Mes CV" button
          console.log('No existing resumes found - starting with fresh CV');
        }
      } catch (error) {
        console.error('Error checking existing resumes:', error);
        // If error checking, just start with empty CV
      }
    };

    initializeResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const validateCV = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate required fields
    if (!cvData.personalInfo.firstName || !cvData.personalInfo.firstName.trim()) {
      errors.push('Le prénom est requis');
    }
    if (!cvData.personalInfo.lastName || !cvData.personalInfo.lastName.trim()) {
      errors.push('Le nom est requis');
    }
    if (!cvData.personalInfo.email || !cvData.personalInfo.email.trim()) {
      errors.push('L\'email est requis');
    }
    if (!cvData.personalInfo.phone || !cvData.personalInfo.phone.trim()) {
      errors.push('Le téléphone est requis');
    }
    if (!cvData.personalInfo.jobTitle || !cvData.personalInfo.jobTitle.trim()) {
      errors.push('Le titre du poste est requis');
    }

    // Recommend at least one section completed
    const hasExperience = cvData.experiences && cvData.experiences.length > 0;
    const hasEducation = cvData.education && cvData.education.length > 0;
    const hasSkills = cvData.skills && cvData.skills.length > 0;
    const hasSummary = cvData.professionalSummary && cvData.professionalSummary.trim();

    if (!hasExperience && !hasEducation && !hasSkills && !hasSummary) {
      errors.push('Ajoutez au moins une section (expérience, formation, compétences ou résumé professionnel) pour un CV complet');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleExportPDF = async () => {
    // Validate CV before export
    const validation = validateCV();
    if (!validation.isValid) {
      // Show validation errors
      const errorMessage = validation.errors.join('\n• ');
      alert(`⚠️ Veuillez compléter les informations suivantes :\n\n• ${errorMessage}`);
      return;
    }

    if (!resumeId) {
      await saveResume(cvData);
    }

    if (resumeId) {
      try {
        await exportPDF(resumeId);
      } catch (err: unknown) {
        console.error('Export error:', err);

        // Check if it's a payment required error
        if (err && typeof err === 'object' && 'paymentRequired' in err) {
          const paymentError = err as { paymentRequired: boolean; paymentOptions?: { per_cv: number } };

          // Redirect to payment page with plan and resume ID
          if (paymentError.paymentRequired) {
            router.push(`/payment?plan=pay-per-download&resumeId=${resumeId}`);
          }
        }
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

  const handleResumeSelect = async (resumeId: string) => {
    const result = await loadResume(resumeId);
    if (result) {
      loadCVData(result.cvData);
      if (result.templateId) {
        setSelectedTemplateId(result.templateId);
      }
    }
  };

  const handleCreateNewResume = () => {
    // IMPORTANT: Clear resume ID from all locations (state, ref, localStorage)
    // This ensures the next save will create a NEW resume instead of updating the old one
    clearResumeId();

    // Reset CV data to empty state
    loadCVData({
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        jobTitle: '',
        website: '',
        linkedin: '',
        github: '',
        dateOfBirth: '',
        nationality: '',
        drivingLicense: '',
      },
      professionalSummary: '',
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      hobbies: [],
      references: [],
    });

    // Reset template to default if needed
    const templateParam = searchParams.get('template');
    if (templateParam) {
      setSelectedTemplateId(parseInt(templateParam, 10));
    } else {
      setSelectedTemplateId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        display: 'flex',
        flexDirection: 'column',
        pt: { xs: 7, sm: 8 }, // Padding pour la NavBar
      }}
    >
      {/* Skip to main content link - WCAG 2.4.1 */}
      <Box
        component="a"
        href="#builder-main-content"
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          padding: '1rem',
          backgroundColor: 'primary.main',
          color: 'white',
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus': {
            left: '50%',
            top: '5rem',
            transform: 'translateX(-50%)',
          },
        }}
      >
        Aller au contenu principal
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        id="builder-main-content"
        sx={{ flex: 1, display: 'flex', overflow: 'hidden', pb: { xs: 10, md: 12 } }}
      >
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
          component="nav"
          role="toolbar"
          aria-label="Barre d'outils du créateur de CV"
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
                    role="group"
                    aria-label="Contrôles de zoom"
                  >
                    <Tooltip title="Zoom arrière">
                      <IconButton
                        size="small"
                        onClick={handleZoomOut}
                        disabled={previewZoom <= 30}
                        aria-label={`Zoom arrière, zoom actuel ${previewZoom}%`}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <ZoomOut fontSize="small" aria-hidden="true" />
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
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {previewZoom}%
                    </Typography>
                    <Tooltip title="Zoom avant">
                      <IconButton
                        size="small"
                        onClick={handleZoomIn}
                        disabled={previewZoom >= 200}
                        aria-label={`Zoom avant, zoom actuel ${previewZoom}%`}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                        }}
                      >
                        <ZoomIn fontSize="small" aria-hidden="true" />
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
                      startIcon={showPreview ? <Close aria-hidden="true" /> : <Visibility aria-hidden="true" />}
                      onClick={() => setShowPreview(!showPreview)}
                      aria-label={showPreview ? "Masquer l'aperçu du CV" : "Afficher l'aperçu du CV"}
                      aria-pressed={showPreview}
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
                    startIcon={mobileShowPreview ? <EditIcon aria-hidden="true" /> : <Visibility aria-hidden="true" />}
                    onClick={() => setMobileShowPreview(!mobileShowPreview)}
                    aria-label={mobileShowPreview ? "Retour au mode édition" : "Afficher l'aperçu du CV"}
                    aria-pressed={mobileShowPreview}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  >
                    {mobileShowPreview ? 'Éditer' : 'Aperçu'}
                  </Button>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Desktop: Full buttons */}
              {!isMobile && (
                <>
                  {/* My CVs Button */}
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<FolderOpen />}
                    onClick={() => setResumeSelectorOpen(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120,
                      px: 3,
                    }}
                  >
                    Mes CV
                  </Button>

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
                      minWidth: 120,
                      px: 3,
                    }}
                  >
                    Modèle
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
                      minWidth: 140,
                      px: 3,
                    }}
                  >
                    Sauvegarder
                  </Button>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Mobile: Menu + Download only */}
              {isMobile && (
                <>
                  <IconButton
                    onClick={(e) => setMobileMenuOpen(true)}
                    aria-label="Ouvrir le menu des actions"
                    aria-haspopup="true"
                    aria-expanded={mobileMenuOpen}
                    sx={{
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      borderRadius: 2,
                    }}
                  >
                    <MoreVert aria-hidden="true" />
                  </IconButton>

                  <Divider orientation="vertical" flexItem />
                </>
              )}

              {/* Download Button - Always visible */}
              <Button
                variant="contained"
                size="medium"
                startIcon={<Download aria-hidden="true" />}
                onClick={handleExportPDF}
                aria-label="Télécharger le CV en PDF"
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
                {isMobile ? 'PDF' : 'Télécharger'}
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

      {/* Resume Selector Dialog */}
      <ResumeSelector
        open={resumeSelectorOpen}
        onClose={() => setResumeSelectorOpen(false)}
        onSelect={handleResumeSelect}
        onCreateNew={handleCreateNewResume}
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
          role="status"
          aria-live="polite"
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
          role="status"
          aria-live="polite"
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
          role="alert"
          aria-live="assertive"
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
          role="alert"
          aria-live="assertive"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={null}
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: -8,
            width: 200,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setResumeSelectorOpen(true);
            setMobileMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <FolderOpen fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mes CV</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setTemplateSelectorOpen(true);
            setMobileMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <Palette fontSize="small" />
          </ListItemIcon>
          <ListItemText>Changer de modèle</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSave();
            setMobileMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <Save fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sauvegarder</ListItemText>
        </MenuItem>
      </Menu>
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
