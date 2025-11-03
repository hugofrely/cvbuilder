"""
PDF Generation Service using Playwright

This service uses Playwright to render HTML templates with JavaScript
and generate PDF files from them.
"""

import asyncio
import json
from typing import Dict, Any, Optional
from playwright.async_api import async_playwright
import logging

logger = logging.getLogger(__name__)


class PDFGenerationService:
    """Service for generating PDFs from HTML templates using Playwright"""

    @staticmethod
    async def generate_pdf(
        html_content: str,
        css_content: str,
        cv_data: Dict[str, Any],
        filename: str = "cv.pdf"
    ) -> bytes:
        """
        Generate a PDF from HTML/CSS template with CV data.

        Args:
            html_content: The HTML template
            css_content: The CSS styles
            cv_data: The CV data to inject
            filename: The desired filename

        Returns:
            bytes: The generated PDF content
        """
        try:
            logger.info(f"Starting PDF generation for {filename}")

            async with async_playwright() as p:
                # Launch browser in headless mode
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox']
                )

                # Create a new page
                page = await browser.new_page()

                # Build complete HTML with Handlebars compilation
                # We include Handlebars from CDN and compile the template with the data
                complete_html = f"""
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>CV</title>
                    <style>
                        {css_content}
                    </style>
                    <script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js"></script>
                </head>
                <body>
                    <!-- Template container -->
                    <div id="cv-content"></div>

                    <!-- Handlebars template -->
                    <script id="cv-template" type="text/x-handlebars-template">
                        {html_content}
                    </script>

                    <!-- Compile and render -->
                    <script>
                        // Register Handlebars helpers
                        Handlebars.registerHelper('first', function(value, count) {{
                            if (value) {{
                                return String(value).substring(0, count);
                            }}
                            return '';
                        }});

                        Handlebars.registerHelper('translate_work_mode', function(value) {{
                            const translations = {{
                                'remote': 'Télétravail',
                                'onsite': 'Sur site',
                                'hybrid': 'Hybride'
                            }};
                            return translations[value] || value;
                        }});

                        // CV data
                        var cvData = {json.dumps(cv_data)};

                        // Get template source
                        var templateSource = document.getElementById('cv-template').innerHTML;

                        // Compile template
                        var template = Handlebars.compile(templateSource);

                        // Render with data
                        var html = template(cvData);

                        // Insert into DOM
                        document.getElementById('cv-content').innerHTML = html;
                    </script>
                </body>
                </html>
                """

                # Set content and wait for it to be fully loaded
                await page.set_content(complete_html, wait_until='networkidle')

                # Wait for Handlebars to compile and render (increased timeout)
                await page.wait_for_timeout(2000)

                # Generate PDF
                pdf_bytes = await page.pdf(
                    format='A4',
                    print_background=True,
                    margin={
                        'top': '0mm',
                        'right': '0mm',
                        'bottom': '0mm',
                        'left': '0mm'
                    }
                )

                await browser.close()

                logger.info(f"PDF generated successfully: {len(pdf_bytes)} bytes")
                return pdf_bytes

        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            raise

    @staticmethod
    def generate_pdf_sync(
        html_content: str,
        css_content: str,
        cv_data: Dict[str, Any],
        filename: str = "cv.pdf"
    ) -> bytes:
        """
        Synchronous wrapper for generate_pdf.

        This is needed because Django views are synchronous by default.
        """
        return asyncio.run(
            PDFGenerationService.generate_pdf(
                html_content, css_content, cv_data, filename
            )
        )
