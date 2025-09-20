export type SupportedLanguage =
  | 'curl'
  | 'javascript-fetch'
  | 'javascript-xhr'
  | 'nodejs'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go';

export type CodeSnippet = {
  id: string;
  language: SupportedLanguage;
  code: string;
  label: string;
  prismLanguage: string;
  generatedAt: number;
  isValid: boolean;
  error?: string;
};

export type LanguageConfig = {
  id: SupportedLanguage;
  label: string;
  prismLanguage: string;
  icon: string;
  description: string;
  extension: string;
};

export type CodeSnippetState = {
  snippets: Record<SupportedLanguage, CodeSnippet | null>;
  currentLanguage: SupportedLanguage;
  isGenerating: boolean;
  lastError: string | null;

  setCurrentLanguage: (language: SupportedLanguage) => void;
  setSnippet: (language: SupportedLanguage, snippet: CodeSnippet) => void;
  clearSnippets: () => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
};
