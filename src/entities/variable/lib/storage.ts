import localforage from 'localforage';
import { Variable } from '../model/variable.types';
import { logger } from '@/shared/lib/logger';

const STORAGE_KEY = 'swagger-lite-variables';

const variablesStore = localforage.createInstance({
  name: 'SwaggerLite',
  storeName: 'variables',
  description: 'Variables storage for Swagger Lite',
});

export class VariableStorage {
  static async loadVariables(): Promise<Variable[]> {
    try {
      const variables = await variablesStore.getItem<Variable[]>(STORAGE_KEY);
      return variables || [];
    } catch (error) {
      logger('Error loading variables from storage:', error);
      return [];
    }
  }

  static async saveVariables(variables: Variable[]): Promise<void> {
    try {
      await variablesStore.setItem(STORAGE_KEY, variables);
    } catch (error) {
      logger('Error saving variables to storage:', error);
      throw new Error('Не удалось сохранить переменные');
    }
  }

  static async clearVariables(): Promise<void> {
    try {
      await variablesStore.removeItem(STORAGE_KEY);
    } catch (error) {
      logger('Error clearing variables from storage:', error);
      throw new Error('Не удалось очистить переменные');
    }
  }

  static async exportVariables(): Promise<string> {
    try {
      const variables = await this.loadVariables();
      return JSON.stringify(
        {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          variables: variables.map(v => ({
            ...v,
            value: v.isSecret ? '***SECRET***' : v.value,
          })),
        },
        null,
        2,
      );
    } catch (error) {
      logger(error);
      throw new Error('Ошибка экспорта переменных');
    }
  }

  static async importVariables(jsonData: string): Promise<Variable[]> {
    try {
      const data = JSON.parse(jsonData);

      if (!data.variables || !Array.isArray(data.variables)) {
        throw new Error('Неверный формат файла');
      }

      const validVariables: Variable[] = [];

      for (const variable of data.variables) {
        if (variable.name && variable.value !== undefined) {
          validVariables.push({
            id: crypto.randomUUID(),
            name: variable.name,
            value: variable.value === '***SECRET***' ? '' : variable.value,
            description: variable.description || '',
            isSecret: variable.isSecret || false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      return validVariables;
    } catch (error) {
      logger(error);
      throw new Error('Не удалось импортировать переменные. Проверьте формат файла.');
    }
  }
}
