import { createI18nModule } from '@/src/shared/lib/i18n';

const errors = {
  emailRequiredError: {
    en: 'Email is required',
    ru: 'Требуется адрес электронной почты',
  },
  emailInvalidError: {
    en: 'Please enter a valid email address',
    ru: 'Пожалуйста, введите допустимый адрес электронной почты',
  },

  passwordRequiredError: {
    en: 'Password is required',
    ru: 'Требуется пароль',
  },
  passwordLengthError: {
    en: 'Password must be at least 8 characters long',
    ru: 'Пароль должен быть не менее 8 символов',
  },
  passwordLetterError: {
    en: 'Password must contain at least one letter',
    ru: 'Пароль должен содержать как минимум одну букву',
  },
  passwordDigitError: {
    en: 'Password must contain at least one digit',
    ru: 'Пароль должен содержать как минимум одну цифру',
  },
  passwordSpecialCharError: {
    en: 'Password must contain at least one special character',
    ru: 'Пароль должен содержать как минимум один специальный символ',
  },

  confirmPasswordRequiredError: {
    en: 'Please confirm your password',
    ru: 'Пожалуйста, подтвердите свой пароль',
  },
  passwordsMismatchError: {
    en: 'Passwords do not match',
    ru: 'Пароли не совпадают',
  },
} as const;

const placeholders = {
  emailPlaceholder: { en: 'Email...', ru: 'Электронная почта...' },
  passwordPlaceholder: { en: 'Password...', ru: 'Пароль...' },
  confirmPasswordPlaceholder: { en: 'Confirm Password...', ru: 'Подтвердите пароль...' },
} as const;

export const useI18n = createI18nModule({
  title: { en: 'Sign Up', ru: 'Регистрация' },
  subtitle: {
    en: 'Want to sign up? Fill out this form please',
    ru: 'Хотите зарегистрироваться? Пожалуйста, заполните эту форму',
  },

  ...placeholders,
  ...errors,

  registerButton: { en: 'Register', ru: 'Зарегистрироваться' },
});

export type ErrorType = keyof typeof errors;
