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

interface ResourceSystem {
  energy: {
    current: number;
    max: number;
    regenerationRate: number;
    modifiers: ResourceModifier[];
  };
  time: {
    available: number;
    allocated: Record<string, number>;
    efficiency: number;
  };
  skills: {
    [skillName: string]: {
      level: number;
      experience: number;
      multipliers: Record<string, number>;
    };
  };
} 