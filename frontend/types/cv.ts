export interface PersonalInfo {
  photo?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  jobTitle: string;
  dateOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: string;
  endDate: string;
  currentJob: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city: string;
  startDate: string;
  endDate: string;
  currentStudy: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  level: string; // Débutant, Intermédiaire, Avancé, Courant, Langue maternelle
}

export interface Hobby {
  id: string;
  name: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  hobbies: Hobby[];
  references: Reference[];
}

export type BuilderStep =
  | 'personal-info'
  | 'professional-summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'additional';

export interface StepConfig {
  id: BuilderStep;
  label: string;
  description: string;
  icon: React.ReactNode;
}
