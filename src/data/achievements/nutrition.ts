import { NutritionAchievement } from '../../types/nutrition';

export const NUTRITION_ACHIEVEMENTS: NutritionAchievement[] = [
  // Carnivore Mastery
  {
    id: 'carnivore_initiate',
    title: 'Carnivore Initiate',
    description: 'Maintain a pure carnivore diet for 7 days',
    requirement: {
      type: 'STREAK',
      metric: 'carnivoreStreak',
      threshold: 7
    },
    xpReward: 1000,
    forceMultiplier: 1.2
  },
  {
    id: 'carnivore_master',
    title: 'Carnivore Master',
    description: 'Maintain a pure carnivore diet for 30 days',
    requirement: {
      type: 'STREAK',
      metric: 'carnivoreStreak',
      threshold: 30
    },
    xpReward: 5000,
    forceMultiplier: 1.5
  },

  // Raw Food Mastery
  {
    id: 'raw_primal',
    title: 'Raw Primal',
    description: 'Consume raw animal foods for 7 consecutive days',
    requirement: {
      type: 'STREAK',
      metric: 'rawFoodStreak',
      threshold: 7
    },
    xpReward: 2000,
    forceMultiplier: 1.4,
    unlocks: ['raw_strength_bonus']
  },

  // Organ Meat Mastery
  {
    id: 'organ_master',
    title: 'Organ Master',
    description: 'Consume organ meats daily for 14 days',
    requirement: {
      type: 'STREAK',
      metric: 'organMeatStreak',
      threshold: 14
    },
    xpReward: 3000,
    forceMultiplier: 1.6,
    unlocks: ['vital_force_bonus']
  },

  // Daily Challenges
  {
    id: 'liver_king',
    title: 'Liver King',
    description: 'Consume raw liver three times in one day',
    requirement: {
      type: 'QUANTITY',
      metric: 'RAW_LIVER',
      threshold: 3,
      timeframe: 'DAILY'
    },
    xpReward: 1000,
    forceMultiplier: 2.0
  },
  
  // Weekly Challenges
  {
    id: 'seafood_warrior',
    title: 'Seafood Warrior',
    description: 'Consume 500g of seafood in a week',
    requirement: {
      type: 'QUANTITY',
      metric: 'SEAFOOD',
      threshold: 500,
      timeframe: 'WEEKLY'
    },
    xpReward: 1500,
    forceMultiplier: 1.3
  }
];

// Special combinations that unlock additional bonuses
export const NUTRITION_COMBINATIONS = [
  {
    id: 'primal_feast',
    title: 'Primal Feast',
    description: 'Consume raw liver, raw eggs, and raw fish in the same day',
    foods: ['RAW_LIVER', 'RAW_EGGS', 'RAW_FISH'],
    bonus: {
      xpMultiplier: 2.5,
      statBoosts: {
        strength: 1.5,
        vitality: 2.0,
        recovery: 1.8
      }
    }
  },
  {
    id: 'organ_feast',
    title: 'Organ Feast',
    description: 'Consume liver, heart, and brain in the same day',
    foods: ['LIVER', 'HEART', 'BRAIN'],
    bonus: {
      xpMultiplier: 2.0,
      statBoosts: {
        intelligence: 2.0,
        energy: 1.5,
        regeneration: 1.5
      }
    }
  }
]; 