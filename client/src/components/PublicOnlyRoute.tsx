import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function PublicOnlyRoute({ children, redirectTo = '/' }: PublicOnlyRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (user) {
      // console.log('User is already authenticated, redirecting to home');
      setLocation(redirectTo);
    }
  }, [user, setLocation, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  // Render children if user is not authenticated
  return <>{children}</>;
}
