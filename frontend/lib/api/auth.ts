import { supabase } from '@/lib/supabase/client';
import apiClient from './axios';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';

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
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_premium: boolean;
  subscription_type: string;
  subscription_end_date?: string;
  created_at: string;
}

export interface AuthResponse {
  user?: User;
  session?: Session;
  error?: AuthError;
}

class AuthService {
  private readonly baseURL = '/api/auth';

  /**
   * Login with email/password using Supabase
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      // Store Supabase session
      await this.syncWithBackend(data.session.access_token);
    }

    return { session: data.session };
  }

  /**
   * Register new user with Supabase
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          first_name: registerData.first_name || '',
          last_name: registerData.last_name || '',
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data.session) {
      // Store Supabase session and sync with backend
      await this.syncWithBackend(data.session.access_token);
    }

    return { session: data.session };
  }

  /**
   * Logout from Supabase
   */
  async logout(): Promise<void> {
    console.log('[AuthService] Logout initiated');

    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log('[AuthService] Supabase logout successful');

      // Notify backend
      await apiClient.post(`${this.baseURL}/logout/`);
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
    }
  }

  /**
   * Get current user from backend (synced with Supabase)
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseURL}/profile/`);
    return response.data;
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Sign in with LinkedIn OAuth
   */
  async signInWithLinkedIn(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Get current Supabase session
   */
  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  /**
   * Get current Supabase user
   */
  async getSupabaseUser(): Promise<SupabaseUser | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  /**
   * Sync Supabase session with Django backend
   */
  private async syncWithBackend(accessToken: string): Promise<void> {
    try {
      console.log('[AuthService] Syncing with backend...');

      // Set the access token for API requests FIRST
      useAuthStore.getState().setTokens(accessToken, '');

      // Sync user data with backend and get Django user
      const response = await apiClient.post(`${this.baseURL}/sync/`);
      console.log('[AuthService] Sync response:', response.data);

      // Set the user in the store
      if (response.data.user) {
        useAuthStore.getState().setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          isPremium: response.data.user.is_premium,
          subscriptionType: response.data.user.subscription_type,
          subscriptionEndDate: response.data.user.subscription_end_date,
        });
        console.log('[AuthService] User set in store:', response.data.user.email);
      }
    } catch (error) {
      console.error('[AuthService] Failed to sync with backend:', error);
      throw error;
    }
  }

  /**
   * Setup auth state change listener
   */
  setupAuthListener(callback: (session: Session | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthService] Auth state changed:', event);

        if (session?.access_token) {
          await this.syncWithBackend(session.access_token);
        }

        callback(session);
      }
    );

    // Return unsubscribe function
    return () => subscription.unsubscribe();
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  /**
   * Get access token for API requests
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  }

  /**
   * Clear tokens
   */
  clearTokens(): void {
    useAuthStore.getState().logout();
  }
}

export const authService = new AuthService();
