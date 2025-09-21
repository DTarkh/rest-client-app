import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useResponseStore } from '@/entities/http-response';

type ExecuteRequestData = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
};

async function executeRequest(data: ExecuteRequestData) {
  const response = await fetch('/api/requests/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result.status >= 400) {
    throw new Error(result?.statusText || 'Something went wrong');
  }

  return result;
}

export const useExecuteRequest = () => {
  const { setResponse, setLoading, setError } = useResponseStore();

  return useMutation({
    mutationFn: executeRequest,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: data => {
      setResponse(data);

      if (data.status >= 400) {
        toast.info(`Recieved with status ${data.status}`);
      } else {
        toast.success(`Recieved with status (${data.status})`);
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};
