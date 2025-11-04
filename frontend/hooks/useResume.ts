import { useState, useCallback, useEffect, useRef } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { Resume, SaveStatus } from '@/types/resume';
import { CVData } from '@/types/cv';
import { mapCVDataToResume, mapResumeToCVData } from '@/lib/services/resumeMapper';
import { trackCVExported, trackCVCreated } from '@/lib/analytics';

interface UseResumeOptions {
  autoSave?: boolean;
  autoSaveDelay?: number; // in milliseconds
}

interface UseResumeReturn {
  resumeId: string | null;
  saveStatus: SaveStatus;
  isLoading: boolean;
  error: string | null;
  isPaid: boolean;

  // Actions
  saveResume: (cvData: CVData, templateId?: string | null) => Promise<string | null>; // Returns resume ID
  loadResume: (id: string) => Promise<{ cvData: CVData; templateId: string | null; isPaid: boolean } | null>;
  deleteResume: (id: string) => Promise<void>;
  exportPDF: (id: string) => Promise<{ filename: string; resumeId: string; isPremium: boolean }>;
  clearResumeId: () => void; // Clear current resume ID to force creation of new resume
  duplicateResume: (id: string) => Promise<string | null>; // Duplicate a resume and return new ID

  // Auto-save
  scheduleAutoSave: (cvData: CVData, templateId?: string | null) => void;
  cancelAutoSave: () => void;
}

/**
 * Custom hook to manage resume operations with API
 *
 * BACKEND SESSION STRATEGY:
 * This hook uses Django sessions to support both authenticated and anonymous users:
 *
 * ANONYMOUS USERS (not logged in):
 * - CV data is saved to backend via API using Django session
 * - Session ID is automatically managed by Django (in cookies)
 * - Resume is linked to session_id in the database
 * - Data persists across page reloads for the same session
 *
 * AUTHENTICATED USERS (logged in):
 * - CV data is saved to backend via API
 * - Resume is linked to user account in the database
 * - Uses "create-once, update-always" pattern to prevent duplicate resumes
 * - Resume ID is stored in localStorage for session persistence
 * - On first save: Create a new resume via POST and store its ID
 * - On subsequent saves: Always use PATCH to update the existing resume
 *
 * MIGRATION ON LOGIN/SIGNUP:
 * - When a user logs in or signs up, any session-based CV data is automatically
 *   migrated to their account via a special backend endpoint
 * - The migration is triggered by the authentication flow
 * - The session resume is linked to the user account
 *
 * BEST PRACTICES IMPLEMENTED:
 * - Idempotent updates using PATCH (can be safely retried)
 * - Client-side deduplication via localStorage
 * - Debounced auto-save (configurable delay)
 * - Session persistence across page reloads
 * - Seamless transition from anonymous to authenticated mode
 */
