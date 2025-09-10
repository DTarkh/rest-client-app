import { useSession } from '../model/session.store';
import { supabase } from '@/src/shared/config/supabase';

export class SessionAPI {
  static async initializeSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      useSession.getState().setCurrentSession({
        token: session.access_token,
        email: session.user.email ?? '',
      });
    } else {
      useSession.getState().removeSession();
    }
  }

  static subscribeToAuthChanges() {
    return supabase.auth.onAuthStateChange((event, session) => {
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
