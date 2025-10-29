import { useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/lib/stores/useResumeStore';
import { resumeApi } from '@/lib/api/resume';

export function useAutoSave(delay = 3000) {
  const { resume, setSaveStatus } = useResumeStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousResumeRef = useRef<typeof resume>(resume);

  const saveResume = useCallback(async () => {
    if (!resume) return;

    setSaveStatus({ status: 'saving' });

    try {
      if (resume.id) {
        // Update existing resume
        await resumeApi.update(resume.id, resume);
      } else {
        // Create new resume
        const newResume = await resumeApi.create(resume);
        useResumeStore.getState().setResume(newResume);
      }

      setSaveStatus({ status: 'saved' });

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus({ status: 'idle' });
      }, 3000);
    } catch (error) {
      console.error('Failed to save resume:', error);
      setSaveStatus({
        status: 'error',
        message: 'Échec de la sauvegarde',
      });
    }
  }, [resume, setSaveStatus]);

  useEffect(() => {
    // Check if resume has actually changed
    if (
      JSON.stringify(resume) === JSON.stringify(previousResumeRef.current)
    ) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveResume();
    }, delay);

    // Update previous resume reference
    previousResumeRef.current = resume;

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resume, delay, saveResume]);

  return { saveResume };
}
