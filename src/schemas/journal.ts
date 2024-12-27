import { z } from 'zod';

export const journalEntrySchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10000 characters'),
  mood: z.number()
    .min(1, 'Mood must be between 1 and 10')
    .max(10, 'Mood must be between 1 and 10'),
  tags: z.string()
    .transform(str => str.split(',').map(s => s.trim()).filter(Boolean))
});

export type JournalEntryFormData = z.infer<typeof journalEntrySchema>; 