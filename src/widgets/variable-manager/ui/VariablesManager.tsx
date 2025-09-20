'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Download, Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useVariableStore, type Variable } from '@/src/entities/variable';
import { useInitializeVariables } from '@/src/entities/variable/';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Input } from '@/src/shared/ui/input';
import { Button } from '@/src/shared/ui/button';
import { VariableForm } from '@/src/features/variable-management/';
import { VariableCard } from './VariableCard';
import { useI18n } from '../model/i18n';
import type { VariableFormData } from '../../../features/variable-management/';

export const VariablesManager = () => {
  const { t } = useI18n();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    variables,
    isLoading,
    searchQuery,
    selectedVariableId,
    addVariable,
    updateVariable,
    deleteVariable,
    setSearchQuery,
    setSelectedVariable,
    getFilteredVariables,
    exportVariables,
    importVariables,
  } = useVariableStore();

  const initialize = useInitializeVariables();

  useEffect(() => {
    if (!hasInitialized && !isLoading) {
      setHasInitialized(true);
      initialize();
    }
  }, [initialize, isLoading, hasInitialized]);

  const filteredVariables = getFilteredVariables();

  const handleCreateVariable = async (data: VariableFormData) => {
    await addVariable(data);
    setShowCreateForm(false);
  };

  const handleUpdateVariable = async (data: VariableFormData) => {
    if (!editingVariable) return;

    await updateVariable(editingVariable.id, data);
    setEditingVariable(null);
  };

  const handleDeleteVariable = async (id: string) => {
    try {
      await deleteVariable(id);
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('unknownError'));
    }
  };

  const handleExportVariables = () => {
    try {
      const data = exportVariables();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `variables-${new Date().toISOString().split('T')[0]}.json`;
        downloadLinkRef.current.click();
      }

      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success(t('exportSuccess'));
    } catch {
      toast.error(t('unknownError'));
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportVariables = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importVariables(text);
      toast.success(t('importSuccess'));
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
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='text-gray-500'>{t('loadingText')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <a ref={downloadLinkRef} className='hidden' />
      <input
        ref={fileInputRef}
        type='file'
        accept='.json'
        onChange={handleImportVariables}
        className='hidden'
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={16}
              />
              <Input
                placeholder={t('searchPlaceholder') as string}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowCreateForm(!showCreateForm)}
                className='gap-2'
              >
                <Plus size={16} />
                {t('addButton')}
              </Button>

              <Button
                variant='outline'
                onClick={handleExportVariables}
                disabled={variables.length === 0}
                className='gap-2'
              >
                <Download size={16} />
                {t('exportButton')}
              </Button>

              <Button variant='outline' onClick={handleImportClick} className='gap-2'>
                <Upload size={16} />
                {t('importButton')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {(showCreateForm || editingVariable) && (
        <VariableForm
          variable={editingVariable || undefined}
          onSubmit={editingVariable ? handleUpdateVariable : handleCreateVariable}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingVariable(null);
          }}
          isEditing={!!editingVariable}
        />
      )}

      {filteredVariables.length === 0 ? (
        <Card>
          <CardContent className='text-center py-12'>
            {variables.length === 0 ? (
              <>
                <FileText size={48} className='mx-auto mb-4 text-gray-400' />
                <h3 className='text-lg font-semibold mb-2'>{t('emptyTitle')}</h3>
                <p className='text-gray-600 mb-4'>{t('emptyDescription')}</p>
                <Button onClick={() => setShowCreateForm(true)} className='gap-2'>
                  <Plus size={16} />
                  {t('createButton')}
                </Button>
              </>
            ) : (
              <>
                <AlertCircle size={48} className='mx-auto mb-4 text-gray-400' />
                <h3 className='text-lg font-semibold mb-2'>{t('notFoundTitle')}</h3>
                <p className='text-gray-600'>{t('notFoundDescription')}</p>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredVariables.map(variable => (
            <VariableCard
              key={variable.id}
              variable={variable}
              onEdit={setEditingVariable}
              onDelete={handleDeleteVariable}
              isSelected={selectedVariableId === variable.id}
              onClick={() =>
                setSelectedVariable(selectedVariableId === variable.id ? null : variable.id)
              }
            />
          ))}
        </div>
      )}

      {variables.length > 0 && (
        <Card className='bg-blue-50 border-blue-200'>
          <CardContent className='p-4'>
            <div className='text-sm text-blue-700'>
              <p className='font-medium mb-1'>{t('howToUseTitle')}</p>
              <ul className='list-disc list-inside space-y-1'>
                <li>
                  {t('howToUseUrl')}{' '}
                  <code>
                    https://api.example.com/{'{{'}version{'}}'}/users
                  </code>
                </li>
                <li>
                  {t('howToUseHeaders')}{' '}
                  <code>
                    Authorization: Bearer {'{{'}authToken{'}}'}
                  </code>
                </li>
                <li>
                  {t('howToUseBody')}{' '}
                  <code>
                    {'{'}"apiKey": "{'{{'}apiKey{'}}'}"{'}'}
                  </code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
