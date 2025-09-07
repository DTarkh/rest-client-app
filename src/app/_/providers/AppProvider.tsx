'use client';

import { useEffect } from 'react';
import { I18nProvider } from '@/src/shared/lib/i18n';
import { useSession } from '@/src/entities/session/model/session.store';
import { useLang } from '@/src/entities/i18n';

export function AppProvider({ children }: { children?: React.ReactNode }) {
  const { lang, loadLang, isLoading: isLoadingLng } = useLang();
  const { loadCurrentSession, isLoading: isLoadingSession } = useSession();

  useEffect(() => {
    loadLang();
    loadCurrentSession();
  }, []);

  const isLoading = isLoadingLng || isLoadingSession;

  return isLoading ? <div>loading</div> : <I18nProvider lang={lang}>{children}</I18nProvider>;
}
