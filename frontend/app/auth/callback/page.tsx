'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/api/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    let isProcessed = false;

    const handleCallback = async () => {
      // Prevent processing multiple times
      if (isProcessed) return;
      isProcessed = true;

      try {
        console.log('Starting OAuth callback...');

        // Get tokens from URL params (sent by backend after OAuth)
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');
        const error = searchParams.get('error');

        console.log('Tokens received:', { hasAccess: !!access, hasRefresh: !!refresh, error });

        if (error) {
          throw new Error(error);
        }

        if (access && refresh) {
          console.log('Storing tokens...');
          // Store the tokens
          authService.setTokens({ access, refresh });

          console.log('Loading user data...');
          // Refresh user data
          await refreshUser();

          console.log('User loaded successfully');

          // Wait a bit to ensure user is set in context
          await new Promise(resolve => setTimeout(resolve, 500));

          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Redirect to builder page
          setTimeout(() => {
            console.log('Redirecting to /builder');
            router.push('/builder');
          }, 1000);
        } else {
          throw new Error('No tokens received');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');

        // Redirect to login after error
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <svg
                className="h-16 w-16 text-green-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <svg
                className="h-16 w-16 text-red-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
