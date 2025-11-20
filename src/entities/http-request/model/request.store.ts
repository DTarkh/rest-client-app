import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RequestState, HttpRequest, HeaderEntry } from './request.types';
import { validateRequest } from '../lib/validate-request';

const defaultRequest: HttpRequest = {
  method: 'GET',
  url: '',
  headers: [],
  body: '',
  bodyType: 'json',
  timestamp: Date.now(),
};

export const useRequestStore = create<RequestState>()(
  devtools(
    (set, get) => ({
      currentRequest: defaultRequest,
      isValid: false,
      validationErrors: {},

      setMethod: method => {
        set(
          state => {
            const newRequest = { ...state.currentRequest, method };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'setMethod',
        );
      },

      setUrl: url => {
        set(
          state => {
            const newRequest = { ...state.currentRequest, url };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'setUrl',
        );
      },

      setHeaders: headers => {
        set(
          state => {
            const newRequest = { ...state.currentRequest, headers };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'setHeaders',
        );
      },

      setBody: (body, bodyType = 'json') => {
        set(
          state => {
            const newRequest = {
              ...state.currentRequest,
              body,
              bodyType,
            };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'setBody',
        );
      },

      addHeader: () => {
        set(
          state => {
            const newHeader: HeaderEntry = {
              id: crypto.randomUUID(),
              key: '',
              value: '',
              enabled: true,
            };
            const headers = [...state.currentRequest.headers, newHeader];
            const newRequest = { ...state.currentRequest, headers };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'addHeader',
        );
      },

      removeHeader: id => {
        set(
          state => {
            const headers = state.currentRequest.headers.filter(h => h.id !== id);
            const newRequest = { ...state.currentRequest, headers };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'removeHeader',
        );
      },

      toggleHeader: id => {
        set(
          state => {
            const headers = state.currentRequest.headers.map(h =>
              h.id === id ? { ...h, enabled: !h.enabled } : h,
            );
            const newRequest = { ...state.currentRequest, headers };
            return {
              currentRequest: newRequest,
              ...validateRequest(newRequest),
            };
          },
          false,
          'toggleHeader',
        );
      },

      resetRequest: () => {
        set(
          {
            currentRequest: { ...defaultRequest, timestamp: Date.now() },
            isValid: false,
            validationErrors: {},
          },
          false,
          'resetRequest',
        );
      },

      validateRequest: () => {
        const { isValid } = validateRequest(get().currentRequest);
        return isValid;
      },
    }),
    {
      name: 'request-store',
    },
  ),
);
