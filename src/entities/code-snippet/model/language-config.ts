import { LanguageConfig, SupportedLanguage } from './snippet.types';

export const languageConfigs: Record<SupportedLanguage, LanguageConfig> = {
  curl: {
    id: 'curl',
    label: 'cURL',
    prismLanguage: 'bash',
    icon: '🔧',
    description: 'Command line tool для HTTP запросов',
    extension: 'sh',
  },
  'javascript-fetch': {
    id: 'javascript-fetch',
    label: 'JavaScript (Fetch)',
    prismLanguage: 'javascript',
    icon: '🌐',
    description: 'Современный Fetch API для браузера',
    extension: 'js',
  },
  'javascript-xhr': {
    id: 'javascript-xhr',
    label: 'JavaScript (XHR)',
    prismLanguage: 'javascript',
    icon: '⚡',
    description: 'XMLHttpRequest для браузера',
    extension: 'js',
  },
  nodejs: {
    id: 'nodejs',
    label: 'Node.js',
    prismLanguage: 'javascript',
    icon: '🟢',
    description: 'Node.js с нативным http модулем',
    extension: 'js',
  },
  python: {
    id: 'python',
    label: 'Python',
    prismLanguage: 'python',
    icon: '🐍',
    description: 'Python с библиотекой requests',
    extension: 'py',
  },
  java: {
    id: 'java',
    label: 'Java',
    prismLanguage: 'java',
    icon: '☕',
    description: 'Java с OkHttp библиотекой',
    extension: 'java',
  },
  csharp: {
    id: 'csharp',
    label: 'C#',
    prismLanguage: 'csharp',
    icon: '#️⃣',
    description: 'C# с HttpClient',
    extension: 'cs',
  },
  go: {
    id: 'go',
    label: 'Go',
    prismLanguage: 'go',
    icon: '🐹',
    description: 'Go с нативным net/http пакетом',
    extension: 'go',
  },
};

export const getLanguageConfig = (language: SupportedLanguage): LanguageConfig => {
  return languageConfigs[language];
};

export const getAllLanguages = (): LanguageConfig[] => {
  return Object.values(languageConfigs);
};
