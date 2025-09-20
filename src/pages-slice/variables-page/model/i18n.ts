import { createI18nModule } from '@/src/shared/lib/i18n';

export const useI18n = createI18nModule({
  title: { en: 'Variables', ru: 'Переменные' },
  description: {
    en: 'Create variables to reuse values in HTTP requests',
    ru: 'Создавайте переменные для повторного использования значений в HTTP-запросах',
  },
  helpText: {
    en: 'Create variables to reuse values in HTTP requests. Use the {{variableName}} syntax to substitute values.',
    ru: 'Создавайте переменные для повторного использования значений в HTTP-запросах. Используйте синтаксис {{имяПеременной}} для подстановки значений.',
  },
});
