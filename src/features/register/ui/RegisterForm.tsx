'use client';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterFormData } from '../model/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { logger } from '@/src/shared/lib/logger';
import { FormHeader } from './form-elements/FormHeader';
import { FormInput } from './form-elements/FormInput';
import { FormButton } from './form-elements/FormButton';
import { useI18n, type ErrorType } from '../model/i18n';
import { useSignUp } from '../model/use-sign-up';

export const RegisterForm = () => {
  const { t } = useI18n();
  const { mutate: signUp, isPending } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    logger(data);

    signUp(data);
  };

  return (
    <div className='w-full max-w-sm mx-auto flex flex-col border-2 p-7 rounded-lg shadow-gray-500 bg-transparent'>
      <FormHeader title={t('title')} subtitle={t('subtitle')} />

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <FormInput
          type='email'
          placeholder={t('emailPlaceholder') as string}
          registration={register('email')}
          error={t(errors.email?.message as ErrorType) as string}
        />

        <FormInput
          type='password'
          placeholder={t('passwordPlaceholder') as string}
          registration={register('password')}
          error={t(errors.password?.message as ErrorType) as string}
        />

        <FormInput
          type='password'
          placeholder={t('confirmPasswordPlaceholder') as string}
          registration={register('confirmPassword')}
          error={t(errors.confirmPassword?.message as ErrorType) as string}
        />

        <FormButton type='submit' className='w-1/2 self-center' disabled={isPending}>
          {t('registerButton')}
        </FormButton>
      </form>
    </div>
  );
};
