import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './src/shared/lib/i18n/locale';

export default createMiddleware({
  // A list of all locales that are supported
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ru|en)/:path*'],
};
