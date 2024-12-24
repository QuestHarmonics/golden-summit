import { BaseEntity } from '../shared';

export interface EnergyLog extends BaseEntity {
  currentEnergy: number;
  maxEnergy: number;
  activity: string;
  energyCost: number;
  timestamp: Date;
}

export interface DailyStats extends BaseEntity {
  date: Date;
  totalTasksCompleted: number;
  totalExperienceGained: number;
  energySpent: number;
  focusTime: number;
  skillsProgressed: {
    skillId: string;
    experienceGained: number;
  }[];
} 