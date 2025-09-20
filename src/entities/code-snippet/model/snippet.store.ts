import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { CodeSnippetState, SupportedLanguage, CodeSnippet } from './snippet.types';

const emptySnippets: Record<SupportedLanguage, CodeSnippet | null> = {
  curl: null,
  'javascript-fetch': null,
  'javascript-xhr': null,
  nodejs: null,
  python: null,
  java: null,
  csharp: null,
  go: null,
};

export const useCodeSnippetStore = create<CodeSnippetState>()(
  devtools(
    persist(
      set => ({
        snippets: emptySnippets,
        currentLanguage: 'curl',
        isGenerating: false,
        lastError: null,

        setCurrentLanguage: (language: SupportedLanguage) => {
          set({ currentLanguage: language }, false, 'setCurrentLanguage');
        },

        setSnippet: (language: SupportedLanguage, snippet: CodeSnippet) => {
          set(
            state => ({
              snippets: {
                ...state.snippets,
                [language]: snippet,
              },
              lastError: null,
            }),
            false,
            'setSnippet',
          );
        },

        clearSnippets: () => {
          set(
            {
              snippets: emptySnippets,
              lastError: null,
            },
            false,
            'clearSnippets',
          );
        },

        setGenerating: (generating: boolean) => {
          set({ isGenerating: generating }, false, 'setGenerating');
        },

        setError: (error: string | null) => {
          set({ lastError: error, isGenerating: false }, false, 'setError');
        },
      }),
      {
        name: 'code-snippet-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: state => ({
          currentLanguage: state.currentLanguage,
        }),
      },
    ),
    { name: 'code-snippet-store' },
  ),
);
