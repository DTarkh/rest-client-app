import { createI18nModule } from '@/shared/lib/i18n';

export const useI18n = createI18nModule({
  button: { en: 'Get Started', ru: 'Начать' },
  signIn: { en: 'Sign in', ru: 'Войти' },
  register: { en: 'Register', ru: 'Регистрация' },
  welcome: { en: 'Welcome', ru: 'Добро пожаловать' },
});
