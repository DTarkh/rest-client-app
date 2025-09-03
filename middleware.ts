import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './src/shared/lib/i18n/locale';

export default createMiddleware({
  locales: LOCALES,

  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};
