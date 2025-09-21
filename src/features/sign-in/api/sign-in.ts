import { LoginFormData } from '../model/validation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const signInAPI = {
  async signIn(credentials: LoginFormData) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      const errorMessages: Record<string, string> = {
        'Invalid login credentials': 'Неверные учетные данные',
        'Email not confirmed': 'Email не подтвержден',
        'Too many requests': 'Слишком много попыток. Попробуйте позже',
      };

      throw new Error(errorMessages[error.message] || error.message);
    }

    return data;
  },
};