export function useResume(options: UseResumeOptions = {}): UseResumeReturn {
  const { autoSave = true, autoSaveDelay = 3000 } = options;

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const resumeIdRef = useRef<string | null>(null); // Use ref to avoid stale closure issues

  /**
   * Save resume (create or update)
   * Returns the resume ID (useful for knowing what was created/updated)
   * Works for both authenticated users and anonymous users (using Django sessions)
   */
  const saveResume = useCallback(async (cvData: CVData, templateId?: string | null): Promise<string | null> => {
    try {
      setSaveStatus({ status: 'saving' });
      setError(null);

      // Map CVData to Resume format
      const resumeData = mapCVDataToResume(cvData, templateId);

      let savedResume: Resume;
      let finalResumeId: string | null = null;

      // IMPORTANT: Always check ref and localStorage first to prevent duplicate creation
      // Using ref instead of state to avoid stale closure issues with useCallback
      const existingResumeId = resumeIdRef.current || localStorage.getItem('currentResumeId');

      console.log('🔍 Save attempt - existingResumeId:', existingResumeId);
      console.log('🔍 resumeIdRef.current:', resumeIdRef.current);
      console.log('🔍 localStorage:', localStorage.getItem('currentResumeId'));

      if (existingResumeId) {
        // Update existing resume
        console.log('✏️ Updating existing resume:', existingResumeId);
        savedResume = await resumeApi.update(existingResumeId, resumeData);
        finalResumeId = existingResumeId;

        // Ensure ref is synced
        if (!resumeIdRef.current) {
          resumeIdRef.current = existingResumeId;
        }
      } else {
        // Create new resume (only on first save when no ID exists)
        // This works for both authenticated and anonymous users
        // Django will use session_id for anonymous users
        console.log('➕ Creating new resume');
        savedResume = await resumeApi.create(resumeData);
        // Convert ID to string if it's a number
        finalResumeId = savedResume.id ? String(savedResume.id) : null;

        console.log('✅ New resume created with ID:', finalResumeId);

        // Update both ref and state
        resumeIdRef.current = finalResumeId;
        setResumeId(finalResumeId);

        // Store resume ID in localStorage for session persistence
        if (finalResumeId) {
          localStorage.setItem('currentResumeId', finalResumeId);
        }

        // Track CV creation event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          const templateName = templateId || 'default';
          trackCVCreated(templateName);
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

      return finalResumeId;

    } catch (err: any) {
      console.error('❌ Error saving resume:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
      setSaveStatus({
        status: 'error',
        message: err.message || 'Erreur lors de la sauvegarde',
      });
      return null;
    }
  }, []); // Empty dependencies - we use refs instead

  /**
   * Load resume by ID
   * Works for both authenticated users and anonymous users (using Django sessions)
   */
  const loadResume = useCallback(async (id: string): Promise<{ cvData: CVData; templateId: string | null; isPaid: boolean } | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📥 Loading resume:', id);

      const resume = await resumeApi.getById(id);

      // Update both state and ref
      setResumeId(id);
      resumeIdRef.current = id;

      // Store resume ID in localStorage
      localStorage.setItem('currentResumeId', id);

      // Update isPaid status
      const resumeIsPaid = (resume as any).is_paid || (resume as any).isPaid || false;
      setIsPaid(resumeIsPaid);

      console.log('✅ Resume loaded and ID stored:', id, 'isPaid:', resumeIsPaid);

      // Map Resume to CVData
      const cvData = mapResumeToCVData(resume);

      // Update last saved data hash
      lastSavedDataRef.current = JSON.stringify(cvData);

      setIsLoading(false);
      return {
        cvData,
        // Handle both snake_case and camelCase from backend
        templateId: (resume as any).template || (resume as any).templateId || null,
        isPaid: resumeIsPaid,
      };

    } catch (err: any) {
      console.error('❌ Error loading resume:', err);
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

      // Clear resume ID from all places
      setResumeId(null);
      resumeIdRef.current = null;
      localStorage.removeItem('currentResumeId');

      setIsLoading(false);

    } catch (err: any) {
      console.error('❌ Error deleting resume:', err);
      setError(err.message || 'Erreur lors de la suppression');
      setIsLoading(false);
      throw err;
    }
  }, []);

  /**
   * Export resume to PDF
   * Downloads the PDF blob directly
   */
  const exportPDF = useCallback(async (id: string) => {
    try {
      setError(null);

      const result = await resumeApi.exportPdf(id);

      // Create object URL from blob
      const blobUrl = window.URL.createObjectURL(result.blob);

      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

      // Track CV export event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        trackCVExported('pdf');
      }

      return {
        filename: result.filename,
        resumeId: result.resumeId,
        isPremium: result.isPremium,
      };

    } catch (err: unknown) {
      console.error('Error exporting PDF:', err);

      // Handle payment required error specifically
      if (err && typeof err === 'object' && 'paymentRequired' in err) {
        const paymentError = err as {
          paymentRequired: boolean;
          message?: string;
          payment_options?: { per_cv: number; premium_unlimited: number };
        };

        const errorMessage = paymentError.message || 'Paiement requis pour exporter ce CV premium';
        setError(errorMessage);
        throw {
          paymentRequired: true,
          message: errorMessage,
          paymentOptions: paymentError.payment_options,
        };
      }

      // Generic error handling
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export PDF';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Schedule auto-save with debounce
   */
  const scheduleAutoSave = useCallback((cvData: CVData, templateId?: string | null) => {
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
   * Clear resume ID to force creation of new resume on next save
   * This clears both state, ref, and localStorage
   */
  const clearResumeId = useCallback(() => {
    console.log('🧹 Clearing resume ID from all locations');
    setResumeId(null);
    resumeIdRef.current = null;
    localStorage.removeItem('currentResumeId');
    setIsPaid(false);
    // Also clear last saved data to allow saving empty state
    lastSavedDataRef.current = '';
  }, []);

  /**
   * Duplicate a resume (create a copy without payment status)
   * Returns the new resume ID
   */
  const duplicateResume = useCallback(async (id: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📋 Duplicating resume:', id);

      // Load the existing resume
      const resume = await resumeApi.getById(id);

      // Create a copy without the ID and without payment status
      const duplicateData: Partial<Resume> = {
        ...resume,
        id: undefined,
        is_paid: false,
        isPaid: false,
        payment_type: 'free',
        paymentType: 'free',
      };

      // Create the new resume
      const newResume = await resumeApi.create(duplicateData);
      const newResumeId = newResume.id ? String(newResume.id) : null;

      console.log('✅ Resume duplicated with new ID:', newResumeId);

      // Update state with new resume ID
      setResumeId(newResumeId);
      resumeIdRef.current = newResumeId;
      setIsPaid(false);

      // Store new resume ID in localStorage
      if (newResumeId) {
        localStorage.setItem('currentResumeId', newResumeId);
      }

      setIsLoading(false);
      return newResumeId;

    } catch (err: any) {
      console.error('❌ Error duplicating resume:', err);
      setError(err.message || 'Erreur lors de la duplication');
      setIsLoading(false);
      return null;
    }
  }, []);

  /**
   * Load resume ID from localStorage on mount
   */
  useEffect(() => {
    const storedResumeId = localStorage.getItem('currentResumeId');
    if (storedResumeId) {
      console.log('🔄 Initializing resume ID from localStorage:', storedResumeId);
      setResumeId(storedResumeId);
      resumeIdRef.current = storedResumeId; // Keep ref in sync
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
    isPaid,

    saveResume,
    loadResume,
    deleteResume,
    exportPDF,
    clearResumeId,
    duplicateResume,

    scheduleAutoSave,
    cancelAutoSave,
  };
}
