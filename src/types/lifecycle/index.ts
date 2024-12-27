export type CycleFrequency = 'daily' | 'weekly' | 'monthly' | 'seasonal';
export type CycleCategory = 'survival' | 'maintenance' | 'growth' | 'creation';
export type EnergyImpact = 'low' | 'medium' | 'high';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface PassiveAccumulator {
  rate: number;  // XP per hour
  multiplier: number;
  lastUpdate: Date;
  capacity: number;
  stored: number;
  unlocked: boolean;
}

export interface LifeCycleActivity {
  id: string;
  title: string;
  category: CycleCategory;
  frequency: CycleFrequency;
  energyImpact: EnergyImpact;
  preferredTime?: TimeOfDay;
  baseXP: number;
  streakBonus: number;
  requirements?: {
    previousActivities?: string[];
    timeOfDay?: TimeOfDay[];
    energy?: number;
  };
  buffs?: {
    energyRestore?: number;
    focusBoost?: number;
    skillMultiplier?: number;
  };
  passiveBonus?: {
    accumulatorBoost: number;
    capacityBoost: number;
  };
}

// Example activities organized by category
export const LIFE_CYCLE_ACTIVITIES: LifeCycleActivity[] = [
  // Survival Category (Basic needs & health)
  {
    id: 'morning-routine',
    title: 'Morning Ritual',
    category: 'survival',
    frequency: 'daily',
    energyImpact: 'low',
    preferredTime: 'morning',
    baseXP: 50,
    streakBonus: 10,
    buffs: {
      energyRestore: 20,
      focusBoost: 1.2
    }
  },
  {
    id: 'exercise',
    title: 'Physical Training',
    category: 'survival',
    frequency: 'daily',
    energyImpact: 'high',
    baseXP: 100,
    streakBonus: 20,
    buffs: {
      energyRestore: 10,
      skillMultiplier: 1.1
    }
  },

  // Maintenance Category (Environment & Resources)
  {
    id: 'home-maintenance',
    title: 'Living Space Upkeep',
    category: 'maintenance',
    frequency: 'weekly',
    energyImpact: 'medium',
    baseXP: 150,
    streakBonus: 30,
    buffs: {
      focusBoost: 1.1
    }
  },
  {
    id: 'meal-prep',
    title: 'Food Preparation',
    category: 'maintenance',
    frequency: 'daily',
    energyImpact: 'medium',
    baseXP: 75,
    streakBonus: 15,
    buffs: {
      energyRestore: 30
    }
  },

  // Growth Category (Learning & Development)
  {
    id: 'skill-practice',
    title: 'Skill Development',
    category: 'growth',
    frequency: 'daily',
    energyImpact: 'medium',
    baseXP: 100,
    streakBonus: 25,
    requirements: {
      energy: 50
    },
    buffs: {
      skillMultiplier: 1.2
    }
  },
  {
    id: 'reading',
    title: 'Knowledge Absorption',
    category: 'growth',
    frequency: 'daily',
    energyImpact: 'low',
    baseXP: 50,
    streakBonus: 10,
    buffs: {
      focusBoost: 1.15
    }
  },

  // Creation Category (Projects & Art)
  {
    id: 'creative-work',
    title: 'Creative Session',
    category: 'creation',
    frequency: 'daily',
    energyImpact: 'high',
    baseXP: 150,
    streakBonus: 30,
    requirements: {
      energy: 70,
      timeOfDay: ['morning', 'afternoon']
    },
    buffs: {
      skillMultiplier: 1.3
    }
  }
]; 