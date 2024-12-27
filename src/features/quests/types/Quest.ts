import { Timestamp } from 'firebase/firestore';

export enum QuestStatus {
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum QuestType {
  PERSONAL = 'personal',
  FAMILY = 'family'
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface QuestReward {
  xp: number;
  gold: number;
  items?: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  familyId: string;
  createdBy: string;
  assignedTo?: string;
  reward: QuestReward;
  deadline?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  failedAt?: Timestamp;
  requirements?: string[];
  tags?: string[];
} 