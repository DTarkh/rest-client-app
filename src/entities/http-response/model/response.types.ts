export type HttpResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  size: number;
  duration: number;
  timestamp: number;
};

export type ResponseState = {
  response: HttpResponseData | null;
  isLoading: boolean;
  error: string | null;

  setResponse: (response: HttpResponseData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResponse: () => void;
};
