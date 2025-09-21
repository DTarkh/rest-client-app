'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionStore } from '../../../entities/session';
import Spinner from '../../../shared/ui/spinner';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { refresh, setSession, isLoading, clear } = useSessionStore();

  const handleTokenExpiration = useCallback(() => {
    clear();
    router.replace('/');
    router.refresh();
  }, [clear, router]);

  useEffect(() => {
    refresh();

    const supabase = createClientComponentClient();

    const checkTokenExpiration = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error || !session) {
          handleTokenExpiration();
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at <= now) {
          handleTokenExpiration();
        }
      } catch {
        handleTokenExpiration();
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 30000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session ?? null);

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (!session) {
          handleTokenExpiration();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, [refresh, setSession, handleTokenExpiration]);

  if (isLoading) return <Spinner />;
  return <>{children}</>;
}
