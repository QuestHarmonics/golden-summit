import { BaseEntity } from './core';
import { WeatherCondition } from './weather';
import { MoonPhase } from './moon';
import { CostTier } from './farm/development';
import { LifePath } from './core';

export interface AgricultureActivity extends BaseEntity {
  name: string;
  category: 'planting' | 'maintenance' | 'harvesting' | 'processing';
  lifePath: LifePath;
  energyCost: number;
  duration: number;
  optimalConditions: {
    weather: WeatherCondition[];
    moonPhase?: MoonPhase[];
    timeOfDay: TimeOfDay[];
    season: Season[];
  };
  rewards: {
    xp: number;
    resources: Array<{
      id: string;
      amount: Record<CostTier, number>;
    }>;
    skills: Array<{
      id: string;
      xp: number;
    }>;
  };
  requirements: {
    skills: Record<string, number>;
    tools: string[];
    energy: number;
  };
}

export interface FarmingQuest extends BaseEntity {
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'project';
  activities: string[]; // AgricultureActivity IDs
  rewards: {
    xp: number;
    capital: number;
    items: string[];
  };
  season?: Season;
  deadline?: Date;
  repeatable: boolean;
}

// Integration with your existing progress system
export interface FarmingProgress extends BaseEntity {
  questsCompleted: number;
  cropsHarvested: Record<string, number>;
  resourcesGathered: Record<string, number>;
  skillLevels: Record<string, number>;
  achievements: string[];
  statistics: {
    totalYield: number;
    revenue: number;
    sustainabilityScore: number;
  };
} 