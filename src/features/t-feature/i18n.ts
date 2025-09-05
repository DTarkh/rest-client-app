import { createI18nModule } from '../../shared/lib/i18n';

export const useI18n = createI18nModule({
  'test-feature': {
    en: 'test feature',
    ru: 'фича для теста',
  },
} as const);
