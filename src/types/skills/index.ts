import { BaseEntity, LifePath } from '../core';

export interface Skill extends BaseEntity {
  name: string;
  path: LifePath;
  level: number;
  experience: number;
  nextLevelXp: number;
  subskills: SubSkill[];
  description: string;
}

export interface SubSkill extends BaseEntity {
  name: string;
  level: number;
  experience: number;
  parentSkillId: string;
}

export interface SkillLog extends BaseEntity {
  skillId: string;
  xpGained: number;
  questId?: string;
  timestamp: Date;
} 