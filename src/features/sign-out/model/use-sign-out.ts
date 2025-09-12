import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOutAPI } from '../api/sign-out';

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOutAPI.signOut,
    onSuccess: () => {
      toast.success('Вы вышли из системы');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
