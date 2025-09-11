import { RegisterFormData } from '../model/validation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const signUpAPI = {
  async signUp(userData: RegisterFormData) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      const errorMessages: Record<string, string> = {
        'User already registered': 'Пользователь уже зарегистрирован',
        'Password should be at least 6 characters': 'Пароль должен содержать минимум 6 символов',
        'Signup is disabled': 'Регистрация временно недоступна',
      };

      throw new Error(errorMessages[error.message] || error.message);
    }

    return data;
  },
};
