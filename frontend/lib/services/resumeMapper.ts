import { CVData } from '@/types/cv';
import { Resume } from '@/types/resume';

/**
 * Maps frontend CVData to backend Resume format
 * Uses snake_case for Django backend
 */
export function mapCVDataToResume(cvData: CVData, templateId?: number | null): any {
  return {
    template: templateId || null,

    // Personal Information (snake_case for Django)
    full_name: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim() || '',
    email: cvData.personalInfo.email || '',
    phone: cvData.personalInfo.phone || '',
    address: cvData.personalInfo.address || '',
    city: cvData.personalInfo.city || '',
    postal_code: cvData.personalInfo.postalCode || '',
    website: cvData.personalInfo.website || '',
    linkedin_url: cvData.personalInfo.linkedin || '',
    github_url: '', // Not in current CVData
    photo: cvData.personalInfo.photo || '',
    date_of_birth: cvData.personalInfo.dateOfBirth || null,
    nationality: cvData.personalInfo.nationality || '',
    driving_license: cvData.personalInfo.drivingLicense || '',

    // Professional Summary
    title: cvData.personalInfo.jobTitle || '',
    summary: cvData.professionalSummary || '',

    // JSON fields for experiences, education, skills, etc.
    experience_data: cvData.experiences.map(exp => ({
      position: exp.jobTitle,
      company: exp.employer,
      location: exp.city || '',
      start_date: exp.startDate,
      end_date: exp.currentJob ? '' : exp.endDate,
      is_current: exp.currentJob,
      description: exp.description || '',
      work_mode: exp.workMode || '',
    })),

    education_data: cvData.education.map(edu => ({
      degree: edu.degree,
      institution: edu.school,
      field_of_study: '', // Not in current CVData
      location: edu.city || '',
      start_date: edu.startDate,
      end_date: edu.currentStudy ? '' : edu.endDate,
      is_current: edu.currentStudy,
      grade: '', // Not in current CVData
      description: edu.description || '',
      work_mode: edu.workMode || '',
    })),

    skills_data: cvData.skills.map(skill => ({
      name: skill.name,
      level: mapSkillLevelToBackend(skill.level),
      category: '', // Not in current CVData
    })),

    languages_data: cvData.languages.map(lang => ({
      name: lang.name,
      level: mapLanguageLevelToBackend(lang.level),
    })),

    certifications_data: [],
    projects_data: [],

    custom_sections: [
      ...(cvData.hobbies.length > 0 ? [{
        title: 'Centres d\'intérêt',
        content: cvData.hobbies.map(h => h.name).join(', '),
      }] : []),
      ...(cvData.references.length > 0 ? [{
        title: 'Références',
        content: cvData.references.map(ref =>
          `${ref.name} - ${ref.position} chez ${ref.company}\n${ref.email} | ${ref.phone}`
        ).join('\n\n'),
      }] : []),
    ],
  };
}

/**
 * Maps backend Resume to frontend CVData format
 */
