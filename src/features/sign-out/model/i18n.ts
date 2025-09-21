import { createI18nModule } from '@/shared/lib/i18n';

export const useI18n = createI18nModule({
  logout: { en: 'Log out', ru: 'Выйти' },
  loggingOut: { en: 'Logging out...', ru: 'Выходим...' },
});
