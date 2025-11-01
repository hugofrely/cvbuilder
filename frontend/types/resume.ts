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
  session_id?: string; // Backend format
  sessionId?: string;
  user?: string; // Backend format (user ID)
  userId?: string;
  template?: string | null; // Backend format (UUID)
  templateId?: string | null;

  // Personal Information
  full_name?: string; // Backend format
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string; // Backend format
  postalCode?: string;
  website?: string;
  linkedin_url?: string; // Backend format
  linkedin?: string;
  github_url?: string; // Backend format
  github?: string;
  photo?: string; // Backend format
  profilePhoto?: string;
  date_of_birth?: string; // Backend format
  dateOfBirth?: string;
  nationality?: string;
  driving_license?: string; // Backend format
  drivingLicense?: string;

  // Professional Summary
  title?: string;
  summary?: string;

  // JSON Sections (backend format)
  experience_data?: any[]; // Backend format
  education_data?: any[]; // Backend format
  skills_data?: any[]; // Backend format
  languages_data?: any[]; // Backend format
  certifications_data?: any[]; // Backend format
  projects_data?: any[]; // Backend format
  custom_sections?: any[]; // Backend format

  // Sections (frontend format)
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  projects?: Project[];
  customSections?: CustomSection[];

  // Payment & Status
  is_paid?: boolean; // Backend format
  isPaid?: boolean;
  payment_type?: 'free' | 'single' | 'subscription'; // Backend format
  paymentType?: 'free' | 'single' | 'subscription';

  // Metadata
  created_at?: string; // Backend format
  createdAt?: string;
  updated_at?: string; // Backend format
  updatedAt?: string;
  last_accessed?: string; // Backend format
  lastAccessed?: string;
}

export interface Template {
  id?: string | null; // Changed to string (UUID)
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
