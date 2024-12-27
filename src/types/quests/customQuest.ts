import { BaseEntity } from '../core';
import { Difficulty } from '../core';

export interface CustomQuest extends BaseEntity {
  title: string;
  description: string;
  difficulty: Difficulty;
  schedule?: QuestSchedule;
  rewards: {
    baseXP: number;
    skillXP?: Record<string, number>;
    resources?: Record<string, number>;
  };
  requirements?: {
    minLevel?: number;
    skills?: Record<string, number>;
    resources?: Record<string, number>;
  };
  tracking: {
    type: 'boolean' | 'numeric' | 'timer' | 'checklist';
    target?: number;
    checklistItems?: string[];
    currentProgress?: number;
  };
  tags: string[];
  linkedActivities?: string[]; // IDs of related activities/skills
}

export interface QuestSchedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate?: Date;
  customPattern?: {
    days?: number[];  // 0-6 for weekly
    dates?: number[]; // 1-31 for monthly
    times?: string[]; // HH:mm format
    interval?: number; // For custom intervals
  };
  reminders?: {
    enabled: boolean;
    beforeMinutes: number[];
  };
} 