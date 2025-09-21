import { RegisterForm } from '@/features/register';
import { AuthLayout } from '@/widgets/layouts';

export function RegisterPage() {
  return <AuthLayout formSlot={<RegisterForm />} />;
}
