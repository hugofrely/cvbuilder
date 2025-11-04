const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function convertLogo() {
  console.log('🚀 Lancement du navigateur...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 512, height: 512 },
    deviceScaleFactor: 2, // Pour une meilleure qualité
  });
  const page = await context.newPage();

  try {
    const svgPath = path.join(__dirname, '..', 'frontend', 'public', 'logo.svg');
    const pngPath = path.join(__dirname, '..', 'frontend', 'public', 'logo.png');

    // Lire le SVG
    console.log('📖 Lecture du logo SVG...');
    const svgContent = fs.readFileSync(svgPath, 'utf-8');

    // Créer une page HTML avec le SVG centré sur fond blanc
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 512px;
              height: 512px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
            }
            svg {
              max-width: 400px;
              max-height: 400px;
            }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    console.log('🎨 Conversion SVG vers PNG...');
    await page.setContent(html);
    await page.waitForTimeout(500);

    await page.screenshot({
      path: pngPath,
      omitBackground: false,
    });

    console.log(`✅ Logo PNG sauvegardé : ${pngPath}`);
  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

convertLogo();
