export interface Experience {
  id?: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface Language {
  id?: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'fluent' | 'bilingual' | 'native';
}

export interface Certification {
  id?: string;
  name: string;
  organization: string;
  date: string;
  verificationUrl?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string;
  url?: string;
}

export interface CustomSection {
  id?: string;
  title: string;
  content: string;
}

export interface Resume {
  id?: string;
  sessionId?: string;
  userId?: string;
  templateId: number;

  // Personal Information
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  nationality?: string;
  drivingLicense?: string;

  // Professional Summary
  title?: string;
  summary?: string;

  // Sections
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  customSections: CustomSection[];

  // Payment & Status
  isPaid: boolean;
  paymentType?: 'single' | 'monthly' | 'yearly';

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id?: number;
  name: string;
  isPremium?: boolean;
  is_premium?: boolean; // Backend format
  thumbnail?: string | null;
  thumbnailUrl?: string; // Deprecated - use thumbnail
  description: string;
  templateHtml?: string;
  template_html?: string; // Backend format
  templateCss?: string;
  template_css?: string; // Backend format
  isActive?: boolean;
  is_active?: boolean; // Backend format
  createdAt?: string;
  created_at?: string; // Backend format
}

export interface SaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  message?: string;
}
