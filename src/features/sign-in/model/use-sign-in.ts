import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signInAPI } from '../api/sign-in';

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signInAPI.signIn,
    onSuccess: () => {
      toast.success('Добро пожаловать!');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
