import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const signOutAPI = {
  async signOut() {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error('Ошибка при выходе из системы');
    }
  },
};
