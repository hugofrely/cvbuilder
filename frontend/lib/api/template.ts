import apiClient from './axios';
import { Template } from '@/types/resume';

export const templateApi = {
  // Get all templates with pagination
  getAll: async (params?: { page?: number; page_size?: number; is_premium?: boolean }) => {
    const response = await apiClient.get<{
      count: number;
      results: Template[];
      next: string | null;
      previous: string | null;
    }>('/api/templates', { params });
    return response.data;
  },

  // Get a single template by ID
  getById: async (id: string) => {
    const response = await apiClient.get<Template>(`/api/templates/${id}`);
    return response.data;
  },

  // Get only free templates
  getFree: async () => {
    const response = await apiClient.get<{
      count: number;
      results: Template[];
    }>('/api/templates/free');
    return response.data.results;
  },

  // Get only premium templates
  getPremium: async () => {
    const response = await apiClient.get<{
      count: number;
      results: Template[];
    }>('/api/templates/premium');
    return response.data.results;
  },
};

export default templateApi;
