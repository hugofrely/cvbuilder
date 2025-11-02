import apiClient from './axios';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  username: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_premium: boolean;
  subscription_type: string;
  subscription_end_date?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  user?: User;
}

class AuthService {
  private readonly baseURL = '/api/auth';

  // Login with email/password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.baseURL}/login/`,
      credentials
    );

    const data = response.data;
    if (data.access || data.access_token) {
      this.setTokens({
        access: data.access || data.access_token || '',
        refresh: data.refresh || data.refresh_token || ''
      });
    }

    return data;
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.baseURL}/register/`,
      data
    );

    const responseData = response.data;
    if (responseData.access || responseData.access_token) {
      this.setTokens({
        access: responseData.access || responseData.access_token || '',
        refresh: responseData.refresh || responseData.refresh_token || ''
      });
    }

    return responseData;
  }

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    console.log('[AuthService] Logout called, refresh token:', refreshToken ? 'present' : 'missing');

    try {
      // Send refresh token to backend for blacklisting
      console.log('[AuthService] Calling backend logout endpoint...');
      const response = await apiClient.post(`${this.baseURL}/logout/`, {
        refresh: refreshToken
      });
      console.log('[AuthService] Backend logout successful:', response.data);
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      // Continue even if backend call fails
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseURL}/profile/`);
    return response.data;
  }

  // Refresh access token
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access: string; refresh?: string }>(
      `${this.baseURL}/refresh/`,
      { refresh: refreshToken }
    );

    const data = response.data;
    const tokens: AuthTokens = {
      access: data.access,
      refresh: data.refresh || refreshToken
    };

    this.setTokens(tokens);
    return tokens;
  }

  // Google OAuth
  getGoogleAuthUrl(): string {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${backendUrl}/api/auth/social/google/`;
  }

  // LinkedIn OAuth
  getLinkedInAuthUrl(): string {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${backendUrl}/api/auth/social/linkedin/`;
  }

  // Token management
  setTokens(tokens: AuthTokens): void {
    useAuthStore.getState().setTokens(tokens.access, tokens.refresh);
  }

  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  }

  getRefreshToken(): string | null {
    return useAuthStore.getState().refreshToken;
  }

  clearTokens(): void {
    useAuthStore.getState().logout();
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }
}

export const authService = new AuthService();
