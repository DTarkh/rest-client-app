export const LOCALES = ['en', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};

export const TIME_ZONES = {
  default: 'Europe/Berlin',
  en: 'America/New_York',
  ru: 'Europe/Moscow',
} as const;
