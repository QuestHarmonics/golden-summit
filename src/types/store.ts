import { User } from './user';
import { Task } from './task';
import { Skill } from './progress';

// Base store interface that all stores should extend
export interface BaseStore {
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Root store for main app state
export interface RootStore extends BaseStore {
  initialized: boolean;
  initializeStores: () => Promise<void>;
}

// Auth store for user management
export interface AuthStore extends BaseStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Task store for task management
export interface TaskStore extends BaseStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
}

// Progress store for skills and achievements
export interface ProgressStore extends BaseStore {
  skills: Skill[];
  updateSkill: (skillId: string, xpGain: number) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (skillId: string) => void;
} 