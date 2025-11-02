import apiClient from './axios';
import { Resume } from '@/types/resume';

export const resumeApi = {
  // Get all resumes for authenticated user
  getAll: async () => {
    const response = await apiClient.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Resume[];
    }>('/api/resumes/');
    return response.data.results; // Return only the results array
  },

  // Get a single resume by ID
  getById: async (id: string) => {
    const response = await apiClient.get<Resume>(`/api/resumes/${id}/`);
    return response.data;
  },

  // Create a new resume (works for anonymous users with session)
  create: async (resume: Partial<Resume>) => {
    const response = await apiClient.post<Resume>('/api/resumes/', resume);
    return response.data;
  },

  // Update an existing resume
  update: async (id: string, resume: Partial<Resume>) => {
    const response = await apiClient.patch<Resume>(`/api/resumes/${id}/`, resume);
    return response.data;
  },

  // Delete a resume
  delete: async (id: string) => {
    await apiClient.delete(`/api/resumes/${id}/`);
  },

  // Export resume to PDF
  exportPdf: async (id: string) => {
    try {
      const response = await apiClient.post(`/api/resumes/${id}/export_pdf`, null, {
        responseType: 'blob',
      });

      // Extract filename from headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = `CV_${id}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Extract metadata from headers
      const resumeId = response.headers['x-resume-id'] || id;
      const isPremium = response.headers['x-template-premium'] === 'True';

      return {
        blob: response.data,
        filename,
        resumeId,
        isPremium,
      };
    } catch (error: unknown) {
      // Handle 402 Payment Required
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: Blob } };

        if (axiosError.response?.status === 402 && axiosError.response.data instanceof Blob) {
          // Convert blob error to JSON
          const errorBlob = axiosError.response.data;
          const errorText = await errorBlob.text();
          const errorData = JSON.parse(errorText);

          throw {
            status: 402,
            paymentRequired: true,
            ...errorData,
          };
        }
      }
      throw error;
    }
  },

  // Export resume to other formats
  exportFormat: async (id: string, format: 'google_docs' | 'docx' | 'odt') => {
    const response = await apiClient.post<{ url: string }>(
      `/api/resumes/${id}/export_${format}/`
    );
    return response.data;
  },

  // Render resume HTML with template
  renderHtml: async (id: string) => {
    const response = await apiClient.get<{
      html: string;
      css: string;
      template_name: string;
    }>(`/api/resumes/${id}/render_html`);
    return response.data;
  },

  // Get or create draft resume (prevents duplicates)
  getOrCreateDraft: async () => {
    const response = await apiClient.get<{
      resume: Resume;
      is_new: boolean;
    }>('/api/resumes/get_or_create_draft/');
    return response.data;
  },

  // Migrate anonymous resume data from session to authenticated user account
  migrateAnonymous: async () => {
    const response = await apiClient.post<{
      message: string;
      migrated_count: number;
      resume_ids?: number[];
      action: string;
    }>('/api/resumes/migrate_anonymous/');
    return response.data;
  },
};

export default resumeApi;
