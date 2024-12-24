export type FoodCategory = 
  | 'ORGAN_MEAT' 
  | 'RAW_MEAT'
  | 'COOKED_MEAT'
  | 'SEAFOOD'
  | 'EGGS_DAIRY'
  | 'PLANT'
  | 'PROCESSED';

export type FoodType = keyof typeof FOOD_MULTIPLIERS;

export interface NutritionMetrics {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  foods: FoodEntry[];
  carnivoreStreak: number;
  organMeatStreak: number;
  rawFoodStreak: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface FoodEntry {
  type: FoodType;
  category: FoodCategory;
  grams: number;
  isRaw: boolean;
  protein: number;
  fat: number;
  carbs: number;
  timestamp: Date;
}

export interface NutritionAchievement {
  id: string;
  title: string;
  description: string;
  requirement: NutritionRequirement;
  xpReward: number;
  forceMultiplier: number;
  unlocks?: string[]; // IDs of items/abilities unlocked
}

export interface NutritionRequirement {
  type: 'STREAK' | 'QUANTITY' | 'COMBINATION';
  metric: string;
  threshold: number;
  timeframe?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
} 