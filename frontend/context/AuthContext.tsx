'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, RegisterData } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { migrateAnonymousResume } from '@/lib/utils/resumeMigration';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, setUser, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    console.log('AuthContext: loadUser called');
    console.log('AuthContext: isAuthenticated?', authService.isAuthenticated());
    console.log('AuthContext: Store state:', { user, isAuthenticated });
    try {
      if (authService.isAuthenticated()) {
        console.log('AuthContext: Fetching user data...');
        const userData = await authService.getCurrentUser();
        console.log('AuthContext: User data received:', userData);
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          username: userData.username,
          isPremium: userData.is_premium,
          subscriptionType: userData.subscription_type as 'monthly' | 'yearly' | undefined,
          subscriptionEndDate: userData.subscription_end_date,
        });
        console.log('AuthContext: User set in store');
      } else {
        console.log('AuthContext: Not authenticated, skipping user load');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      authService.clearTokens();
    } finally {
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.user) {
        setUser({
          id: response.user.id.toString(),
          email: response.user.email,
          username: response.user.username,
          isPremium: response.user.is_premium,
          subscriptionType: response.user.subscription_type as 'monthly' | 'yearly' | undefined,
          subscriptionEndDate: response.user.subscription_end_date,
        });
      } else {
        await loadUser();
      }

      // Migrate anonymous resume data after successful login
      await migrateAnonymousResume();
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      if (response.user) {
        setUser({
          id: response.user.id.toString(),
          email: response.user.email,
          username: response.user.username,
          isPremium: response.user.is_premium,
          subscriptionType: response.user.subscription_type as 'monthly' | 'yearly' | undefined,
          subscriptionEndDate: response.user.subscription_end_date,
        });
      } else {
        await loadUser();
      }

      // Migrate anonymous resume data after successful registration
      await migrateAnonymousResume();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('[AuthContext] Logout initiated');
    setLoading(true);
    try {
      // Call backend FIRST (while we still have tokens for authentication)
      // This will blacklist the JWT and create a new anonymous session
      console.log('[AuthContext] Calling authService.logout()...');
      await authService.logout();
      console.log('[AuthContext] authService.logout() completed');
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // Continue logout even if backend fails
    } finally {
      // Clear tokens and user state (always executed)
      console.log('[AuthContext] Clearing local state...');
      storeLogout();

      // Clear resume data on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentResumeId');
      }

      setLoading(false);
      console.log('[AuthContext] Logout complete');
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
