import { BaseEntity, Difficulty, LifePath } from '../core';

export interface Quest extends BaseEntity {
  title: string;
  description: string;
  path: LifePath;
  difficulty: Difficulty;
  requirements: QuestRequirement[];
  rewards: {
    xp: number;
    skillXp?: Record<string, number>;
    items?: string[];
  };
  schedule?: {
    recurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
    dueDate?: Date;
  };
  completed: boolean;
  progress: number;
}

export interface QuestLog extends BaseEntity {
  questId: string;
  startedAt: Date;
  completedAt?: Date;
  progress: number;
  notes?: string;
} 