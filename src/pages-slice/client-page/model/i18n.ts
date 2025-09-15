import { createI18nModule } from '../../../shared/lib/i18n';

const translations = {
  pageTitle: {
    en: 'A simple REST client to test your APIs.',
    ru: 'Простой REST client для тестирования ваших API.',
  },
} as const;

export const useI18n = createI18nModule(translations);
