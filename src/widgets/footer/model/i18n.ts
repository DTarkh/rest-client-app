import { createI18nModule } from '@/shared/lib/i18n';

export const useI18n = createI18nModule({
  footerCopyright: { en: '© 2025 RestClient', ru: '© 2025 RestClient' },
  footerAuthorsLabel: { en: 'Authors:', ru: 'Авторы:' },
  authorAlina: { en: 'Alina', ru: 'Алина' },
  authorAleksei: { en: 'Aleksei', ru: 'Алексей' },
  authorDavid: { en: 'David', ru: 'Давид' },
  footerViewCourse: { en: 'View Course (RS School)', ru: 'Посмотреть курс (RS School)' },
  rsSchoolLogoAlt: { en: 'RS School logo', ru: 'Логотип RS School' },
});
