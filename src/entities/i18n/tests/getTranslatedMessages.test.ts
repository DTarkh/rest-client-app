import { describe, it, expect, beforeEach } from 'vitest';
import { getTranslatedMessages } from '../lib/getTranslatedMessages';
import { useLang } from '../model/lang.store';

// Messages fixture
const msgs = {
  title: { en: 'Hello', ru: 'Привет' },
  subtitle: { en: '', ru: 'Подзаг' },
};

describe('getTranslatedMessages', () => {
  beforeEach(() => {
    useLang.setState({ lang: 'en', isLoading: false });
  });

  it('returns empty object when messages undefined', () => {
    const result = getTranslatedMessages(undefined as unknown as Record<string, never>);
    expect(result).toEqual({});
  });

  it('returns values for current lang, empty string if missing', () => {
    const result = getTranslatedMessages(msgs);
    expect(result).toEqual({ title: 'Hello', subtitle: '' });
  });

  it('reacts to lang change', () => {
    useLang.setState({ lang: 'ru', isLoading: false });
    const result = getTranslatedMessages(msgs);
    expect(result).toEqual({ title: 'Привет', subtitle: 'Подзаг' });
  });
});
