import { create } from 'zustand';
import { ResponseState, HttpResponseData } from './response.types';

export const useResponseStore = create<ResponseState>()(set => ({
  response: null,
  isLoading: false,
  error: null,

  setResponse: (response: HttpResponseData) => {
    set({
      response,
      isLoading: false,
      error: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
    if (loading) {
      set({ error: null });
    }
  },

  setError: (error: string | null) => {
    set({
      error,
      isLoading: false,
      response: null,
    });
  },

  clearResponse: () => {
    set({
      response: null,
      isLoading: false,
      error: null,
    });
  },
}));
