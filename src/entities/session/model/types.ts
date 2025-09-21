import type { Session, User } from '@supabase/supabase-js';

export type SessionStore = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  setSession: (session: Session | null) => void;
  clear: () => void;
};
