import { LoginForm } from '@/features/sign-in';
import { AuthLayout } from '@/widgets/layouts';

export function LoginPage() {
  return <AuthLayout formSlot={<LoginForm />} />;
}
