import { useState, useCallback, useEffect, useRef } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { Resume, SaveStatus } from '@/types/resume';
import { CVData } from '@/types/cv';
import { mapCVDataToResume, mapResumeToCVData } from '@/lib/services/resumeMapper';

interface UseResumeOptions {
  autoSave?: boolean;
  autoSaveDelay?: number; // in milliseconds
}

interface UseResumeReturn {
  resumeId: string | null;
  saveStatus: SaveStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  saveResume: (cvData: CVData, templateId?: number | null) => Promise<void>;
  loadResume: (id: string) => Promise<{ cvData: CVData; templateId: number | null } | null>;
  deleteResume: (id: string) => Promise<void>;
  exportPDF: (id: string) => Promise<{ pdfUrl: string; hasWatermark: boolean; filename: string }>;

  // Auto-save
  scheduleAutoSave: (cvData: CVData, templateId?: number | null) => void;
  cancelAutoSave: () => void;
}

/**
 * Custom hook to manage resume operations with API
 */
export function useResume(options: UseResumeOptions = {}): UseResumeReturn {
  const { autoSave = true, autoSaveDelay = 3000 } = options;

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  /**
   * Save resume (create or update)
   */
  const saveResume = useCallback(async (cvData: CVData, templateId?: number | null) => {
    try {
      setSaveStatus({ status: 'saving' });
      setError(null);

      // Map CVData to Resume format
      const resumeData = mapCVDataToResume(cvData, templateId);

      let savedResume: Resume;

      if (resumeId) {
        // Update existing resume
        savedResume = await resumeApi.update(resumeId, resumeData);
      } else {
        // Create new resume
        savedResume = await resumeApi.create(resumeData);
        setResumeId(savedResume.id || null);

        // Store resume ID in localStorage for session persistence
        if (savedResume.id) {
          localStorage.setItem('currentResumeId', savedResume.id);
        }
      }

      // Update last saved data hash
      lastSavedDataRef.current = JSON.stringify(cvData);

      setSaveStatus({
        status: 'saved',
        message: 'CV sauvegardé avec succès',
      });

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus({ status: 'idle' });
      }, 3000);

    } catch (err: any) {
      console.error('Error saving resume:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
      setSaveStatus({
        status: 'error',
        message: err.message || 'Erreur lors de la sauvegarde',
      });
    }
  }, [resumeId]);

  /**
   * Load resume by ID
   */
  const loadResume = useCallback(async (id: string): Promise<{ cvData: CVData; templateId: number | null } | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const resume = await resumeApi.getById(id);
      setResumeId(id);

      // Store resume ID in localStorage
      localStorage.setItem('currentResumeId', id);

      // Map Resume to CVData
      const cvData = mapResumeToCVData(resume);

      // Update last saved data hash
      lastSavedDataRef.current = JSON.stringify(cvData);

      setIsLoading(false);
      return {
        cvData,
        // Handle both snake_case and camelCase from backend
        templateId: (resume as any).template || (resume as any).templateId || null,
      };

    } catch (err: any) {
      console.error('Error loading resume:', err);
      setError(err.message || 'Erreur lors du chargement');
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Delete resume
   */
  const deleteResume = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await resumeApi.delete(id);

      // Clear resume ID
      setResumeId(null);
      localStorage.removeItem('currentResumeId');

      setIsLoading(false);

    } catch (err: any) {
      console.error('Error deleting resume:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setIsLoading(false);
      throw err;
    }
  }, []);

  /**
   * Export resume to PDF
   */
  const exportPDF = useCallback(async (id: string) => {
    try {
      setError(null);

      const result = await resumeApi.exportPdf(id);

      // Download the PDF
      if (result.pdf_url) {
        const link = document.createElement('a');
        link.href = result.pdf_url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Convert snake_case to camelCase for return value
      return {
        pdfUrl: result.pdf_url,
        hasWatermark: result.has_watermark,
        filename: result.filename,
      };

    } catch (err: any) {
      console.error('Error exporting PDF:', err);
      setError(err.message || 'Erreur lors de l\'export PDF');
      throw err;
    }
  }, []);

  /**
   * Schedule auto-save with debounce
   */
  const scheduleAutoSave = useCallback((cvData: CVData, templateId?: number | null) => {
    if (!autoSave) return;

    // Cancel previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Check if data has actually changed
    const currentDataHash = JSON.stringify(cvData);
    if (currentDataHash === lastSavedDataRef.current) {
      return; // No changes, skip save
    }

    // Schedule new save
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveResume(cvData, templateId);
    }, autoSaveDelay);
  }, [autoSave, autoSaveDelay, saveResume]);

  /**
   * Cancel pending auto-save
   */
  const cancelAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = null;
    }
  }, []);

  /**
   * Load resume ID from localStorage on mount
   */
  useEffect(() => {
    const storedResumeId = localStorage.getItem('currentResumeId');
    if (storedResumeId) {
      setResumeId(storedResumeId);
    }
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cancelAutoSave();
    };
  }, [cancelAutoSave]);

  return {
    resumeId,
    saveStatus,
    isLoading,
    error,

    saveResume,
    loadResume,
    deleteResume,
    exportPDF,

    scheduleAutoSave,
    cancelAutoSave,
  };
}
