import { LoginForm } from '@/src/features/sign-in';
import { AuthLayout } from '@/src/widgets/layouts';

export function LoginPage() {
  return <AuthLayout formSlot={<LoginForm />} />;
}
