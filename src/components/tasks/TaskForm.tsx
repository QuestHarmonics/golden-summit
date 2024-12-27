import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskFormData, taskSchema } from '../../schemas/task';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { Select } from '../shared/Select';
import { DatePicker } from '../shared/DatePicker';
import { useTimeManagementStore } from '../../store/timeManagementStore';

interface TaskFormProps {
  onSuccess?: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

export function TaskForm({ onSuccess }: TaskFormProps) {
  const { addTask } = useTimeManagementStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      energyCost: 10
    }
  });

  const dueDate = watch('dueDate');

  const onSubmit = async (data: TaskFormData) => {
    try {
      await addTask({
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'TODO',
        ...data
      });
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create task:', error);
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
        label="Description"
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(date) => setValue('dueDate', date)}
          error={errors.dueDate?.message}
          minDate={new Date()}
        />
        
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Energy Cost"
          error={errors.energyCost?.message}
          {...register('energyCost', { valueAsNumber: true })}
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
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 