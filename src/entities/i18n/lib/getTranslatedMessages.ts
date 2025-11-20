import { useLang } from '../model/lang.store';

type Translations = Record<string, Record<string, string>>;
type TranslatedMessages<T extends Translations> = {
  [K in keyof T]: string;
};

export const getTranslatedMessages = <T extends Translations>(
  messages: T | undefined,
): TranslatedMessages<T> => {
  const lang = useLang.getState().lang;
  if (!messages) return {} as TranslatedMessages<T>;
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [key, value[lang] || '']),
  ) as TranslatedMessages<T>;
};
