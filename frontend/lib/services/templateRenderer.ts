import { CVData } from '@/types/cv';
import Handlebars from 'handlebars';

/**
 * Template engine using Handlebars to render templates client-side
 * Supports: {{variable}}, {{#if}}, {{#each}}, etc.
 */
export class TemplateRenderer {
  private static isInitialized = false;

  /**
   * Initialize Handlebars helpers
   */
  private static initializeHelpers() {
    if (this.isInitialized) return;

    // Register custom helper for level percentage
    Handlebars.registerHelper('percentage', function(level: number, max: number = 5) {
      return (level / max) * 100;
    });

    // Register helper to check if array has items
    Handlebars.registerHelper('hasItems', function(array: any[]) {
      return array && array.length > 0;
    });

    // Register helper for newlines to <br>
    Handlebars.registerHelper('nl2br', function(text: string) {
      if (!text) return '';
      return new Handlebars.SafeString(
        text.replace(/\n/g, '<br>')
      );
    });

    // Register helper to preserve whitespace (for descriptions with line breaks)
    Handlebars.registerHelper('preserveWhitespace', function(text: string) {
      if (!text) return '';
      return new Handlebars.SafeString(
        `<span style="white-space: pre-wrap;">${text}</span>`
      );
    });

    // Register helper to get substring (like Python slice [:4])
    Handlebars.registerHelper('substr', function(str: string, start: number, length?: number) {
      if (!str) return '';
      if (length !== undefined) {
        return str.substr(start, length);
      }
      return str.substr(start);
    });

    // Register helper to get first N characters
    Handlebars.registerHelper('first', function(str: string, n: number) {
      if (!str) return '';
      return str.substring(0, n);
    });

    // Register helper to get last N characters
    Handlebars.registerHelper('last', function(str: string, n: number) {
      if (!str) return '';
      return str.substring(str.length - n);
    });

    // Register helper to format date (extract year)
    Handlebars.registerHelper('year', function(dateStr: string) {
      if (!dateStr) return '';
      // Try to extract year from various date formats
      const match = dateStr.match(/(\d{4})/);
      return match ? match[1] : dateStr;
    });

    this.isInitialized = true;
  }

  /**
   * Convert Django template syntax to Handlebars syntax
   */
  private static convertDjangoToHandlebars(templateString: string): string {
    let converted = templateString;

    // Store the loop variable names to convert them inside loops
    const loopVars: { [key: string]: string } = {};

    // Convert Python slice syntax to Handlebars helpers
    // {{variable[:4]}} -> {{first variable 4}}
    converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[:(\d+)\]\}\}/g, '{{first $1 $2}}');

    // {{variable[4:]}} -> {{substr variable 4}}
    converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[(\d+):\]\}\}/g, '{{substr $1 $2}}');

    // {{variable[-4:]}} -> {{last variable 4}}
    converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[-(\d+):\]\}\}/g, '{{last $1 $2}}');

    // Convert {% if variable %} to {{#if variable}}
    converted = converted.replace(/\{%\s*if\s+(\w+)\s*%\}/g, '{{#if $1}}');

    // Convert {% endif %} to {{/if}}
    converted = converted.replace(/\{%\s*endif\s*%\}/g, '{{/if}}');

    // Convert {% for item in list %} to {{#each list}}
    // and store the item variable name
    converted = converted.replace(/\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}/g, (match, itemVar, listVar) => {
      loopVars[itemVar] = listVar;
      return `{{#each ${listVar}}}`;
    });

    // Convert {% endfor %} to {{/each}}
    converted = converted.replace(/\{%\s*endfor\s*%\}/g, '{{/each}}');

    // Convert loop variable references (e.g., {{skill.name}} to {{this.name}})
    // This needs to be done for each loop variable
    for (const [itemVar, listVar] of Object.entries(loopVars)) {
      // First, handle Python slice syntax for loop variables
      // {{itemVar.property[:4]}} -> {{first this.property 4}}
      const sliceRegex1 = new RegExp(`\\{\\{${itemVar}\\.(\\w+)\\[:(\\d+)\\]\\}\\}`, 'g');
      converted = converted.replace(sliceRegex1, '{{first this.$1 $2}}');

      // Match {{itemVar.property}} and convert to {{this.property}}
      const varRegex = new RegExp(`\\{\\{\\s*${itemVar}\\.(\\w+)\\s*\\}\\}`, 'g');
      converted = converted.replace(varRegex, '{{this.$1}}');

      // Also match just {{itemVar}} and convert to {{this}}
      const simpleVarRegex = new RegExp(`\\{\\{\\s*${itemVar}\\s*\\}\\}`, 'g');
      converted = converted.replace(simpleVarRegex, '{{this}}');
    }

    return converted;
  }

  /**
   * Render a template string with context data
   */
  static render(templateString: string, context: any): string {
    this.initializeHelpers();

    try {
      // Convert Django syntax to Handlebars syntax
      const handlebarsTemplate = this.convertDjangoToHandlebars(templateString);

      // Compile the template
      const template = Handlebars.compile(handlebarsTemplate);

      // Render with context
      return template(context);
    } catch (error) {
      console.error('Error rendering template:', error);
      throw error;
    }
  }

  /**
   * Convert CVData to template context
   */
  static cvDataToContext(cvData: CVData): any {
    return {
      full_name: `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`.trim(),
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      address: cvData.personalInfo.address,
      city: cvData.personalInfo.city,
      postal_code: cvData.personalInfo.postalCode,
      website: cvData.personalInfo.website,
      linkedin_url: cvData.personalInfo.linkedin,
      photo: cvData.personalInfo.photo,
      date_of_birth: cvData.personalInfo.dateOfBirth,
      nationality: cvData.personalInfo.nationality,
      driving_license: cvData.personalInfo.drivingLicense,
      title: cvData.personalInfo.jobTitle,
      summary: cvData.professionalSummary,

      experience_data: cvData.experiences.map(exp => ({
        position: exp.jobTitle,
        company: exp.employer,
        location: exp.city,
        start_date: exp.startDate,
        end_date: exp.currentJob ? '' : exp.endDate,
        is_current: exp.currentJob,
        description: exp.description,
      })),

      education_data: cvData.education.map(edu => ({
        degree: edu.degree,
        institution: edu.school,
        location: edu.city,
        start_date: edu.startDate,
        end_date: edu.currentStudy ? '' : edu.endDate,
        is_current: edu.currentStudy,
        description: edu.description,
      })),

      skills_data: cvData.skills.map(skill => ({
        name: skill.name,
        level: this.mapSkillLevel(skill.level),
        level_percentage: (skill.level / 5) * 100,
      })),

      languages_data: cvData.languages.map(lang => ({
        name: lang.name,
        level: lang.level,
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
   * Map skill level from number to string
   */
  private static mapSkillLevel(level: number): string {
    if (level <= 1) return 'beginner';
    if (level <= 2) return 'intermediate';
    if (level <= 4) return 'advanced';
    return 'expert';
  }
}
