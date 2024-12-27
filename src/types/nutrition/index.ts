import { BaseEntity } from '../core';
import { PrimalRecipe, PrimalCategory, QualityRequirement } from './primal';
import { WeatherCondition } from '../weather';
import { MoonPhase } from '../moon';

// Extend the base nutrition types to include primal options
export interface NutritionProfile extends BaseEntity {
  dietType: DietType;
  restrictions: DietaryRestriction[];
  preferences: FoodPreference[];
  currentGoals: NutritionGoal[];
  primalLevel: PrimalProgression;
  seasonalPreferences: Record<Season, FoodPreference[]>;
}

export type DietType = 
  | 'standard'
  | 'primal-beginner'
  | 'primal-intermediate'
  | 'primal-advanced'
  | 'carnivore'
  | 'custom';

export interface NutritionGoal {
  type: 'primal-adaptation' | 'healing' | 'maintenance' | 'performance';
  targetFoods: string[];
  duration: number; // days
  progress: number;
  primalRecipes?: PrimalRecipe[];
}

export interface PrimalProgression {
  level: number;
  experience: number;
  unlockedCategories: PrimalCategory[];
  masterRecipes: string[];
  currentChallenges: PrimalChallenge[];
}

export interface PrimalChallenge extends BaseEntity {
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: number; // days
  requirements: {
    recipes: string[];
    ingredients: string[];
    techniques: string[];
    consistency: number; // percentage
  };
  rewards: {
    xp: number;
    unlocksRecipe?: string;
    unlocksCategory?: PrimalCategory;
  };
  weatherBonus?: WeatherCondition[];
  moonPhaseBonus?: MoonPhase[];
}

export type FoodCategory = 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'snacks';
export type EnergyEffect = 'instant' | 'sustained' | 'boost';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  energyType: EnergyEffect;
  energyValue: number;
  regenerationRate?: number;  // Energy per minute
  regenerationDuration?: number;  // Duration in minutes
  buffs?: {
    focusBoost?: number;
    skillMultiplier?: number;
    energyEfficiency?: number;
  };
}

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'protein-meal',
    name: 'Protein-Rich Meal',
    category: 'protein',
    energyType: 'sustained',
    energyValue: 30,
    regenerationRate: 2,
    regenerationDuration: 120, // 2 hours
    buffs: {
      energyEfficiency: 1.2
    }
  },
  {
    id: 'fruit-snack',
    name: 'Fresh Fruit',
    category: 'fruits',
    energyType: 'instant',
    energyValue: 15,
    regenerationRate: 1,
    regenerationDuration: 30,
    buffs: {
      focusBoost: 1.1
    }
  },
  {
    id: 'energy-drink',
    name: 'Energy Drink',
    category: 'snacks',
    energyType: 'boost',
    energyValue: 25,
    regenerationRate: 3,
    regenerationDuration: 45,
    buffs: {
      skillMultiplier: 1.15
    }
  }
  // Add more food items...
]; 

export interface MealCombination {
  id: string;
  name: string;
  foods: string[];  // Food item IDs
  bonusEffects: {
    energyMultiplier?: number;
    regenerationBoost?: number;
    durationExtension?: number;
  };
}

export const MEAL_COMBINATIONS: MealCombination[] = [
  {
    id: 'balanced-lunch',
    name: 'Balanced Lunch',
    foods: ['grilled-chicken', 'sweet-potato', 'steamed-veggies'],
    bonusEffects: {
      energyMultiplier: 1.3,
      regenerationBoost: 1.5,
      durationExtension: 1.2
    }
  },
  {
    id: 'power-breakfast',
    name: 'Power Breakfast',
    foods: ['quinoa-bowl', 'berry-mix', 'banana'],
    bonusEffects: {
      energyMultiplier: 1.25,
      regenerationBoost: 1.2,
      durationExtension: 1.1
    }
  }
]; 