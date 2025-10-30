'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Box, CircularProgress, Typography, alpha, useTheme } from '@mui/material';
import { useCVContext } from '@/context/CVContext';
import { templateApi } from '@/lib/api/template';
import { TemplateRenderer } from '@/lib/services/templateRenderer';

export default function CVPreview() {
  const { cvData, selectedTemplateId } = useCVContext();
  const theme = useTheme();
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [templateCss, setTemplateCss] = useState<string>('');
  const [isTemplatePremium, setIsTemplatePremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load template HTML when selectedTemplateId changes
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!selectedTemplateId) {
        setTemplateHtml(
          '<div style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 400px; text-align: center; padding: 40px; color: #666; font-family: system-ui, -apple-system, sans-serif;">Sélectionnez un template pour voir l\'aperçu</div>'
        );
        setIsTemplatePremium(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const template = await templateApi.getById(selectedTemplateId);
        setTemplateHtml(template.template_html || template.templateHtml || '');
        setTemplateCss(template.template_css || template.templateCss || '');
        setIsTemplatePremium(template.is_premium || template.isPremium || false);
      } catch (err: any) {
        console.error('Error fetching template:', err);
        setError('Erreur lors du chargement du template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [selectedTemplateId]);

  // Render template with CV data (updates in real-time when cvData changes)
  const renderedHtml = useMemo(() => {
    if (!templateHtml) {
      return '';
    }

    try {
      const context = TemplateRenderer.cvDataToContext(cvData);
      return TemplateRenderer.render(templateHtml, context);
    } catch (err: any) {
      console.error('Error rendering template:', err);
      return '<div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 40px; color: #f44336; font-family: system-ui, -apple-system, sans-serif;">Erreur lors du rendu du template</div>';
    }
  }, [templateHtml, cvData]);

  // Update iframe content when rendered HTML or CSS changes
  useEffect(() => {
    if (!iframeRef.current || !renderedHtml) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Watermark styles and HTML for premium templates
    const watermarkStyles = isTemplatePremium ? `
      /* Watermark overlay */
      .premium-watermark {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .watermark-text {
        font-size: 72px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.08);
        transform: rotate(-45deg);
        text-transform: uppercase;
        letter-spacing: 8px;
        user-select: none;
        white-space: nowrap;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      @media print {
        .premium-watermark {
          display: flex !important;
        }
      }
    ` : '';

    const watermarkHtml = isTemplatePremium ? `
      <div class="premium-watermark">
        <div class="watermark-text">PREMIUM TEMPLATE</div>
      </div>
    ` : '';

    // Create complete HTML document for iframe with pagination support
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            /* Reset styles to prevent any inheritance */
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
              position: relative;
            }

            /* Template CSS */
            ${templateCss}

            ${watermarkStyles}
          </style>
        </head>
        <body>
          ${renderedHtml}
          ${watermarkHtml}
        </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();

    // Ajuster la hauteur de l'iframe après le rendu
    setTimeout(() => {
      if (iframe.contentWindow) {
        const contentHeight = iframe.contentWindow.document.body.scrollHeight;
        // Convertir pixels en mm (approximation: 1mm ≈ 3.7795px)
        const heightInMm = contentHeight / 3.7795;
        // Calculer le nombre de pages A4 nécessaires
        const pagesNeeded = Math.ceil(heightInMm / 297);
        const totalHeight = pagesNeeded * 297;

        // Mettre à jour la hauteur de l'iframe
        iframe.style.height = `${totalHeight}mm`;
      }
    }, 100);
  }, [renderedHtml, templateCss, isTemplatePremium]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Chargement du template...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '400px',
          gap: 2,
          p: 4,
        }}
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Veuillez réessayer ou sélectionner un autre template.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        width: '210mm',
        minHeight: '297mm',
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Iframe pour isoler complètement le CSS du CV avec pagination automatique */}
      <iframe
        ref={iframeRef}
        title="CV Preview"
        style={{
          width: '210mm',
          minHeight: '297mm',
          border: 'none',
          display: 'block',
          backgroundColor: 'white',
        }}
      />
    </Box>
  );
}
