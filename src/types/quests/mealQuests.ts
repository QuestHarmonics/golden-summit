import { BaseEntity } from '../core';
import { Food, NutrientProfile } from '../health/nutrition';
import { CookingTechnique } from '../skills/cooking';
import { WeatherCondition } from '../weather';
import { MoonPhase } from '../moon';

export interface MealQuest extends BaseEntity {
  title: string;
  description: string;
  type: MealQuestType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  requiredIngredients: Food[];
  optionalIngredients: Food[];
  suggestedTechniques: CookingTechnique[];
  nutritionGoals: Partial<NutrientProfile>;
  timeEstimate: number; // minutes
  servings: number;
  seasonalBonus: boolean;
  weatherBonus?: {
    condition: WeatherCondition;
    multiplier: number;
  };
  moonPhaseBonus?: {
    phase: MoonPhase;
    multiplier: number;
  };
  xpReward: number;
  skillXpReward: number;
  completionCriteria: MealQuestCriteria;
}

export type MealQuestType =
  | 'meal-prep'
  | 'seasonal-special'
  | 'nutrient-focused'
  | 'technique-mastery'
  | 'preservation'
  | 'fermentation'
  | 'bone-broth';

export interface MealQuestCriteria {
  requiredTechniques: CookingTechnique[];
  minimumDuration: number;
  nutrientThresholds: Partial<NutrientProfile>;
  requiredIngredients: string[];
  qualityRequirements: Record<string, string>;
} 