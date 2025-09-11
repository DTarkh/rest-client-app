import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SessionState } from './types';
import { supabase } from '@/src/shared/config/supabase';

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,

      setSession: session => {
        set({
          ...session,
          isAuthenticated: !!session.user,
          isLoading: false,
        });
      },

      clearSession: () => {
        set({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
        });
      },

      refreshSession: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;

          const { session } = data;
          if (session) {
            get().setSession({
              user: session.user,
              isLoading: false,
              isAuthenticated: true,
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
              expiresAt: session.expires_at,
            });
          }
        } catch (error) {
          get().clearSession();
          throw error;
        }
      },

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        return Date.now() / 1000 >= expiresAt;
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);
