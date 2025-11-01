'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CVData, BuilderStep } from '@/types/cv';
import { SaveStatus } from '@/types/resume';
import { useAuthStore } from '@/lib/stores/useAuthStore';

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (data: Partial<CVData['personalInfo']>) => void;
  updateProfessionalSummary: (summary: string) => void;
  addExperience: (experience: CVData['experiences'][0]) => void;
  updateExperience: (id: string, experience: Partial<CVData['experiences'][0]>) => void;
  deleteExperience: (id: string) => void;
  reorderExperiences: (newExperiences: CVData['experiences']) => void;
  addEducation: (education: CVData['education'][0]) => void;
  updateEducation: (id: string, education: Partial<CVData['education'][0]>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (newEducation: CVData['education']) => void;
  addSkill: (skill: CVData['skills'][0]) => void;
  updateSkill: (id: string, skill: Partial<CVData['skills'][0]>) => void;
  deleteSkill: (id: string) => void;
  addLanguage: (language: CVData['languages'][0]) => void;
  updateLanguage: (id: string, language: Partial<CVData['languages'][0]>) => void;
  deleteLanguage: (id: string) => void;
  addHobby: (hobby: CVData['hobbies'][0]) => void;
  deleteHobby: (id: string) => void;
  addReference: (reference: CVData['references'][0]) => void;
  updateReference: (id: string, reference: Partial<CVData['references'][0]>) => void;
  deleteReference: (id: string) => void;
  currentStep: BuilderStep;
  setCurrentStep: (step: BuilderStep) => void;

  // Resume management
  loadCVData: (data: CVData) => void;
  resetCVData: () => void;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  triggerAutoSave: () => void;

  // Template management
  selectedTemplateId: string | null;
  setSelectedTemplateId: (templateId: string | null) => void;

  // Payment status
  isPaidResume: boolean;
  setIsPaidResume: (isPaid: boolean) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const initialCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    jobTitle: '',
  },
  professionalSummary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  references: [],
};

export function CVProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [currentStep, setCurrentStep] = useState<BuilderStep>('personal-info');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: 'idle' });
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isPaidResume, setIsPaidResume] = useState(false);

  // Reset CV data when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear currentResumeId from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentResumeId');
      }
      // Reset CV data to initial state
      setCVData(initialCVData);
      setCurrentStep('personal-info');
      setSaveStatus({ status: 'idle' });
      setSelectedTemplateId(null);
      setIsPaidResume(false);
    }
  }, [isAuthenticated]);

  // Trigger auto-save on data change
  const triggerAutoSave = () => {
    setAutoSaveTrigger((prev) => prev + 1);
  };

  // Load CV data from external source
  const loadCVData = (data: CVData) => {
    setCVData(data);
  };

  // Reset CV data to initial state
  const resetCVData = () => {
    setCVData(initialCVData);
    setCurrentStep('personal-info');
    setSaveStatus({ status: 'idle' });
    setSelectedTemplateId(null);
    setIsPaidResume(false);
  };

  const updatePersonalInfo = (data: Partial<CVData['personalInfo']>) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
    triggerAutoSave();
  };

  const updateProfessionalSummary = (summary: string) => {
    setCVData((prev) => ({ ...prev, professionalSummary: summary }));
    triggerAutoSave();
  };

  const addExperience = (experience: CVData['experiences'][0]) => {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, experience],
    }));
    triggerAutoSave();
  };

  const updateExperience = (id: string, experience: Partial<CVData['experiences'][0]>) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
    triggerAutoSave();
  };

  const deleteExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
    triggerAutoSave();
  };

  const reorderExperiences = (newExperiences: CVData['experiences']) => {
    setCVData((prev) => ({
      ...prev,
      experiences: newExperiences,
    }));
    triggerAutoSave();
  };

  const addEducation = (education: CVData['education'][0]) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
    triggerAutoSave();
  };

  const updateEducation = (id: string, education: Partial<CVData['education'][0]>) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
    triggerAutoSave();
  };

  const deleteEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
    triggerAutoSave();
  };

  const reorderEducation = (newEducation: CVData['education']) => {
    setCVData((prev) => ({
      ...prev,
      education: newEducation,
    }));
    triggerAutoSave();
  };

  const addSkill = (skill: CVData['skills'][0]) => {
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    triggerAutoSave();
  };

  const updateSkill = (id: string, skill: Partial<CVData['skills'][0]>) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
    }));
    triggerAutoSave();
  };

  const deleteSkill = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
    triggerAutoSave();
  };

  const addLanguage = (language: CVData['languages'][0]) => {
    setCVData((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));
    triggerAutoSave();
  };

  const updateLanguage = (id: string, language: Partial<CVData['languages'][0]>) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, ...language } : lang
      ),
    }));
    triggerAutoSave();
  };

  const deleteLanguage = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }));
    triggerAutoSave();
  };

  const addHobby = (hobby: CVData['hobbies'][0]) => {
    setCVData((prev) => ({
      ...prev,
      hobbies: [...prev.hobbies, hobby],
    }));
    triggerAutoSave();
  };

  const deleteHobby = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h.id !== id),
    }));
    triggerAutoSave();
  };

  const addReference = (reference: CVData['references'][0]) => {
    setCVData((prev) => ({
      ...prev,
      references: [...prev.references, reference],
    }));
    triggerAutoSave();
  };

  const updateReference = (id: string, reference: Partial<CVData['references'][0]>) => {
    setCVData((prev) => ({
      ...prev,
      references: prev.references.map((ref) =>
        ref.id === id ? { ...ref, ...reference } : ref
      ),
    }));
    triggerAutoSave();
  };

  const deleteReference = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      references: prev.references.filter((ref) => ref.id !== id),
    }));
    triggerAutoSave();
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        updateProfessionalSummary,
        addExperience,
        updateExperience,
        deleteExperience,
        reorderExperiences,
        addEducation,
        updateEducation,
        deleteEducation,
        reorderEducation,
        addSkill,
        updateSkill,
        deleteSkill,
        addLanguage,
        updateLanguage,
        deleteLanguage,
        addHobby,
        deleteHobby,
        addReference,
        updateReference,
        deleteReference,
        currentStep,
        setCurrentStep,

        // Resume management
        loadCVData,
        resetCVData,
        saveStatus,
        setSaveStatus,
        triggerAutoSave,

        // Template management
        selectedTemplateId,
        setSelectedTemplateId,

        // Payment status
        isPaidResume,
        setIsPaidResume,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCVContext() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVContext must be used within a CVProvider');
  }
  return context;
}
