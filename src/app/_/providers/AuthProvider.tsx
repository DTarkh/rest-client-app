'use client';

import { useSession } from '@/src/entities/session';
import { SessionAPI } from '@/src/entities/session/api/session-api';
import { useEffect } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useSession();

  useEffect(() => {
    SessionAPI.initializeSession();

    const {
      data: { subscription },
    } = SessionAPI.subscribeToAuthChanges();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return <>{children}</>;
};
