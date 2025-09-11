'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionStore } from '@/src/entities/session/model/session.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { refresh, setSession, isLoading } = useSessionStore();

  useEffect(() => {
    refresh();

    const supabase = createClientComponentClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session ?? null);

      if (event === 'SIGNED_OUT') {
        router.replace('/login');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [refresh, setSession, router]);

  if (isLoading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  return <>{children}</>;
}
