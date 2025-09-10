import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpAPI } from '../api/register-api';

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUpAPI.signUp,
    onSuccess: () => {
      toast.success('Регистрация успешна! Проверьте email для подтверждения аккаунта');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
