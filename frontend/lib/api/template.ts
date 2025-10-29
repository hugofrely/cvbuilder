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
    }>('/templates/', { params });
    return response.data;
  },

  // Get a single template by ID
  getById: async (id: number) => {
    const response = await apiClient.get<Template>(`/templates/${id}/`);
    return response.data;
  },

  // Get only free templates
  getFree: async () => {
    const response = await apiClient.get<{
      count: number;
      results: Template[];
    }>('/templates/free/');
    return response.data.results;
  },

  // Get only premium templates
  getPremium: async () => {
    const response = await apiClient.get<{
      count: number;
      results: Template[];
    }>('/templates/premium/');
    return response.data.results;
  },
};

export default templateApi;
