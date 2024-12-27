import { z } from 'zod';

export const habitSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  energyCost: z.number()
    .min(1, 'Energy cost must be at least 1')
    .max(100, 'Energy cost must be less than 100')
});

export type HabitFormData = z.infer<typeof habitSchema>; 