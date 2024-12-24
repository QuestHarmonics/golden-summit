import { create } from 'zustand';
import { BiometricDeviceService } from '../services/biometrics/deviceIntegration';
import {
  SleepMetrics,
  PhysicalMetrics,
  CognitiveMetrics,
  BloodMetrics,
  EnvironmentalMetrics,
  NutritionMetrics
} from '../types/biometrics';

interface HealthStore {
  // Current metrics
  sleep: SleepMetrics[];
  physical: PhysicalMetrics[];
  cognitive: CognitiveMetrics[];
  blood: BloodMetrics[];
  environmental: EnvironmentalMetrics[];
  nutrition: NutritionMetrics[];
  bodyMeasurements: any[];
  symptoms: any[];

  // Device service
  deviceService: BiometricDeviceService;
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;

  // Core actions
  syncHealthData: () => Promise<void>;
  clearError: () => void;

  // Game mechanics integration
  calculateHealthScore: () => number;
  getQuestRecommendations: () => any[];
  getSkillProgress: () => any[];
  getDailyAchievements: () => any[];
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  sleep: [],
  physical: [],
  cognitive: [],
  blood: [],
  environmental: [],
  nutrition: [],
  bodyMeasurements: [],
  symptoms: [],

  deviceService: new BiometricDeviceService(),
  isLoading: false,
  lastSync: null,
  error: null,

