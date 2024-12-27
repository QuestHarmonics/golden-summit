import { BaseEntity } from '../core';
import { Food } from '../health/nutrition';

export interface CookingSkill extends BaseEntity {
  level: number;
  currentXP: number;
  requiredXP: number;
  specialties: CookingSpecialty[];
  techniques: CookingTechnique[];
  recipesKnown: string[];
  achievements: CookingAchievement[];
}

export interface CookingSession extends BaseEntity {
  startTime: Date;
  endTime?: Date;
  recipeId?: string;
  techniques: CookingTechnique[];
  ingredients: Food[];
  difficulty: number;
  xpGained?: number;
  success: boolean;
  notes?: string;
}

export type CookingSpecialty =
  | 'meat-preparation'
  | 'fermentation'
  | 'organ-meats'
  | 'bone-broth'
  | 'meal-prep'
  | 'preservation';

export type CookingTechnique =
  | 'grilling'
  | 'smoking'
  | 'fermenting'
  | 'braising'
  | 'sous-vide'
  | 'dehydrating';

export interface CookingAchievement {
  id: string;
  name: string;
  description: string;
  xpBonus: number;
  requirements: {
    technique?: CookingTechnique;
    minLevel?: number;
    recipesNeeded?: number;
    specialIngredients?: string[];
  };
} 