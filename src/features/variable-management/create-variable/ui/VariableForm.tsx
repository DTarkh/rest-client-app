'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Input } from '@/src/shared/ui/input';
import { Button } from '@/src/shared/ui/button';
import { Textarea } from '@/src/shared/ui/textarea';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { variableSchema, type VariableFormData } from '../model/validation';
import { useI18n, type ErrorType } from '../model/i18n';

type VariableFormProps = {
  variable?: VariableFormData;
  onSubmit: (data: VariableFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
};

export const VariableForm = ({
  variable,
  onSubmit,
  onCancel,
  isEditing = false,
}: VariableFormProps) => {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VariableFormData>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      name: variable?.name || '',
      value: variable?.value || '',
      description: variable?.description || '',
      isSecret: variable?.isSecret || false,
    },
  });

  const isSecret = watch('isSecret');
  const nameValue = watch('name');

  const handleFormSubmit = async (data: VariableFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(isEditing ? t('successUpdate') : t('successCreate'));
    } catch (error: unknown) {
      let errorMessage = t('unknownError');

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {isEditing ? <Edit size={20} /> : <Plus size={20} />}
          {isEditing ? t('titleEdit') : t('titleNew')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          <div className='space-y-2 flex flex-col'>
            <label htmlFor='name' className='text-sm font-medium'>
              {t('nameLabel')}
            </label>
            <Input
              id='name'
              placeholder={t('namePlaceholder') as string}
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className='text-sm text-red-500'>
                {t(errors.name?.message as ErrorType) as string}
              </p>
            )}
            <p className='text-xs text-gray-500'>
              {t('nameHelp')} {'{{'}
              {nameValue || 'variableName'}
              {'}}'}
            </p>
          </div>

          <div className='space-y-2'>
            <label htmlFor='value' className='text-sm font-medium flex items-center gap-2'>
              {t('valueLabel')}
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setShowValue(!showValue)}
                className='h-6 w-6 p-0'
              >
                {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
            </label>
            <Input
              id='value'
              type={isSecret && !showValue ? 'password' : 'text'}
              placeholder={t('valuePlaceholder') as string}
              {...register('value')}
              className={errors.value ? 'border-red-500' : ''}
            />
            {errors.value && (
              <p className='text-sm text-red-500'>{t(errors.value.message as ErrorType)}</p>
            )}
          </div>

          <div className='space-y-2 flex flex-col'>
            <label htmlFor='description' className='text-sm font-medium'>
              {t('descriptionLabel')}
            </label>
            <Textarea
              id='description'
              placeholder={t('descriptionPlaceholder') as string}
              rows={2}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>{t(errors.description.message as ErrorType)}</p>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isSecret'
              checked={isSecret}
              onCheckedChange={checked => setValue('isSecret', Boolean(checked))}
            />
            <label htmlFor='isSecret' className='text-sm font-medium cursor-pointer'>
              {t('secretLabel')}
            </label>
          </div>

          <div className='flex gap-4 pt-3 '>
            <Button type='submit' disabled={isSubmitting} className='flex-1'>
              {isSubmitting
                ? isEditing
                  ? t('submitUpdating')
                  : t('submitCreating')
                : isEditing
                  ? t('submitUpdate')
                  : t('submitCreate')}
            </Button>
            {onCancel && (
              <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
                {t('cancelButton')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
