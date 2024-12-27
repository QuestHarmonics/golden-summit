import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '../types/tasks';

interface TaskStore {
  tasks: Task[];
  points: number;
  completeTask: (taskId: string) => void;
  resetProgress: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      points: 0,
      completeTask: (taskId) => set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, completed: true } : task
        ),
        points: state.points + (state.tasks.find(t => t.id === taskId)?.points || 0)
      })),
      resetProgress: () => set({ tasks: INITIAL_TASKS, points: 0 })
    }),
    {
      name: 'homestead-progress'
    }
  )
); 