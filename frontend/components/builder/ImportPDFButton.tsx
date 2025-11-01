'use client';

import React, { useState, useRef } from 'react';
import { Button, CircularProgress, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { parsePDFtoCV } from '@/lib/services/pdfParser';
import { CVData } from '@/types/cv';

interface ImportPDFButtonProps {
  onImportSuccess: (cvData: Partial<CVData>) => void;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function ImportPDFButton({
  onImportSuccess,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
}: ImportPDFButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est un PDF
    if (file.type !== 'application/pdf') {
      setError('Veuillez sélectionner un fichier PDF');
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    // Ouvrir le dialogue de confirmation
    setPendingFile(file);
    setConfirmDialogOpen(true);

    // Reset l'input pour permettre de resélectionner le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;

    setConfirmDialogOpen(false);
    setLoading(true);
    setError(null);

    try {
      const cvData = await parsePDFtoCV(pendingFile);

      // Vérifier qu'on a extrait au moins quelques données
      const hasData =
        cvData.personalInfo?.email ||
        cvData.personalInfo?.phone ||
        (cvData.experiences && cvData.experiences.length > 0) ||
        (cvData.education && cvData.education.length > 0);

      if (!hasData) {
        setError(
          'Impossible d\'extraire les données du PDF. Le format n\'est peut-être pas reconnu.'
        );
        setLoading(false);
        return;
      }

      // Appeler le callback avec les données extraites
      onImportSuccess(cvData);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de l\'import du PDF:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de l\'import du PDF'
      );
      setLoading(false);
    } finally {
      setPendingFile(null);
    }
  };

  const handleCancelImport = () => {
    setConfirmDialogOpen(false);
    setPendingFile(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleButtonClick}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
      >
        {loading ? 'Import en cours...' : 'Importer un CV PDF'}
      </Button>

      {/* Dialogue de confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelImport}
        aria-labelledby="import-dialog-title"
        aria-describedby="import-dialog-description"
      >
        <DialogTitle id="import-dialog-title">
          Importer un CV depuis un PDF
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="import-dialog-description">
            L&apos;import va analyser le PDF et extraire automatiquement les informations suivantes :
            <br /><br />
            • Informations personnelles (nom, email, téléphone, etc.)
            <br />
            • Résumé professionnel
            <br />
            • Expériences professionnelles
            <br />
            • Formation
            <br />
            • Compétences
            <br />
            • Langues
            <br /><br />
            <strong>Attention :</strong> Cette action va remplacer les données actuelles du CV.
            Voulez-vous continuer ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelImport} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleConfirmImport} variant="contained" autoFocus>
            Importer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les erreurs */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
