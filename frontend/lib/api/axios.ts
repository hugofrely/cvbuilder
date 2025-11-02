import axios from 'axios';
import { useAuthStore } from '@/lib/stores/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed for Django sessions (anonymous users)
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { logout } = useAuthStore.getState();

      // With Supabase, token refresh is automatic
      // If we get 401, it means the session is truly expired
      // So we logout and redirect to login
      console.error('Authentication error: Session expired');
      logout();

      // Only redirect if not already on auth pages
      if (typeof window !== 'undefined' &&
          !window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
