import { supabase } from '@/src/shared/config/supabase';
import { useSessionStore } from '../model/session.store';

export class SessionAPI {
  // Инициализация сессии при загрузке приложения
  static async initializeSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      useSessionStore.getState().setSession({
        user: session.user,
        isLoading: false,
        isAuthenticated: true,
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
      });
    } else {
      useSessionStore.getState().clearSession();
    }
  }

  // Подписка на изменения авторизации
  static subscribeToAuthChanges() {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        useSessionStore.getState().setSession({
          user: session.user,
          isLoading: false,
          isAuthenticated: true,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
        });
      } else if (event === 'SIGNED_OUT') {
        useSessionStore.getState().clearSession();
      }
    });
  }
}
