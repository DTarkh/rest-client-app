'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, Copy, Calendar, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { useI18n } from '../model/i18n';
import type { Variable } from '../../../entities/variable/';

type VariableCardProps = {
  variable: Variable;
  onEdit: (variable: Variable) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
};

export const VariableCard = ({
  variable,
  onEdit,
  onDelete,
  isSelected,
  onClick,
}: VariableCardProps) => {
  const { t } = useI18n();
  const [showValue, setShowValue] = useState(false);

  const copyName = () => {
    navigator.clipboard.writeText(`{{${variable.name}}}`);
    toast.success(t('copyNameSuccess'));
  };

  const copyValue = () => {
    navigator.clipboard.writeText(variable.value);
    toast.success(t('copyValueSuccess'));
  };

  const handleDelete = () => {
    if (confirm(`${t('deleteConfirm')} "${variable.name}"?`)) {
      onDelete(variable.id);
    }
  };

  const displayValue =
    variable.isSecret && !showValue
      ? '•'.repeat(Math.min(variable.value.length, 12))
      : variable.value;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
      data-testid='variable-card'
    >
      <CardContent className='p-4'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='font-mono text-xs'>
                {'{{'}
                {variable.name}
                {'}}'}
              </Badge>
              {variable.isSecret && (
                <Badge variant='secondary' className='text-xs'>
                  {t('secretBadge')}
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  copyName();
                }}
                className='h-7 w-7 p-0'
                data-testid='copy-variable-name'
              >
                <Hash size={14} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEdit(variable);
                }}
                className='h-7 w-7 p-0'
                data-testid='edit-variable'
              >
                <Edit size={14} />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className='h-7 w-7 p-0 text-red-500 hover:text-red-700'
                data-testid='delete-variable'
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>{t('valueLabel')}</span>
              {variable.isSecret && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setShowValue(!showValue);
                  }}
                  className='h-6 w-6 p-0'
                  data-testid='toggle-secret'
                >
                  {showValue ? <EyeOff size={12} /> : <Eye size={12} />}
                </Button>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  copyValue();
                }}
                className='h-6 w-6 p-0'
                data-testid='copy-variable-value'
              >
                <Copy size={12} />
              </Button>
            </div>
            <div
              className='bg-gray-50 p-2 rounded text-sm font-mono break-all'
              data-testid='variable-value'
            >
              {displayValue}
            </div>
          </div>

          {variable.description && (
            <div className='text-sm text-gray-600'>{variable.description}</div>
          )}

          <div className='flex items-center justify-between text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <Calendar size={12} />
              {t('createdLabel')} {new Date(variable.createdAt).toLocaleDateString()}
            </div>
            {variable.updatedAt !== variable.createdAt && (
              <div>
                {t('updatedLabel')} {new Date(variable.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
