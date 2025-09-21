import { createI18nModule } from '@/shared/lib/i18n';

export const useI18n = createI18nModule({
  client: { en: 'Rest Client', ru: 'Клиент REST' },
  variables: { en: 'Variables', ru: 'Переменные' },
  history: { en: 'History', ru: 'История' },
});
