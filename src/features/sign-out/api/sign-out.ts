import { supabase } from '@/src/shared/config/supabase';

export const signOutAPI = {
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Ошибка при выходе из системы');
    }
  },
};
