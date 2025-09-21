import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'emailRequiredError' })
      .email({ message: 'emailInvalidError' }),

    password: z
      .string()
      .min(1, { message: 'passwordRequiredError' })
      .min(8, { message: 'passwordLengthError' })
      .regex(/[a-zA-Z]/, { message: 'passwordLetterError' })
      .regex(/\d/, { message: 'passwordDigitError' })
      .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: 'passwordSpecialCharError',
      }),
    confirmPassword: z.string().min(1, { message: 'confirmPasswordRequiredError' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'passwordsMismatchError',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
