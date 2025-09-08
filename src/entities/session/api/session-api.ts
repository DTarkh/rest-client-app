import type { SupabaseClient } from '@supabase/supabase-js';
import { useSession } from '../model/session.store';

export class SessionAPI {
  constructor(private supabase: SupabaseClient) {}

  async initializeSession() {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (session) {
      useSession.getState().setCurrentSession({
        token: session.access_token,
        email: session.user.email ?? '',
      });
    } else {
      useSession.getState().removeSession();
    }
  }

  subscribeToAuthChanges() {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        useSession.getState().setCurrentSession({
          token: session.access_token,
          email: session.user.email ?? '',
        });
      } else if (event === 'SIGNED_OUT') {
        useSession.getState().removeSession();
      }
    });
  }
}
