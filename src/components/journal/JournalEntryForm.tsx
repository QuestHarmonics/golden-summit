import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JournalEntryFormData, journalEntrySchema } from '../../schemas/journal';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { useDocumentationStore } from '../../store/documentationStore';

interface JournalEntryFormProps {
  onSuccess?: () => void;
}

export function JournalEntryForm({ onSuccess }: JournalEntryFormProps) {
  const { addJournalEntry } = useDocumentationStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntrySchema)
  });

  const onSubmit = async (data: JournalEntryFormData) => {
    try {
      await addJournalEntry({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: data.title,
        content: data.content,
        mood: data.mood,
        tags: data.tags,
        attachments: [],
        relatedQuests: []
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create journal entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        error={errors.title?.message}
        {...register('title')}
      />
      
      <TextArea
        label="Content"
        rows={4}
        error={errors.content?.message}
        {...register('content')}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Mood (1-10)"
          error={errors.mood?.message}
          {...register('mood', { valueAsNumber: true })}
        />
        
        <Input
          label="Tags (comma separated)"
          error={errors.tags?.message}
          {...register('tags')}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </Button>
      </div>
    </form>
  );
} 