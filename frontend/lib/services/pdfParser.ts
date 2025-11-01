import * as pdfjsLib from 'pdfjs-dist';
import { CVData, PersonalInfo, Experience, Education, Skill, Language } from '@/types/cv';
import { v4 as uuidv4 } from 'uuid';

// Configuration du worker PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface ParsedPDFData {
  text: string;
  lines: string[];
}

/**
 * Extrait le texte brut d'un fichier PDF
 */
export async function extractTextFromPDF(file: File): Promise<ParsedPDFData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    const lines: string[] = [];

    // Extraire le texte de chaque page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n';

      // Ajouter les lignes individuelles
      textContent.items.forEach((item: any) => {
        if (item.str.trim()) {
          lines.push(item.str.trim());
        }
      });
    }

    return { text: fullText, lines };
  } catch (error) {
    console.error('Erreur lors de l\'extraction du PDF:', error);
    throw new Error('Impossible d\'extraire le texte du PDF');
  }
}

/**
 * Extrait les informations personnelles du texte
 */
function extractPersonalInfo(text: string, lines: string[]): PersonalInfo {
  const personalInfo: PersonalInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    jobTitle: '',
  };

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    personalInfo.email = emailMatch[0];
  }

  // Téléphone (formats français et internationaux)
  const phoneMatch = text.match(/(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}|(?:\+\d{1,3}[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}/);
  if (phoneMatch) {
    personalInfo.phone = phoneMatch[0].replace(/\s+/g, ' ').trim();
  }

  // Nom et prénom (généralement sur les premières lignes)
  // On suppose que le nom complet est sur une des 5 premières lignes
  const nameLine = lines.slice(0, 5).find(line => {
    const words = line.split(/\s+/);
    return words.length >= 2 && words.length <= 4 &&
           line.length < 50 &&
           !/[@\d]/.test(line) &&
           words.every(w => w.length > 1);
  });

  if (nameLine) {
    const names = nameLine.split(/\s+/);
    personalInfo.firstName = names[0];
    personalInfo.lastName = names.slice(1).join(' ');
  }

  // Titre professionnel (souvent après le nom)
  const titleKeywords = ['développeur', 'ingénieur', 'manager', 'consultant', 'analyste', 'designer', 'chef', 'responsable', 'directeur', 'developer', 'engineer', 'architect', 'lead'];
  const titleLine = lines.slice(0, 10).find(line =>
    titleKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  if (titleLine) {
    personalInfo.jobTitle = titleLine;
  }

  // Adresse et ville
  const addressMatch = text.match(/\d{1,5}\s+[\w\s]+,?\s+\d{5}\s+[\w\s]+/);
  if (addressMatch) {
    const parts = addressMatch[0].split(/\s+\d{5}\s+/);
    if (parts.length === 2) {
      personalInfo.address = parts[0].trim();
      personalInfo.city = parts[1].trim();
    }
  }

  // Code postal
  const postalMatch = text.match(/\b\d{5}\b/);
  if (postalMatch) {
    personalInfo.postalCode = postalMatch[0];
  }

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) {
    personalInfo.linkedin = linkedinMatch[0];
  }

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) {
    personalInfo.github = githubMatch[0];
  }

  return personalInfo;
}

/**
 * Extrait les expériences professionnelles
 */
function extractExperiences(text: string, lines: string[]): Experience[] {
  const experiences: Experience[] = [];

  // Recherche de sections expérience
  const experienceKeywords = ['expérience', 'experience', 'professionnel', 'professional', 'emploi', 'employment', 'parcours'];
  const experienceStartIndex = lines.findIndex(line =>
    experienceKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );

  if (experienceStartIndex === -1) return experiences;

  // Recherche de dates (formats: 2020-2023, 01/2020 - 12/2023, etc.)
  const datePattern = /(\d{2}\/\d{4}|\d{4})\s*[-–—]\s*(\d{2}\/\d{4}|\d{4}|présent|present|aujourd'hui|current)/gi;
  const matches = text.matchAll(datePattern);

  for (const match of matches) {
    const startDate = match[1];
    const endDate = match[2];
    const currentJob = /présent|present|aujourd'hui|current/i.test(endDate);

    // Essayer de trouver le titre du poste et l'entreprise autour de cette date
    const index = text.indexOf(match[0]);
    const contextBefore = text.substring(Math.max(0, index - 200), index);
    const contextAfter = text.substring(index, Math.min(text.length, index + 300));

    // Le titre est souvent juste avant ou après la date
    const titleMatch = contextBefore.match(/([A-ZÀ-Ÿ][a-zà-ÿ\s]+(?:Developer|Engineer|Manager|Consultant|Designer|Chef|Responsable|Développeur|Ingénieur))/);
    const companyMatch = contextAfter.match(/(?:chez|at|@)\s+([A-ZÀ-Ÿ][a-zà-ÿ\s&.]+)/);

    if (titleMatch || companyMatch) {
      experiences.push({
        id: uuidv4(),
        jobTitle: titleMatch ? titleMatch[1].trim() : 'Poste',
        employer: companyMatch ? companyMatch[1].trim() : 'Entreprise',
        city: '',
        startDate: formatDate(startDate),
        endDate: currentJob ? '' : formatDate(endDate),
        currentJob,
        description: extractDescription(contextAfter, 200),
      });
    }
  }

  return experiences;
}

/**
 * Extrait la formation
 */
function extractEducation(text: string, lines: string[]): Education[] {
  const education: Education[] = [];

  // Recherche de sections formation
  const educationKeywords = ['formation', 'education', 'diplôme', 'degree', 'études', 'studies', 'académique'];
  const educationStartIndex = lines.findIndex(line =>
    educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );

  if (educationStartIndex === -1) return education;

  // Recherche de diplômes courants
  const degreePattern = /(Master|Licence|Bachelor|MBA|Doctorat|PhD|BTS|DUT|Ingénieur|Engineer)/gi;
  const matches = text.matchAll(degreePattern);

  for (const match of matches) {
    const index = text.indexOf(match[0]);
    const contextAfter = text.substring(index, Math.min(text.length, index + 300));

    // Recherche de l'établissement
    const schoolMatch = contextAfter.match(/(?:à|at|@|-)\s+([A-ZÀ-Ÿ][a-zà-ÿ\s'.]+(?:Université|University|École|School|Institute|Institut))/);

    // Recherche de dates
    const dateMatch = contextAfter.match(/(\d{4})\s*[-–—]\s*(\d{4}|présent|present)/);

    education.push({
      id: uuidv4(),
      degree: match[0],
      school: schoolMatch ? schoolMatch[1].trim() : 'Établissement',
      city: '',
      startDate: dateMatch ? dateMatch[1] : '',
      endDate: dateMatch && !/(présent|present)/.test(dateMatch[2]) ? dateMatch[2] : '',
      currentStudy: dateMatch ? /(présent|present)/.test(dateMatch[2]) : false,
      description: '',
    });
  }

  return education;
}

/**
 * Extrait les compétences
 */
function extractSkills(text: string): Skill[] {
  const skills: Skill[] = [];

  // Liste de compétences techniques courantes
  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Git', 'CI/CD', 'Agile', 'Scrum',
    'HTML', 'CSS', 'Sass', 'Tailwind',
  ];

  commonSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(text)) {
      skills.push({
        id: uuidv4(),
        name: skill,
        level: 3, // Niveau par défaut
      });
    }
  });

  return skills;
}

