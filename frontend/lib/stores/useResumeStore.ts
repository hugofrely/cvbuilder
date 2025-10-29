import { create } from 'zustand';
import { Resume, SaveStatus } from '@/types/resume';

interface ResumeStore {
  resume: Resume | null;
  saveStatus: SaveStatus;
  selectedTemplateId: number;

  // Actions
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setSelectedTemplate: (templateId: number) => void;
  resetResume: () => void;
}

const defaultResume: Resume = {
  templateId: 1, // Default to free template
  fullName: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  linkedin: '',
  github: '',
  profilePhoto: '',
  title: '',
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  customSections: [],
  isPaid: false,
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: defaultResume,
  saveStatus: { status: 'idle' },
  selectedTemplateId: 1,

  setResume: (resume) => set({ resume }),

  updateResume: (updates) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, ...updates } : null,
    })),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  setSelectedTemplate: (templateId) =>
    set((state) => ({
      selectedTemplateId: templateId,
      resume: state.resume ? { ...state.resume, templateId } : null,
    })),

  resetResume: () =>
    set({
      resume: defaultResume,
      saveStatus: { status: 'idle' },
      selectedTemplateId: 1,
    }),
}));
