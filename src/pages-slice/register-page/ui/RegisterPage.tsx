import { RegisterForm } from '@/src/features/register';
import { AuthLayout } from '@/src/widgets/layouts';

export function RegisterPage() {
  return <AuthLayout formSlot={<RegisterForm />} />;
}
