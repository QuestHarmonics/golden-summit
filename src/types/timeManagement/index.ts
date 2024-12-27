import { ID, BaseEntity } from '../shared';

export interface Task extends BaseEntity {
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  energyCost: number;
  questId?: ID;
  tags: string[];
}

export interface Habit extends BaseEntity {
  name: string;
  description: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  streak: number;
  bestStreak: number;
  lastCompleted?: Date;
  energyCost: number;
} 