'use client';

import { useEffect } from 'react';
import { useLang } from '../../../features/i18n';
import { I18nProvider } from '../../../shared/lib/i18n';

export function AppProvider({ children }: { children?: React.ReactNode }) {
  const { lang, loadLang, isLoading } = useLang();

  useEffect(() => {
    loadLang();
  }, []);

  return isLoading ? <div>loading</div> : <I18nProvider lang={lang}>{children}</I18nProvider>;
}
