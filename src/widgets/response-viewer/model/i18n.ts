import { createI18nModule } from '@/src/shared/lib/i18n';

const messages = {
  copiedToClipboard: {
    en: 'Copied to clipboard',
    ru: 'Скопировано в буфер обмена',
  },
  executingRequest: {
    en: 'Executing request...',
    ru: 'Выполнение запроса...',
  },
  requestError: {
    en: 'Request execution error',
    ru: 'Ошибка выполнения запроса',
  },
  possibleReasons: {
    en: 'Possible reasons:',
    ru: 'Возможные причины:',
  },
  invalidUrl: {
    en: 'Invalid URL or unavailable server',
    ru: 'Неверный URL или сервер недоступен',
  },
  networkIssues: {
    en: 'Network issues or timeout',
    ru: 'Проблемы с сетью или таймаут',
  },
  corsRestrictions: {
    en: 'CORS restrictions (should be handled through our proxy)',
    ru: 'Ограничения CORS (должны обрабатываться через наш прокси)',
  },
  readyToRequest: {
    en: 'Ready to make a request',
    ru: 'Готово к выполнению запроса',
  },
  enterUrlHint: {
    en: 'Enter URL and click "Send" to see the response data here',
    ru: 'Введите URL и нажмите "Отправить" чтобы увидеть ответ здесь',
  },
  responseBody: {
    en: 'Response Body',
    ru: 'Тело ответа',
  },
  headersTab: {
    en: 'Headers',
    ru: 'Заголовки',
  },
  responseSize: {
    en: 'KB',
    ru: 'КБ',
  },
} as const;

const titles = {
  responseTitle: { en: 'Response', ru: 'Ответ' },
};

const buttons = {
  copyButton: {
    en: 'Copy',
    ru: 'Копировать',
  },
  downloadButton: {
    en: 'Download',
    ru: 'Скачать',
  },
};

const placeholders = {
  headerValuePlaceholder: {
    en: 'Value',
    ru: 'Значение',
  },
};

export const useI18n = createI18nModule({
  ...messages,
  ...titles,
  ...buttons,
  ...placeholders,
});