/**
 * Extrait les langues
 */
function extractLanguages(text: string): Language[] {
  const languages: Language[] = [];

  const languagePatterns = [
    { name: 'Français', pattern: /français|french/i },
    { name: 'Anglais', pattern: /anglais|english/i },
    { name: 'Espagnol', pattern: /espagnol|spanish/i },
    { name: 'Allemand', pattern: /allemand|german/i },
    { name: 'Italien', pattern: /italien|italian/i },
    { name: 'Portugais', pattern: /portugais|portuguese/i },
    { name: 'Chinois', pattern: /chinois|chinese|mandarin/i },
    { name: 'Japonais', pattern: /japonais|japanese/i },
    { name: 'Arabe', pattern: /arabe|arabic/i },
  ];

  languagePatterns.forEach(({ name, pattern }) => {
    if (pattern.test(text)) {
      // Essayer de trouver le niveau
      const context = text.match(new RegExp(`${name}[^.]*`, 'i'));
      let level = 'Intermédiaire';

      if (context) {
        const contextStr = context[0].toLowerCase();
        if (/natif|native|maternelle|mother tongue/i.test(contextStr)) {
          level = 'Langue maternelle';
        } else if (/courant|fluent|bilingue|bilingual/i.test(contextStr)) {
          level = 'Courant';
        } else if (/avancé|advanced|c1|c2/i.test(contextStr)) {
          level = 'Avancé';
        } else if (/débutant|beginner|a1|a2/i.test(contextStr)) {
          level = 'Débutant';
        }
      }

      languages.push({
        id: uuidv4(),
        name,
        level,
      });
    }
  });

  return languages;
}

/**
 * Extrait un résumé professionnel
 */
function extractProfessionalSummary(text: string, lines: string[]): string {
  const summaryKeywords = ['profil', 'profile', 'résumé', 'summary', 'à propos', 'about', 'objectif', 'objective'];

  const summaryIndex = lines.findIndex(line =>
    summaryKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );

  if (summaryIndex !== -1 && summaryIndex < lines.length - 1) {
    // Prendre les 3-5 lignes suivantes comme résumé
    return lines.slice(summaryIndex + 1, summaryIndex + 6)
      .filter(line => line.length > 20)
      .join(' ')
      .substring(0, 500);
  }

  return '';
}

/**
 * Utilitaire pour formater les dates
 */
function formatDate(dateStr: string): string {
  // Convertir en format YYYY-MM si possible
  if (/^\d{4}$/.test(dateStr)) {
    return dateStr + '-01';
  }
  if (/^\d{2}\/\d{4}$/.test(dateStr)) {
    const [month, year] = dateStr.split('/');
    return `${year}-${month}`;
  }
  return dateStr;
}

/**
 * Extrait une description à partir d'un contexte
 */
function extractDescription(context: string, maxLength: number): string {
  const sentences = context.match(/[^.!?]+[.!?]+/g) || [];
  let description = '';

  for (const sentence of sentences) {
    if (description.length + sentence.length > maxLength) break;
    description += sentence;
  }

  return description.trim();
}

/**
 * Parse un fichier PDF et retourne des données CV structurées
 */
export async function parsePDFtoCV(file: File): Promise<Partial<CVData>> {
  const { text, lines } = await extractTextFromPDF(file);

  const cvData: Partial<CVData> = {
    personalInfo: extractPersonalInfo(text, lines),
    professionalSummary: extractProfessionalSummary(text, lines),
    experiences: extractExperiences(text, lines),
    education: extractEducation(text, lines),
    skills: extractSkills(text),
    languages: extractLanguages(text),
    hobbies: [],
    references: [],
  };

  return cvData;
}
