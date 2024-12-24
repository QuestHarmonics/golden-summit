import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  energyCost: z.number()
    .min(1, 'Energy cost must be at least 1')
    .max(100, 'Energy cost must be less than 100'),
  tags: z.string()
    .transform(str => str.split(',').map(s => s.trim()).filter(Boolean))
});

export type TaskFormData = z.infer<typeof taskSchema>; 