const { chromium } = require('playwright');
const path = require('path');

async function generateScreenshot() {
  console.log('🚀 Lancement du navigateur...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    console.log('📱 Navigation vers uncvpro.fr...');
    await page.goto('https://uncvpro.fr', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Attendre que la page soit complètement chargée
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(
      __dirname,
      '..',
      'frontend',
      'public',
      'screenshot.png'
    );

    console.log('📸 Capture du screenshot...');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false, // Seulement la partie visible (above the fold)
    });

    console.log(`✅ Screenshot sauvegardé : ${screenshotPath}`);
  } catch (error) {
    console.error('❌ Erreur lors de la génération du screenshot:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

generateScreenshot();
