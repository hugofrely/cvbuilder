"""
PDF Generation Service using Playwright

This service uses pybars3 (Handlebars for Python) to compile templates,
then Playwright to render the compiled HTML to PDF.
"""

import asyncio
from typing import Dict, Any, Optional
from playwright.async_api import async_playwright
from pybars import Compiler
import logging

logger = logging.getLogger(__name__)


class PDFGenerationService:
    """Service for generating PDFs from HTML templates using Playwright"""

    @staticmethod
    def _get_handlebars_helpers():
        """
        Define all Handlebars helpers for pybars3.
        These helpers match the frontend implementation in templateRenderer.ts
        """

        def percentage_helper(this, level, max_val=5):
            """Helper for level percentage"""
            try:
                return (int(level) / int(max_val)) * 100
            except (ValueError, TypeError, ZeroDivisionError):
                return 0

        def has_items_helper(this, array):
            """Helper to check if array has items"""
            return array and len(array) > 0

        def nl2br_helper(this, text):
            """Helper for newlines to <br>"""
            if not text:
                return ''
            return str(text).replace('\n', '<br>')

        def preserve_whitespace_helper(this, text):
            """Helper to preserve whitespace"""
            if not text:
                return ''
            return f'<span style="white-space: pre-wrap;">{text}</span>'

        def substr_helper(this, string, start, length=None):
            """Helper to get substring"""
            if not string:
                return ''
            string = str(string)
            start = int(start)
            if length is not None:
                return string[start:start + int(length)]
            return string[start:]

        def first_helper(this, value, count):
            """Helper to get first N characters"""
            if not value:
                return ''
            return str(value)[:int(count)]

        def last_helper(this, string, count):
            """Helper to get last N characters"""
            if not string:
                return ''
            return str(string)[-int(count):]

        def year_helper(this, date_str):
            """Helper to format date (extract year)"""
            if not date_str:
                return ''
            # Try to extract year from various date formats
            import re
            match = re.search(r'(\d{4})', str(date_str))
            return match.group(1) if match else str(date_str)

        def translate_work_mode_helper(this, value):
            """Helper to translate work_mode to French"""
            translations = {
                'remote': 'Télétravail',
                'onsite': 'Sur site',
                'hybrid': 'Hybride',
            }
            return translations.get(value, value)

        return {
            'percentage': percentage_helper,
            'hasItems': has_items_helper,
            'nl2br': nl2br_helper,
            'preserveWhitespace': preserve_whitespace_helper,
            'substr': substr_helper,
            'first': first_helper,
            'last': last_helper,
            'year': year_helper,
            'translate_work_mode': translate_work_mode_helper,
        }

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

            # Step 1: Compile Handlebars template with pybars3
            compiler = Compiler()
            helpers = PDFGenerationService._get_handlebars_helpers()

            # Compile the template
            template = compiler.compile(html_content)

            # Render the template with CV data and helpers
            rendered_html = template(cv_data, helpers=helpers)

            logger.info(f"Template compiled successfully with pybars3")

            # Step 2: Inject CSS into the rendered HTML
            # Extract <body> content from rendered HTML if it's a full document
            if '<body' in rendered_html.lower():
                # Template is a full HTML document, extract body content
                import re
                body_match = re.search(r'<body[^>]*>(.*)</body>', rendered_html, re.DOTALL | re.IGNORECASE)
                if body_match:
                    body_content = body_match.group(1)
                else:
                    body_content = rendered_html
            else:
                # Template is just a fragment
                body_content = rendered_html

            # Build complete HTML for PDF with aggressive page-break prevention
            complete_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV</title>
    <style>
        /* Global PDF optimizations */
        * {{
            box-sizing: border-box;
        }}

        html {{
            margin: 0;
            padding: 0;
        }}

        body {{
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            min-height: 100vh;
        }}

        /* Reduce excessive top/bottom padding in container divs */
        body > div {{
            padding-top: 20px !important;
            padding-bottom: 20px !important;
            min-height: 100vh;
        }}

        /* Allow main containers to break across pages */
        body > div,
        body > div > div {{
            page-break-inside: auto !important;
            break-inside: auto !important;
        }}

        /* Prevent page breaks after headers */
        h1, h2, h3, h4, h5, h6 {{
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-after: avoid !important;
            break-inside: avoid !important;
        }}

        /* Prevent breaking content blocks with background/borders (experiences, education, skills, etc.) */
        div[style*="background"],
        div[style*="border"],
        div[style*="box-shadow"] {{
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }}

        /* Prevent breaking individual experience/education items */
        div[style*="margin-bottom"] > div,
        div[style*="padding"] > div {{
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }}

        /* Prevent breaking lists, tables, and figures */
        ul, ol, dl, img, table, figure {{
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }}

        /* Prevent breaking list items */
        li {{
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }}

        /* Allow paragraphs to break if needed */
        p {{
            page-break-inside: auto;
            break-inside: auto;
        }}

        /* Prevent breaking sections and articles */
        section, article {{
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }}

        /* Page settings */
        @page {{
            margin: 0;
            size: A4;
        }}

        /* Custom CSS from template */
        {css_content}
    </style>
</head>
<body>
{body_content}
</body>
</html>"""

            # Step 3: Generate PDF with Playwright
            async with async_playwright() as p:
                # Launch browser in headless mode
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox']
                )

                # Create a new page
                page = await browser.new_page()

                # Set content and wait for it to be fully loaded
                await page.set_content(complete_html, wait_until='networkidle')

                # Generate PDF with no margins and proper page breaks
                pdf_bytes = await page.pdf(
                    format='A4',
                    print_background=True,
                    margin={
                        'top': '0',
                        'right': '0',
                        'bottom': '0',
                        'left': '0'
                    },
                    prefer_css_page_size=False
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
