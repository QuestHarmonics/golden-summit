import { ID, BaseEntity } from '../shared';

export type QuestStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type QuestDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC';

export interface Quest extends BaseEntity {
  title: string;
  description: string;
  status: QuestStatus;
  difficulty: QuestDifficulty;
  experienceReward: number;
  energyCost: number;
  prerequisites: ID[];
  subquests?: ID[];
  completionCriteria: CompletionCriteria;
}

export interface CompletionCriteria {
  type: 'SINGLE_TASK' | 'MULTIPLE_TASKS' | 'HABIT' | 'TIMED';
  required: number;
  current: number;
  deadline?: Date;
} 