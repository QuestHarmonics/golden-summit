import { BaseEntity } from '../core';
import { WeatherCondition } from '../weather';
import { MoonPhase } from '../moon';
import { FoodItem } from './index';

export type PrimalCategory = 
  | 'raw-meat'
  | 'fermented'
  | 'foraged'
  | 'preserved'
  | 'medicinal-herbs'
  | 'seasonal';

export type PreparationMethod = 
  | 'raw'
  | 'fermented'
  | 'dried'
  | 'smoked'
  | 'cured'
  | 'infused';

export interface QualityRequirement {
  freshness: number;
  purity: number;
  preparation: number;
}

export interface PrimalRecipe extends BaseEntity {
  name: string;
  category: PrimalCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  ingredients: {
    id: string;
    amount: number;
    quality: QualityRequirement;
  }[];
  preparationMethod: PreparationMethod;
  seasonalBonus?: {
    season: Season;
    multiplier: number;
  };
  weatherBonus?: {
    condition: WeatherCondition;
    effect: string;
  };
  moonPhaseBonus?: {
    phase: MoonPhase;
    effect: string;
  };
  energyProperties: {
    baseValue: number;
    regenerationRate: number;
    duration: number;
    specialEffects?: {
      type: 'primal-boost' | 'nature-attunement' | 'ancestral-strength';
      magnitude: number;
    }[];
  };
}

// Example primal recipes that integrate with the energy system
export const PRIMAL_RECIPES: PrimalRecipe[] = [
  {
    id: 'raw-liver-tonic',
    name: 'Raw Liver Vitality Tonic',
    category: 'raw-meat',
    difficulty: 4,
    ingredients: [
      {
        id: 'grass-fed-liver',
        amount: 100,
        quality: { freshness: 0.9, purity: 0.95, preparation: 0.8 }
      },
      {
        id: 'herbs-blend',
        amount: 20,
        quality: { freshness: 0.8, purity: 0.9, preparation: 0.7 }
      }
    ],
    preparationMethod: 'raw',
    moonPhaseBonus: {
      phase: 'full',
      effect: 'vitality-amplification'
    },
    energyProperties: {
      baseValue: 50,
      regenerationRate: 4,
      duration: 360, // 6 hours
      specialEffects: [
        { type: 'primal-boost', magnitude: 1.5 },
        { type: 'ancestral-strength', magnitude: 1.3 }
      ]
    }
  },
  {
    id: 'fermented-herbs-elixir',
    name: 'Fermented Herbs Elixir',
    category: 'medicinal-herbs',
    difficulty: 3,
    ingredients: [
      {
        id: 'wild-herbs',
        amount: 50,
        quality: { freshness: 0.7, purity: 0.9, preparation: 0.85 }
      }
    ],
    preparationMethod: 'fermented',
    weatherBonus: {
      condition: 'stormy',
      effect: 'potency-enhancement'
    },
    energyProperties: {
      baseValue: 30,
      regenerationRate: 2,
      duration: 240,
      specialEffects: [
        { type: 'nature-attunement', magnitude: 1.4 }
      ]
    }
  }
]; 