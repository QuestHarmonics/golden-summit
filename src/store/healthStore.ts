import { createStore } from './core/createStore';
import { StoreState } from './types';
import { Food, MealEntry, NutrientProfile } from '../types/health/nutrition';
import { CONFIG } from '../config/development';

interface HealthState extends StoreState {
  vitals: {
    energy: number;
    hydration: number;
    health: number;
    lastMeal: Date | null;
    lastHydration: Date | null;
  };
  
  dailyNutrition: {
    date: string;
    meals: MealEntry[];
    totalNutrients: NutrientProfile;
    waterIntake: number;
  }[];

  updateVitals: () => void;
  addMealEntry: (entry: Omit<MealEntry, 'id'>) => void;
  addWaterIntake: (amount: number) => void;
  getDailyStats: (date?: string) => {
    totalCalories: number;
    proteinRatio: number;
    nutrientScores: Record<string, number>;
  };
}

export const useHealthStore = createStore<HealthState>(
  'health',
  (set, get) => ({
    vitals: {
      energy: 100,
      hydration: 100,
      health: 100,
      lastMeal: null,
      lastHydration: null
    },
    dailyNutrition: [],

    updateVitals: () => {
      const now = new Date();
      const { vitals } = get();
      
      // Calculate time-based decreases
      const hoursSinceLastMeal = vitals.lastMeal 
        ? (now.getTime() - vitals.lastMeal.getTime()) / 3600000
        : 0;
      
      const hoursSinceLastHydration = vitals.lastHydration
        ? (now.getTime() - vitals.lastHydration.getTime()) / 3600000
        : 0;

      set(state => ({
        vitals: {
          ...state.vitals,
          energy: Math.max(0, state.vitals.energy - (hoursSinceLastMeal * 5)),
          hydration: Math.max(0, state.vitals.hydration - (hoursSinceLastHydration * 10))
        }
      }));
    },

    // ... more implementation
  })
); 