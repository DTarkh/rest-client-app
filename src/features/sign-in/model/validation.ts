import { z } from 'zod';

export const loginSchema = z.object({
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
});

export type LoginFormData = z.infer<typeof loginSchema>;
