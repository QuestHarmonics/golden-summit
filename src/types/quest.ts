export type QuestType = 
  | 'DAILY'
  | 'WEEKLY'
  | 'ACHIEVEMENT'
  | 'HOMESTEAD'
  | 'NUTRITION';

export interface QuestRequirements {
  level: number;
  count?: number;
  skills?: {
    type: string;
    level: number;
  }[];
  resources?: {
    type: string;
    amount: number;
  }[];
  prerequisites?: string[]; // Quest IDs that must be completed first
}

export interface QuestRewards {
  xp: number;
  resources?: {
    type: string;
    amount: number;
  }[];
  unlocks?: string[]; // IDs of items/abilities unlocked
  forceMultiplier?: number;
} 