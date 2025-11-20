import z from 'zod';

export const variableSchema = z.object({
  name: z
    .string()
    .min(1, 'The variable name is required')
    .max(50, 'The name must not exceed 50 characters.')
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      'The name can contain only letters, numbers, and underscores.',
    ),
  value: z.string().max(1000, 'The value must not exceed 1000 characters.'),
  description: z.string().max(200, 'The description must not exceed 200 characters.').optional(),
  isSecret: z.boolean().optional(),
});

export type VariableFormData = z.infer<typeof variableSchema>;
