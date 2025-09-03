import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { LOCALES, type Locale, TIME_ZONES } from './locale';

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !LOCALES.includes(locale as Locale)) notFound();

  const validLocale = locale as Locale;

  return {
    locale: validLocale,
    messages: (await import(`../../../../messages/${validLocale}.json`)).default,
    timeZone: TIME_ZONES.default,
  };
});
