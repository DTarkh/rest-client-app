import { createI18nModule } from '@/shared/lib/i18n';

const errors = {
  urlRequired: {
    en: 'URL is required',
    ru: 'URL обязателен',
  },
  urlProtocol: {
    en: 'URL must start with http:// or https://',
    ru: 'URL должен начинаться с http:// или https://',
  },
  urlInvalid: {
    en: 'Incorrect URL format',
    ru: 'Неверный формат URL',
  },
  headerValueRequired: {
    en: 'The header value cannot be empty',
    ru: 'Значение заголовка не может быть пустым',
  },
  headerKeyRequired: {
    en: 'Title cannot be empty',
    ru: 'Название заголовка не может быть пустым',
  },
  invalidJson: {
    en: 'Incorrect JSON format',
    ru: 'Неверный формат JSON',
  },
} as const;

const placeholders = {
  urlPlaceholder: {
    en: 'https://jsonplaceholder.typicode.com/posts',
    ru: 'https://jsonplaceholder.typicode.com/posts',
  },
  headerKeyPlaceholder: {
    en: 'Title',
    ru: 'Название',
  },
  headerValuePlaceholder: {
    en: 'Value',
    ru: 'Значение',
  },
  jsonPlaceholder: {
    en: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
    ru: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  },
  textPlaceholder: {
    en: 'Please enter plaintext...',
    ru: 'Введите текст...',
  },
} as const;

const buttons = {
  sendButton: { en: 'Send', ru: 'Отправить' },
  sendingButton: { en: 'Sending...', ru: 'Отправка...' },
  addHeaderButton: { en: 'Add Header', ru: 'Добавить заголовок' },
  formatJsonButton: { en: 'Format JSON', ru: 'Форматировать JSON' },
} as const;

const titles = {
  headersTitle: { en: 'Headers', ru: 'Заголовки' },
  bodyTitle: { en: 'Body', ru: 'Тело запроса' },
} as const;

const messages = {
  noHeadersMessage: { en: 'No headers added', ru: 'Заголовки не добавлены' },
  addHeaderHint: {
    en: 'Click "Add Header" to get started',
    ru: 'Нажмите "Добавить заголовок" чтобы начать',
  },
  bodyNotAllowed: {
    en: 'Request body is not supported for this method',
    ru: 'Тело запроса не поддерживается для этого метода',
  },
  noBodyMessage: {
    en: 'The request body will not be sent.',
    ru: 'Тело запроса не будет отправлено.',
  },
  methodNotSupported: {
    en: 'method does not support body',
    ru: 'метод не поддерживает тело запроса',
  },
} as const;

const tabs = {
  noBodyTab: { en: 'Without body', ru: 'Без тела' },
  textTab: { en: 'Text', ru: 'Текст' },
} as const;

export const useI18n = createI18nModule({
  ...placeholders,
  ...buttons,
  ...errors,
  ...titles,
  ...messages,
  ...tabs,
});

export type ErrorType = keyof typeof errors;