export function mapResumeToCVData(resume: any): CVData {
  // Split full name into first and last name
  const fullName = resume.full_name || resume.fullName || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    personalInfo: {
      photo: resume.photo || resume.profilePhoto,
      firstName: firstName,
      lastName: lastName,
      email: resume.email,
      phone: resume.phone || '',
      address: resume.address || '',
      city: resume.city || '',
      postalCode: resume.postal_code || resume.postalCode || '',
      jobTitle: resume.title || '',
      dateOfBirth: resume.date_of_birth || resume.dateOfBirth,
      nationality: resume.nationality,
      drivingLicense: resume.driving_license || resume.drivingLicense,
      linkedin: resume.linkedin_url || resume.linkedin,
      website: resume.website,
    },

    professionalSummary: resume.summary || '',

    // Map experiences from backend to frontend
    experiences: resume.experiences.map(exp => ({
      id: exp.id?.toString() || Date.now().toString(),
      jobTitle: exp.position,
      employer: exp.company,
      city: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      currentJob: exp.isCurrent,
      description: exp.description || '',
      workMode: exp.work_mode || exp.workMode,
    })),

    // Map education from backend to frontend
    education: resume.education.map(edu => ({
      id: edu.id?.toString() || Date.now().toString(),
      degree: edu.degree,
      school: edu.institution,
      city: edu.location || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      currentStudy: edu.isCurrent,
      description: edu.description || '',
      workMode: edu.work_mode || edu.workMode,
    })),

    // Map skills from backend to frontend
    skills: resume.skills.map(skill => ({
      id: skill.id?.toString() || Date.now().toString(),
      name: skill.name,
      level: mapSkillLevelToFrontend(skill.level),
    })),

    // Map languages from backend to frontend
    languages: resume.languages.map(lang => ({
      id: lang.id?.toString() || Date.now().toString(),
      name: lang.name,
      level: mapLanguageLevelToFrontend(lang.level),
    })),

    // Extract hobbies and references from custom sections
    hobbies: extractHobbies(resume.customSections),
    references: extractReferences(resume.customSections),
  };
}

/**
 * Helper: Map skill level (frontend number to backend string)
 */
function mapSkillLevelToBackend(level: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (level <= 1) return 'beginner';
  if (level <= 2) return 'intermediate';
  if (level <= 4) return 'advanced';
  return 'expert';
}

/**
 * Helper: Map skill level (backend string to frontend number)
 */
function mapSkillLevelToFrontend(level: string): number {
  switch (level) {
    case 'beginner': return 1;
    case 'intermediate': return 2;
    case 'advanced': return 4;
    case 'expert': return 5;
    default: return 2;
  }
}

/**
 * Helper: Map language level (frontend string to backend string)
 */
function mapLanguageLevelToBackend(
  level: string
): 'beginner' | 'intermediate' | 'fluent' | 'bilingual' | 'native' {
  const mapping: Record<string, 'beginner' | 'intermediate' | 'fluent' | 'bilingual' | 'native'> = {
    'Débutant': 'beginner',
    'Intermédiaire': 'intermediate',
    'Avancé': 'fluent',
    'Courant': 'fluent',
    'Bilingue': 'bilingual',
    'Langue maternelle': 'native',
  };
  return mapping[level] || 'intermediate';
}

/**
 * Helper: Map language level (backend string to frontend string)
 */
function mapLanguageLevelToFrontend(level: string): string {
  const mapping: Record<string, string> = {
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'fluent': 'Courant',
    'bilingual': 'Bilingue',
    'native': 'Langue maternelle',
  };
  return mapping[level] || 'Intermédiaire';
}

/**
 * Helper: Extract hobbies from custom sections
 */
function extractHobbies(customSections: Resume['customSections']): CVData['hobbies'] {
  const hobbiesSection = customSections.find(
    section => section.title === 'Centres d\'intérêt'
  );

  if (!hobbiesSection) return [];

  return hobbiesSection.content.split(',').map((hobby, index) => ({
    id: `hobby-${index}`,
    name: hobby.trim(),
  }));
}

/**
 * Helper: Extract references from custom sections
 */
function extractReferences(customSections: Resume['customSections']): CVData['references'] {
  const referencesSection = customSections.find(
    section => section.title === 'Références'
  );

  if (!referencesSection) return [];

  // Parse reference entries (simplified parsing)
  const referenceBlocks = referencesSection.content.split('\n\n');

  return referenceBlocks.map((block, index) => {
    const lines = block.split('\n');
    const [nameAndPosition, contact] = lines;

    const [name, position, company] = nameAndPosition.split(' - ').map(s => s.trim());
    const [email, phone] = contact ? contact.split(' | ').map(s => s.trim()) : ['', ''];

    return {
      id: `ref-${index}`,
      name: name || '',
      company: company || '',
      position: position || '',
      email: email || '',
      phone: phone || '',
    };
  });
}
