import apiClient from './axios';
import { Resume } from '@/types/resume';

export const resumeApi = {
  // Get all resumes for authenticated user
  getAll: async () => {
    const response = await apiClient.get<Resume[]>('/resumes/');
    return response.data;
  },

  // Get a single resume by ID
  getById: async (id: string) => {
    const response = await apiClient.get<Resume>(`/resumes/${id}/`);
    return response.data;
  },

  // Create a new resume (works for anonymous users with session)
  create: async (resume: Partial<Resume>) => {
    const response = await apiClient.post<Resume>('/resumes/', resume);
    return response.data;
  },

  // Update an existing resume
  update: async (id: string, resume: Partial<Resume>) => {
    const response = await apiClient.patch<Resume>(`/resumes/${id}/`, resume);
    return response.data;
  },

  // Delete a resume
  delete: async (id: string) => {
    await apiClient.delete(`/resumes/${id}/`);
  },

  // Export resume to PDF
  exportPdf: async (id: string) => {
    const response = await apiClient.post<{
      pdf_url: string;
      has_watermark: boolean;
      filename: string;
    }>(`/resumes/${id}/export_pdf/`);
    return response.data;
  },

  // Export resume to other formats
  exportFormat: async (id: string, format: 'google_docs' | 'docx' | 'odt') => {
    const response = await apiClient.post<{ url: string }>(
      `/resumes/${id}/export_${format}/`
    );
    return response.data;
  },

  // Render resume HTML with template
  renderHtml: async (id: string) => {
    const response = await apiClient.get<{
      html: string;
      css: string;
      template_name: string;
    }>(`/resumes/${id}/render_html/`);
    return response.data;
  },
};

export default resumeApi;
