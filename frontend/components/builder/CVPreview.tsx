'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useCVContext } from '@/context/CVContext';
import { templateApi } from '@/lib/api/template';
import { TemplateRenderer } from '@/lib/services/templateRenderer';

export default function CVPreview() {
  const { cvData, selectedTemplateId } = useCVContext();
  const [templateHtml, setTemplateHtml] = useState<string>('');
  const [templateCss, setTemplateCss] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load template HTML when selectedTemplateId changes
  useEffect(() => {
    const fetchTemplate = async () => {
      if (!selectedTemplateId) {
        setTemplateHtml('<div style="text-align: center; padding: 40px; color: #666;">Sélectionnez un template pour voir l\'aperçu</div>');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const template = await templateApi.getById(selectedTemplateId);
        setTemplateHtml(template.template_html || template.templateHtml || '');
        setTemplateCss(template.template_css || template.templateCss || '');
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
      return '<div style="text-align: center; padding: 40px; color: red;">Erreur lors du rendu du template</div>';
    }
  }, [templateHtml, cvData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '400px',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        height: '297mm',
        width: '210mm',
        mx: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'auto',
      }}
    >
      {/* Inject CSS */}
      {templateCss && <style>{templateCss}</style>}

      {/* Render HTML */}
      <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
    </Box>
  );
}
