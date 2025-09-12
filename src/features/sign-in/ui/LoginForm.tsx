'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n, type ErrorType } from '../model/i18n';
import { loginSchema, type LoginFormData } from '../model/validation';
import { useForm } from 'react-hook-form';

import { FormHeader } from './form-elements/FormHeader';
import { FormInput } from './form-elements/FormInput';
import { FormButton } from './form-elements/FormButton';

import { useSignIn } from '../model/use-sign-in';
export const LoginForm = () => {
  const { t } = useI18n();
  const { mutate: signIn, isPending } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    signIn(data);
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
        <FormButton type='submit' className='w-1/2 self-center' disabled={isPending}>
          {t('loginButton')}
        </FormButton>
      </form>
    </div>
  );
};
