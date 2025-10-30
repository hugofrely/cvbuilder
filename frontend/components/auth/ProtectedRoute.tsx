'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  console.log('ProtectedRoute:', { isAuthenticated, loading, hasUser: !!user });

  useEffect(() => {
    console.log('ProtectedRoute useEffect:', { loading, isAuthenticated });
    if (!loading && !isAuthenticated) {
      console.log('Redirecting to login - not authenticated');
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    console.log('ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, showing nothing');
    return null;
  }

  console.log('ProtectedRoute: Authenticated, showing children');
  return <>{children}</>;
}
