import { User } from '@supabase/supabase-js';

export type UserSession = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null | undefined;
};

export type SessionState = {
  setSession: (session: UserSession) => void;
  clearSession: () => void;
  refreshSession: () => Promise<void>;
  isTokenExpired: () => boolean;
} & UserSession;
