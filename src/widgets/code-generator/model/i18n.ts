import { createI18nModule } from '@/shared/lib/i18n';

export const useI18n = createI18nModule({
  loadingText: { en: 'Generating code...', ru: 'Генерируем код...' },
  generationTitle: { en: 'Code Generation', ru: 'Генерация кода' },
  generationDescription: {
    en: 'Select a language and fill in the request parameters to generate code',
    ru: 'Выберите язык и заполните параметры запроса для генерации кода',
  },
  errorTitle: { en: 'Generation Error', ru: 'Ошибка генерации' },
  generatedCodeTitle: { en: 'Generated Code', ru: 'Сгенерированный код' },
  title: { en: 'Code Generation', ru: 'Генерация кода' },
  invalidRequestError: {
    en: 'Fill in the URL and request parameters correctly',
    ru: 'Заполните корректно URL и параметры запроса',
  },
  downloadSuccess: {
    en: 'Code saved successfully',
    ru: 'Код успешно сохранен',
  },
  generateButton: { en: 'Generate', ru: 'Сгенерировать' },
  generatingButton: { en: 'Generating...', ru: 'Генерируем...' },
  updateButton: { en: 'Update code', ru: 'Обновить код' },
  updatingButton: { en: 'Updating...', ru: 'Обновление...' },
  downloadButton: { en: 'Download', ru: 'Скачать' },
  copySuccess: {
    en: 'Code {language} copied to clipboard',
    ru: 'Код {language} скопирован в буфер обмена',
  },
  copyError: {
    en: 'Failed to copy code',
    ru: 'Не удалось скопировать код',
  },
  copyButton: {
    en: 'Copy',
    ru: 'Копировать',
  },
  copiedButton: {
    en: 'Copied',
    ru: 'Скопировано',
  },
  curlLabel: { en: 'cURL', ru: 'cURL' },
  curlDescription: {
    en: 'Command line tool for HTTP requests',
    ru: 'Инструмент командной строки для HTTP запросов',
  },
  javascriptFetchLabel: { en: 'JavaScript (Fetch)', ru: 'JavaScript (Fetch)' },
  javascriptFetchDescription: {
    en: 'Modern Fetch API for browser',
    ru: 'Современный Fetch API для браузера',
  },
  javascriptXhrLabel: { en: 'JavaScript (XHR)', ru: 'JavaScript (XHR)' },
  javascriptXhrDescription: {
    en: 'XMLHttpRequest for browser',
    ru: 'XMLHttpRequest для браузера',
  },
  nodejsLabel: { en: 'Node.js', ru: 'Node.js' },
  nodejsDescription: {
    en: 'Node.js with native http module',
    ru: 'Node.js с нативным http модулем',
  },
  pythonLabel: { en: 'Python', ru: 'Python' },
  pythonDescription: {
    en: 'Python with requests library',
    ru: 'Python с библиотекой requests',
  },
  javaLabel: { en: 'Java', ru: 'Java' },
  javaDescription: {
    en: 'Java with OkHttp library',
    ru: 'Java с OkHttp библиотекой',
  },
  csharpLabel: { en: 'C#', ru: 'C#' },
  csharpDescription: {
    en: 'C# with HttpClient',
    ru: 'C# с HttpClient',
  },
  goLabel: { en: 'Go', ru: 'Go' },
  goDescription: {
    en: 'Go with native net/http package',
    ru: 'Go с нативным net/http пакетом',
  },
});