  syncHealthData: async () => {
    set({ isLoading: true, error: null });
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      await get().deviceService.syncData(startDate, endDate);
      set({ lastSync: new Date(), isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  calculateHealthScore: () => {
    const { sleep, physical, cognitive, blood, nutrition } = get();
    
    // Calculate sub-scores
    const sleepScore = calculateSleepScore(sleep[0]);
    const fitnessScore = calculateFitnessScore(physical[0]);
    const mindScore = calculateMindScore(cognitive[0]);
    const metabolicScore = calculateMetabolicScore(blood[0]);
    const nutritionScore = calculateNutritionScore(nutrition[0]);

    // Weight and combine scores
    return (sleepScore * 0.3 + 
            fitnessScore * 0.25 + 
            mindScore * 0.15 + 
            metabolicScore * 0.15 + 
            nutritionScore * 0.15);
  },

  getQuestRecommendations: () => {
    const healthScore = get().calculateHealthScore();
    const { sleep, physical, cognitive, blood, nutrition } = get();

    // Generate personalized quest recommendations based on health data
    const recommendations = [];

    // Sleep quests
    if (sleep[0]?.sleepScore < 70) {
      recommendations.push({
        type: 'SLEEP',
        title: 'Sleep Optimization',
        description: 'Improve your sleep quality',
        difficulty: 'MEDIUM'
      });
    }

    // Exercise quests
    if (physical[0]?.steps < 8000) {
      recommendations.push({
        type: 'PHYSICAL',
        title: 'Step Master',
        description: 'Reach 10,000 steps today',
        difficulty: 'EASY'
      });
    }

    // More quest recommendations based on other metrics...
    return recommendations;
  },

  getSkillProgress: () => {
    const { physical, cognitive } = get();
    
    return [
      {
        skill: 'Endurance',
        progress: calculateEnduranceProgress(physical),
        level: determineSkillLevel(physical)
      },
      {
        skill: 'Mental Focus',
        progress: calculateFocusProgress(cognitive),
        level: determineSkillLevel(cognitive)
      }
      // More skills based on health metrics...
    ];
  },

  getDailyAchievements: () => {
    const { sleep, physical, nutrition } = get();
    const achievements = [];

    // Check sleep achievements
    if (sleep[0]?.deepSleep > 120) {
      achievements.push({
        id: 'deep_sleeper',
        title: 'Deep Sleeper',
        description: 'Got over 2 hours of deep sleep'
      });
    }

    // Check physical achievements
    if (physical[0]?.steps > 10000) {
      achievements.push({
        id: 'step_master',
        title: 'Step Master',
        description: 'Reached 10,000 steps'
      });
    }

    // More achievements based on other metrics...
    return achievements;
  }
}));

// Helper functions for score calculations
function calculateSleepScore(metrics: SleepMetrics | undefined): number {
  if (!metrics) return 0;
  // Implement sleep score calculation
  return 0;
}

function calculateFitnessScore(metrics: PhysicalMetrics | undefined): number {
  if (!metrics) return 0;
  // Implement fitness score calculation
  return 0;
}

function calculateMindScore(metrics: CognitiveMetrics | undefined): number {
  if (!metrics) return 0;
  // Implement mind score calculation
  return 0;
}

function calculateMetabolicScore(metrics: BloodMetrics | undefined): number {
  if (!metrics) return 0;
  // Implement metabolic score calculation
  return 0;
}

// Add these constants at the top
const FOOD_MULTIPLIERS = {
  // Organ meats (highest tier)
  LIVER: 5.0,
  HEART: 4.5,
  KIDNEY: 4.0,
  BRAIN: 4.0,
  
  // Seafood (high tier)
  OYSTERS: 4.8,
  SALMON_ROE: 4.5,
  SARDINES: 4.0,
  WILD_SALMON: 3.8,
  
  // Raw meats (force multipliers)
  RAW_LIVER: 7.0, // Raw versions get 1.4x multiplier
  RAW_BEEF: 4.2,
  RAW_FISH: 4.0,
  RAW_EGGS: 3.5,
  
  // Regular meats
  BEEF: 3.0,
  LAMB: 2.8,
  PORK: 2.5,
  CHICKEN: 2.0,
  
  // Plants (lower tier)
  BERRIES: 1.2,
  LEAFY_GREENS: 1.0,
  ROOTS: 0.8,
  GRAINS: 0.3,
  
  // Anti-nutrients (negative multipliers)
  PROCESSED_FOODS: -2.0,
  SEED_OILS: -3.0,
  SUGAR: -2.5
};

function calculateNutritionScore(metrics: NutritionMetrics | undefined): number {
  if (!metrics) return 0;
  
  let score = 0;
  const { foods } = metrics;

  // Calculate base score from food choices
  foods.forEach(food => {
    const multiplier = FOOD_MULTIPLIERS[food.type] || 1.0;
    const rawMultiplier = food.isRaw ? 1.4 : 1.0;
    score += (food.grams * multiplier * rawMultiplier);
  });

  // Bonus for carnivore streak
  if (isCarnivoreDiet(foods)) {
    score *= 1.5; // 50% bonus for pure carnivore
  }

  // Bonus for organ meat consumption
  if (hasOrganMeats(foods)) {
    score *= 1.3; // 30% bonus for including organs
  }

  // Penalty for plant consumption
  const plantRatio = calculatePlantRatio(foods);
  if (plantRatio > 0) {
    score *= (1 - (plantRatio * 0.3)); // Up to 30% penalty for plants
  }

  return Math.min(100, score); // Cap at 100
}

// Add these nutrition-related quest recommendations
function getNutritionQuests(nutrition: NutritionMetrics[]): any[] {
  const quests = [];
  const recentNutrition = nutrition[0];

  if (!hasOrganMeats(recentNutrition?.foods)) {
    quests.push({
      type: 'NUTRITION',
      title: 'Organ Master',
      description: 'Consume liver or other organ meats today',
      difficulty: 'MEDIUM',
      xpReward: 500,
      forceMultiplier: 1.5
    });
  }

  if (!hasRawFoods(recentNutrition?.foods)) {
    quests.push({
      type: 'NUTRITION',
      title: 'Primal Force',
      description: 'Consume any raw animal food',
      difficulty: 'HARD',
      xpReward: 750,
      forceMultiplier: 2.0
    });
  }

  if (!hasSeafood(recentNutrition?.foods)) {
    quests.push({
      type: 'NUTRITION',
      title: 'Ocean\'s Bounty',
      description: 'Consume oysters or other seafood',
      difficulty: 'MEDIUM',
      xpReward: 400,
      forceMultiplier: 1.3
    });
  }

  return quests;
}

// Helper functions
function isCarnivoreDiet(foods: any[]): boolean {
  return foods.every(food => !isPlantBased(food.type));
}

function hasOrganMeats(foods: any[]): boolean {
  const organTypes = ['LIVER', 'HEART', 'KIDNEY', 'BRAIN'];
  return foods.some(food => organTypes.includes(food.type));
}

function hasRawFoods(foods: any[]): boolean {
  return foods.some(food => food.isRaw);
}

function hasSeafood(foods: any[]): boolean {
  const seafoodTypes = ['OYSTERS', 'SALMON_ROE', 'SARDINES', 'WILD_SALMON'];
  return foods.some(food => seafoodTypes.includes(food.type));
}

function calculatePlantRatio(foods: any[]): number {
  const totalGrams = foods.reduce((sum, food) => sum + food.grams, 0);
  const plantGrams = foods
    .filter(food => isPlantBased(food.type))
    .reduce((sum, food) => sum + food.grams, 0);
  
  return plantGrams / totalGrams;
}

function isPlantBased(foodType: string): boolean {
  return ['BERRIES', 'LEAFY_GREENS', 'ROOTS', 'GRAINS'].includes(foodType);
}

// Helper functions for skill calculations
function calculateEnduranceProgress(metrics: PhysicalMetrics[]): number {
  // Implement endurance progress calculation
  return 0;
}

function calculateFocusProgress(metrics: CognitiveMetrics[]): number {
  // Implement focus progress calculation
  return 0;
}

function determineSkillLevel(metrics: any[]): number {
  // Implement skill level determination
  return 1;
} 