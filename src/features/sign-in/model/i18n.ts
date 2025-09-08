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
} as const;

const placeholders = {
  emailPlaceholder: { en: 'Enter your email...', ru: 'Введите адрес электронной почты...' },
  passwordPlaceholder: { en: 'Enter your password...', ru: 'Введите пароль...' },
} as const;

export const useI18n = createI18nModule({
  title: { en: 'Sign In', ru: 'Вход' },
  subtitle: {
    en: 'To sign in please enter your email address and password',
    ru: 'Чтобы войти, введите адрес электронной почты и пароль',
  },

  ...placeholders,
  ...errors,

  loginButton: { en: 'Login', ru: 'Вход' },
});

export type ErrorType = keyof typeof errors;
