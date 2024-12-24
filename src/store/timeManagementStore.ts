import { create } from 'zustand';
import { Task, Habit } from '../types/timeManagement';

interface TimeManagementStore {
  tasks: Task[];
  habits: Habit[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addHabit: (habit: Habit) => void;
  updateHabitStreak: (habitId: string, completed: boolean) => void;
}

export const useTimeManagementStore = create<TimeManagementStore>((set) => ({
  tasks: [],
  habits: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  updateHabitStreak: (habitId, completed) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              streak: completed ? h.streak + 1 : 0,
              bestStreak: completed
                ? Math.max(h.bestStreak, h.streak + 1)
                : h.bestStreak,
              lastCompleted: completed ? new Date() : h.lastCompleted,
            }
          : h
      ),
    })),
})); 