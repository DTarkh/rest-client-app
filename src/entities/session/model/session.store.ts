'use client';
import { create } from 'zustand';
import type { SessionStore } from './types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const useSessionStore = create<SessionStore>(set => ({
  session: null,
  user: null,
  isLoading: true,

  setSession: session =>
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    }),

  refresh: async () => {
    const supabase = createClientComponentClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({
      session: session ?? null,
      user: session?.user ?? null,
      isLoading: false,
    });
  },

  signOut: async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    set({ session: null, user: null, isLoading: false });
  },

  clear: () => set({ session: null, user: null, isLoading: false }),
}));
