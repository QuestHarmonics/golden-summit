import { ID, BaseEntity } from '../shared';

export interface Skill extends BaseEntity {
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  category: SkillCategory;
  subskills: ID[];
}

export type SkillCategory = 
  | 'PHYSICAL'
  | 'MENTAL'
  | 'SOCIAL'
  | 'CREATIVE'
  | 'PRACTICAL';

export interface Achievement extends BaseEntity {
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: string;
  icon: string;
} 