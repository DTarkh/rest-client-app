import { create } from 'zustand';
import { LocalStorageFactory } from '../../../shared/lib/localStorage';

export type Lang = 'ru' | 'en';

type LangStore = {
  isLoading: boolean;
  lang: Lang;
  loadLang: () => void;
  setLang: (lang: Lang) => void;
};

const languageLStorage = new LocalStorageFactory('lang');
export const useLang = create<LangStore>((set, get) => ({
  isLoading: true,
  lang: 'en',
  loadLang: async () => {
    const lang = languageLStorage.get<Lang>() ?? get().lang;
    set({ lang, isLoading: false });
  },
  setLang: lang => {
    languageLStorage.set(lang);

    set({ lang });
  },
}));
