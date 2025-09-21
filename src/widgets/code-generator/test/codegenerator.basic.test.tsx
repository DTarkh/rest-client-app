import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { CodeGenerator } from '../ui/code-generator';
import { CodeViewer } from '../ui/code-viewer';
import { useRequestStore } from '@/entities/http-request';
import { useCodeSnippetStore, getLanguageConfig, type CodeSnippet } from '@/entities/code-snippet';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mutateMock = vi.fn();
vi.mock('@/features/code-generation', () => ({
  useCodeGenerator: () => ({ mutate: mutateMock }),
}));

vi.mock('../model/i18n', () => ({
  useI18n: () => ({
    t: (k: string) =>
      ({
        title: 'Code Generator',
        downloadButton: 'Download',
        invalidRequestError: 'Please fill URL and method first',
        generateButton: 'Generate',
        updateButton: 'Update',
        generatingButton: 'Generating…',
        updatingButton: 'Updating…',
        downloadSuccess: 'Code saved',
        generatedCodeTitle: 'Generated code',
        loadingText: 'Loading…',
        generationTitle: 'No code yet',
        generationDescription: 'Click generate to produce code',
        errorTitle: 'Generation error',
      })[k] ?? k,
  }),
}));

const h = {
  toast: vi.mocked(await import('sonner')).toast,
  mutateMock,
};

function resetStores() {
  useRequestStore.setState({
    currentRequest: { url: '', method: 'GET', headers: [], body: '', bodyType: 'none' },
    isValid: false,
  });

  const initialSnippets = useCodeSnippetStore.getState().snippets;

  const emptySnippets = Object.fromEntries(
    Object.keys(initialSnippets).map(k => [k, null]),
  ) as typeof initialSnippets;

  useCodeSnippetStore.setState({
    snippets: emptySnippets,
    currentLanguage: 'curl',
    isGenerating: false,
  });
}

function setValidRequest() {
  useRequestStore.setState({
    currentRequest: {
      url: 'https://example.test',
      method: 'GET',
      headers: [],
      body: '',
      bodyType: 'none',
    },
    isValid: true,
  });
}

let anchorClickSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.clearAllMocks();
  resetStores();

  global.URL.createObjectURL = vi.fn(() => 'blob:mock');

  global.URL.revokeObjectURL = vi.fn();

  anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  anchorClickSpy?.mockRestore();
  vi.restoreAllMocks();
});

describe('CodeGenerator – basic behavior', () => {
  it('auto-generates when request is valid (uses current language)', () => {
    setValidRequest();
    render(<CodeGenerator />);
    expect(h.mutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        request: expect.any(Object),
        language: 'curl',
      }),
    );
  });

  it('disables Generate button when request is invalid (no toast fired)', async () => {
    render(<CodeGenerator />);
    const genBtn =
      screen.getByRole('button', { name: /generate/i }) ||
      screen.getByRole('button', { name: /update/i });
    expect(genBtn).toBeDisabled();

    await userEvent.click(genBtn);
    expect(h.toast.error).not.toHaveBeenCalled();
    expect(h.mutateMock).not.toHaveBeenCalled();
  });

  it('changing language triggers re-generation', async () => {
    setValidRequest();
    render(<CodeGenerator />);
    h.mutateMock.mockClear();

    const trigger = screen.getByRole('button', { name: /curl/i });
    await userEvent.click(trigger);

    const option = await screen.findByRole('menuitem', { name: /python/i });
    await userEvent.click(option);

    expect(h.mutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'python',
      }),
    );
  });

  it('shows Copy & Download when snippet exists; download fires toast success', async () => {
    setValidRequest();
    const lang = useCodeSnippetStore.getState().currentLanguage;

    useCodeSnippetStore.setState(s => ({
      ...s,
      snippets: {
        ...s.snippets,
        [lang]: {
          language: getLanguageConfig(lang).label,
          prismLanguage: 'text',
          code: 'echo "hi"',
          generatedAt: Date.now(),
        },
      },
    }));

    render(<CodeGenerator />);
    const dl = screen.getByRole('button', { name: /download/i });
    expect(dl).toBeInTheDocument();

    await userEvent.click(dl);
    expect(h.toast.success).toHaveBeenCalledWith('Code saved');
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe('CodeViewer – states', () => {
  it('renders loading state', () => {
    render(<CodeViewer snippet={null} isLoading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders empty state when no snippet', () => {
    render(<CodeViewer snippet={null} />);
    expect(screen.getByText(/no code yet/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    const snippet: CodeSnippet = {
      id: 'test',
      label: 'test',
      isValid: true,
      language: 'curl',
      prismLanguage: 'text',
      code: '',
      error: 'boom',
      generatedAt: Date.now(),
    };
    render(<CodeViewer snippet={snippet} />);
    expect(screen.getByText(/generation error/i)).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();
  });

  it('renders highlighted code + meta when snippet present', () => {
    const snippet: CodeSnippet = {
      id: 'test',
      label: 'test',
      isValid: true,
      language: 'curl',
      prismLanguage: 'text',
      code: 'curl https://example.test',
      generatedAt: Date.now(),
    };
    render(<CodeViewer snippet={snippet} />);
    expect(screen.getByText(/Generated code/i)).toBeInTheDocument();
    expect(screen.getAllByText(/curl/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/curl https:\/\/example\.test/i)).toBeInTheDocument();
  });
});
