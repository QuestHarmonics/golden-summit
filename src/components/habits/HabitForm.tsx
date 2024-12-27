import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HabitFormData, habitSchema } from '../../schemas/habit';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { useTimeManagementStore } from '../../store/timeManagementStore';

interface HabitFormProps {
  onSuccess?: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' }
];

export function HabitForm({ onSuccess }: HabitFormProps) {
  const { addHabit } = useTimeManagementStore();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      frequency: 'DAILY',
      energyCost: 5
    }
  });

  const onSubmit = async (data: HabitFormData) => {
    try {
      await addHabit({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        streak: 0,
        bestStreak: 0,
        ...data
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        error={errors.name?.message}
        {...register('name')}
      />
      
      <TextArea
        label="Description"
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Frequency"
          options={FREQUENCY_OPTIONS}
          error={errors.frequency?.message}
          {...register('frequency')}
        />
        
        <Input
          type="number"
          label="Energy Cost"
          error={errors.energyCost?.message}
          {...register('energyCost', { valueAsNumber: true })}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Habit'}
        </Button>
      </div>
    </form>
  );
} 