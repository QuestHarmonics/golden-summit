import { BaseEntity } from '../shared';

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  baseXpRate: number; // Passive XP gain per hour
  multiplier: number; // Current force multiplier
  multiplierExpiry?: Date; // When the force multiplier expires
}

export interface XPModifier {
  id: string;
  source: 'quest' | 'task' | 'achievement';
  multiplier: number;
  duration: number; // in milliseconds
  startTime: Date;
  skillIds?: string[]; // If undefined, applies to all skills
}

export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: Date;
  icon?: string;
  requirements: {
    type: string;
    value: number;
  }[];
} 