/**
 * Script to generate screenshots for all CV templates in the database
 *
 * This script:
 * 1. Fetches all templates from the Django backend
 * 2. Fills each template with fake data
 * 3. Renders the template using Puppeteer
 * 4. Takes a screenshot and saves it
 *
 * Usage:
 *   node scripts/generate-template-screenshots.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');

// Django backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const OUTPUT_DIR = path.join(__dirname, '../backend/media/templates');

// Fake data to fill templates
const FAKE_CV_DATA = {
  full_name: 'Jean Dupont',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de la Paix',
  city: 'Paris',
  postal_code: '75001',
  website: 'https://jeandupont.fr',
  linkedin_url: 'https://linkedin.com/in/jeandupont',
  github_url: 'https://github.com/jeandupont',
  date_of_birth: '1990-05-15',
  nationality: 'Française',
  driving_license: 'Permis B',
  title: 'Développeur Full Stack Senior',
  summary: 'Développeur passionné avec plus de 8 ans d\'expérience dans le développement d\'applications web modernes. Expert en React, Node.js et Python. Capacité démontrée à diriger des équipes techniques et à livrer des projets complexes dans les délais impartis.',

  experience_data: [
    {
      position: 'Lead Developer',
      company: 'TechCorp SAS',
      location: 'Paris, France',
      start_date: '2020-03',
      end_date: '',
      is_current: true,
      description: '• Direction technique d\'une équipe de 5 développeurs\n• Architecture et développement d\'une plateforme SaaS (React, Node.js, PostgreSQL)\n• Mise en place de CI/CD et bonnes pratiques DevOps\n• Amélioration des performances de 40%'
    },
    {
      position: 'Développeur Full Stack',
      company: 'StartupLab',
      location: 'Lyon, France',
      start_date: '2017-06',
      end_date: '2020-02',
      is_current: false,
      description: '• Développement de features front-end avec React et Redux\n• Création d\'APIs RESTful avec Node.js et Express\n• Intégration de services tiers (Stripe, SendGrid)\n• Participation active aux code reviews'
    },
    {
      position: 'Développeur Junior',
      company: 'WebAgency',
      location: 'Marseille, France',
      start_date: '2015-09',
      end_date: '2017-05',
      is_current: false,
      description: '• Développement de sites web responsive\n• Maintenance et évolution d\'applications existantes\n• Collaboration avec les équipes design et marketing'
    }
  ],

  education_data: [
    {
      degree: 'Master en Informatique',
      institution: 'Université Paris-Saclay',
      field_of_study: 'Génie Logiciel',
      location: 'Paris, France',
      start_date: '2013-09',
      end_date: '2015-06',
      is_current: false,
      grade: 'Mention Bien',
      description: 'Spécialisation en développement web et architecture logicielle'
    },
    {
      degree: 'Licence en Informatique',
      institution: 'Université de Lyon',
      field_of_study: 'Informatique',
      location: 'Lyon, France',
      start_date: '2010-09',
      end_date: '2013-06',
      is_current: false,
      grade: 'Mention Assez Bien',
      description: 'Fondamentaux en programmation et systèmes'
    }
  ],

  skills_data: [
    { name: 'JavaScript / TypeScript', level: 'expert', level_percentage: 95 },
    { name: 'React / Next.js', level: 'expert', level_percentage: 90 },
    { name: 'Node.js / Express', level: 'advanced', level_percentage: 85 },
    { name: 'Python / Django', level: 'advanced', level_percentage: 80 },
    { name: 'PostgreSQL / MongoDB', level: 'advanced', level_percentage: 80 },
    { name: 'Docker / Kubernetes', level: 'intermediate', level_percentage: 70 },
    { name: 'AWS / GCP', level: 'intermediate', level_percentage: 65 },
    { name: 'Git / CI/CD', level: 'advanced', level_percentage: 85 }
  ],

  languages_data: [
    { name: 'Français', level: 'Langue maternelle' },
    { name: 'Anglais', level: 'Courant (C1)' },
    { name: 'Espagnol', level: 'Intermédiaire (B1)' }
  ],

  certifications_data: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-03'
    },
    {
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: '2021-11'
    }
  ],

  projects_data: [
    {
      name: 'Plateforme E-commerce',
      description: 'Développement d\'une plateforme e-commerce complète avec gestion des stocks et paiements',
      technologies: 'React, Node.js, PostgreSQL, Stripe',
      url: 'https://github.com/jeandupont/ecommerce'
    }
  ],

  custom_sections: [
    {
      title: 'Centres d\'intérêt',
      content: 'Développement open source, Photographie, Randonnée, Échecs'
    }
  ]
};

// Initialize Handlebars helpers (same as in templateRenderer.ts)
function initializeHandlebars() {
  Handlebars.registerHelper('percentage', function(level, max = 5) {
    return (level / max) * 100;
  });

  Handlebars.registerHelper('hasItems', function(array) {
    return array && array.length > 0;
  });

  Handlebars.registerHelper('nl2br', function(text) {
    if (!text) return '';
    return new Handlebars.SafeString(text.replace(/\n/g, '<br>'));
  });

  Handlebars.registerHelper('preserveWhitespace', function(text) {
    if (!text) return '';
    return new Handlebars.SafeString(
      `<span style="white-space: pre-wrap;">${text}</span>`
    );
  });

  Handlebars.registerHelper('substr', function(str, start, length) {
    if (!str) return '';
    if (length !== undefined) {
      return str.substr(start, length);
    }
    return str.substr(start);
  });

  Handlebars.registerHelper('first', function(str, n) {
    if (!str) return '';
    return str.substring(0, n);
  });

  Handlebars.registerHelper('last', function(str, n) {
    if (!str) return '';
    return str.substring(str.length - n);
  });

  Handlebars.registerHelper('year', function(dateStr) {
    if (!dateStr) return '';
    const match = dateStr.match(/(\d{4})/);
    return match ? match[1] : dateStr;
  });

  // Register helper for equality comparison
  Handlebars.registerHelper('equal', function(a, b) {
    return a === b;
  });
}

// Convert Django template syntax to Handlebars
function convertDjangoToHandlebars(templateString) {
  let converted = templateString;
  const loopVars = {};

  // Convert Python slice syntax
  converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[:(\d+)\]\}\}/g, '{{first $1 $2}}');
  converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[(\d+):\]\}\}/g, '{{substr $1 $2}}');
  converted = converted.replace(/\{\{(\w+(?:\.\w+)?)\[-(\d+):\]\}\}/g, '{{last $1 $2}}');

  // Convert Django control structures
  converted = converted.replace(/\{%\s*if\s+(\w+)\s*%\}/g, '{{#if $1}}');
  converted = converted.replace(/\{%\s*endif\s*%\}/g, '{{/if}}');

  converted = converted.replace(/\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}/g, (match, itemVar, listVar) => {
    loopVars[itemVar] = listVar;
    return `{{#each ${listVar}}}`;
  });
  converted = converted.replace(/\{%\s*endfor\s*%\}/g, '{{/each}}');

  // Convert loop variable references
  for (const [itemVar, listVar] of Object.entries(loopVars)) {
    const sliceRegex1 = new RegExp(`\\{\\{${itemVar}\\.(\\w+)\\[:(\\d+)\\]\\}\\}`, 'g');
    converted = converted.replace(sliceRegex1, '{{first this.$1 $2}}');

    const varRegex = new RegExp(`\\{\\{\\s*${itemVar}\\.(\\w+)\\s*\\}\\}`, 'g');
    converted = converted.replace(varRegex, '{{this.$1}}');

    const simpleVarRegex = new RegExp(`\\{\\{\\s*${itemVar}\\s*\\}\\}`, 'g');
    converted = converted.replace(simpleVarRegex, '{{this}}');
  }

  return converted;
}

// Fetch all templates from Django backend
async function fetchTemplates() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/templates/?page=2`);
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

// Fetch a single template with full details (including HTML and CSS)
async function fetchTemplateDetails(templateId) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/templates/${templateId}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch template ${templateId}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching template ${templateId}:`, error);
    throw error;
  }
}

// Generate screenshot for a template
async function generateScreenshot(template, browser) {
  console.log(`\nGenerating screenshot for template: ${template.name}`);

  try {
    // Fetch full template details (including HTML and CSS)
    console.log(`  Fetching template details...`);
    const templateDetails = await fetchTemplateDetails(template.id);

    if (!templateDetails.template_html) {
      throw new Error('Template HTML not found');
    }

    // Convert Django template to Handlebars
    const handlebarsTemplate = convertDjangoToHandlebars(templateDetails.template_html);
    const compiledTemplate = Handlebars.compile(handlebarsTemplate);

    // Render with fake data
    const renderedHtml = compiledTemplate(FAKE_CV_DATA);

    // Create full HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html {
              width: 210mm;
            }

            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            /* Template CSS */
            ${templateDetails.template_css || ''}
          </style>
        </head>
        <body>
          ${renderedHtml}
        </body>
      </html>
    `;

    // Create a new page
    const page = await browser.newPage();

    // Set viewport to A4 size (210mm x 297mm at 96 DPI)
    await page.setViewport({
      width: 794,  // 210mm in pixels
      height: 1123, // 297mm in pixels
      deviceScaleFactor: 2, // For high quality
    });

    // Set content
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0'
    });

    // Generate filename
    const filename = `${template.id}-${template.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Take screenshot
    await page.screenshot({
      path: filepath,
      fullPage: false, // Only first page
      type: 'png',
    });

    console.log(`✓ Screenshot saved: ${filename}`);

    await page.close();

    return {
      templateId: template.id,
      templateName: template.name,
      filename: filename,
      filepath: filepath,
      success: true
    };

  } catch (error) {
    console.error(`✗ Error generating screenshot for ${template.name}:`, error.message);
    return {
      templateId: template.id,
      templateName: template.name,
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  console.log('=== CV Template Screenshot Generator ===\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Initialize Handlebars
  initializeHandlebars();

  // Ensure output directory exists
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log('✓ Output directory ready\n');
  } catch (error) {
    console.error('Error creating output directory:', error);
    process.exit(1);
  }

  // Fetch templates
  console.log('Fetching templates from backend...');
  let templates;
  try {
    templates = await fetchTemplates();
    console.log(`✓ Found ${templates.length} templates\n`);
  } catch (error) {
    console.error('Failed to fetch templates. Make sure the Django backend is running.');
    process.exit(1);
  }

  if (templates.length === 0) {
    console.log('No templates found in database.');
    process.exit(0);
  }

  // Launch browser
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log('✓ Browser launched\n');

  // Generate screenshots
  const results = [];
  for (const template of templates) {
    const result = await generateScreenshot(template, browser);
    results.push(result);
  }

  // Close browser
  await browser.close();
  console.log('\n✓ Browser closed\n');

  // Summary
  console.log('=== Summary ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total templates: ${templates.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}\n`);

  if (failed > 0) {
    console.log('Failed templates:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.templateName}: ${r.error}`);
    });
  }

  console.log('\n✓ Done!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
