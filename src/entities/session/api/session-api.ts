import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionStore } from '../model/session.store';

export class SessionAPI {
  static async initializeSession() {
    const supabase = createClientComponentClient();
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        useSessionStore.setState({
          session,
          user: session.user,
          isLoading: false,
        });
      } else {
        useSessionStore.getState().clear();
      }
    } catch {
      useSessionStore.getState().clear();
    }
  }

  static subscribeToAuthChanges() {
    const supabase = createClientComponentClient();
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        useSessionStore.setState({
          session,
          user: session.user,
          isLoading: false,
        });
      } else {
        useSessionStore.getState().clear();
      }
    });
  }
}
