import { createI18nModule } from '@/src/shared/lib/i18n';

const errors = {
  nameRequiredError: {
    en: 'Variable name is required',
    ru: 'Имя переменной обязательно',
  },
  nameMaxLengthError: {
    en: 'Name must not exceed 50 characters',
    ru: 'Имя не должно превышать 50 символов',
  },
  nameFormatError: {
    en: 'Name can contain only letters, numbers, and underscores',
    ru: 'Имя может содержать только буквы, цифры и подчеркивания',
  },
  valueMaxLengthError: {
    en: 'Value must not exceed 1000 characters',
    ru: 'Значение не должно превышать 1000 символов',
  },
  descriptionMaxLengthError: {
    en: 'Description must not exceed 200 characters',
    ru: 'Описание не должно превышать 200 символов',
  },
} as const;

export const useI18n = createI18nModule({
  titleEdit: { en: 'Edit variable', ru: 'Редактировать переменную' },
  titleNew: { en: 'New variable', ru: 'Новая переменная' },
  nameLabel: { en: 'Variable name', ru: 'Имя переменной' },
  namePlaceholder: { en: 'authToken', ru: 'authToken' },
  nameHelp: { en: 'Will be used as', ru: 'Будет использоваться как' },
  valueLabel: { en: 'Value', ru: 'Значение' },
  valuePlaceholder: { en: 'Bearer eyJhbGciOiJIUzI1NiIs...', ru: 'Bearer eyJhbGciOiJIUzI1NiIs...' },
  descriptionLabel: { en: 'Description (optional)', ru: 'Описание (необязательно)' },
  descriptionPlaceholder: {
    en: 'JWT token for authorization in the API',
    ru: 'JWT токен для авторизации в API',
  },
  secretLabel: {
    en: 'Secret value (hide when displayed)',
    ru: 'Секретное значение (скрывать при отображении)',
  },
  submitCreating: { en: 'Creating...', ru: 'Создание...' },
  submitCreate: { en: 'Create', ru: 'Создать' },
  submitUpdating: { en: 'Updating...', ru: 'Обновление...' },
  submitUpdate: { en: 'Update', ru: 'Обновить' },
  cancelButton: { en: 'Cancel', ru: 'Отмена' },
  successCreate: { en: 'Variable successfully created', ru: 'Переменная успешно создана' },
  successUpdate: { en: 'Variable successfully updated', ru: 'Переменная успешно обновлена' },
  unknownError: { en: 'Something went wrong', ru: 'Что-то пошло не так' },
  ...errors,
});

export type ErrorType = keyof typeof errors;
