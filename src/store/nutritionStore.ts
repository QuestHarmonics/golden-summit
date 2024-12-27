import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  FoodItem, 
  PrimalRecipe, 
  NutritionProfile,
  PrimalProgression,
  QualityRequirement 
} from '../types/nutrition';
import { WeatherCondition } from '../types/weather';
import { MoonPhase } from '../types/moon';

interface NutritionState {
  profile: NutritionProfile;
  consumedFoods: {
    id: string;
    timestamp: Date;
    quality?: QualityRequirement;
  }[];
  primalProgression: PrimalProgression;
  activeBuffs: {
    standard: {
      energyRestore: number;
      focusBoost: number;
      skillMultiplier: number;
    };
    primal: {
      primalBoost: number;
      natureAttunement: number;
      ancestralStrength: number;
    };
  };
}

interface NutritionStore extends NutritionState {
  consumeFood: (food: FoodItem) => void;
  preparePrimalRecipe: (recipe: PrimalRecipe, ingredients: any[]) => void;
  checkRecipeQuality: (recipe: PrimalRecipe, ingredients: any[]) => number;
  calculatePrimalBonus: (
    recipe: PrimalRecipe, 
    weather: WeatherCondition,
    moonPhase: MoonPhase
  ) => number;
  gainPrimalExperience: (amount: number) => void;
  getActiveBuffs: () => NutritionState['activeBuffs'];
}

export const useNutritionStore = create<NutritionStore>()(
  persist(
    (set, get) => ({
      profile: {
        // ... initial profile state
      },
      consumedFoods: [],
      primalProgression: {
        level: 1,
        experience: 0,
        unlockedCategories: ['raw-meat'],
        masterRecipes: [],
        currentChallenges: []
      },
      activeBuffs: {
        standard: {
          energyRestore: 0,
          focusBoost: 1,
          skillMultiplier: 1
        },
        primal: {
          primalBoost: 1,
          natureAttunement: 1,
          ancestralStrength: 1
        }
      },

      consumeFood: (food) => {
        // ... existing food consumption logic
      },

      preparePrimalRecipe: (recipe, ingredients) => {
        const quality = get().checkRecipeQuality(recipe, ingredients);
        const weather = 'clear'; // Get from weather service
        const moonPhase = 'full'; // Get from moon phase service
        const bonus = get().calculatePrimalBonus(recipe, weather, moonPhase);

        // Apply primal effects
        set(state => ({
          consumedFoods: [
            ...state.consumedFoods,
            { 
              id: recipe.id, 
              timestamp: new Date(),
              quality: { freshness: quality, purity: quality, preparation: quality }
            }
          ],
          activeBuffs: {
            ...state.activeBuffs,
            primal: {
              primalBoost: state.activeBuffs.primal.primalBoost * 
                (recipe.energyProperties.specialEffects?.find(e => e.type === 'primal-boost')?.magnitude || 1),
              natureAttunement: state.activeBuffs.primal.natureAttunement *
                (recipe.energyProperties.specialEffects?.find(e => e.type === 'nature-attunement')?.magnitude || 1),
              ancestralStrength: state.activeBuffs.primal.ancestralStrength *
                (recipe.energyProperties.specialEffects?.find(e => e.type === 'ancestral-strength')?.magnitude || 1)
            }
          }
        }));

        // Grant primal experience
        get().gainPrimalExperience(recipe.difficulty * 100 * quality * bonus);
      },

      checkRecipeQuality: (recipe, ingredients) => {
        // Calculate quality based on ingredients and preparation
        return 0.8; // Placeholder
      },

      calculatePrimalBonus: (recipe, weather, moonPhase) => {
        let bonus = 1;
        
        if (recipe.weatherBonus?.condition === weather) {
          bonus *= 1.2;
        }
        
        if (recipe.moonPhaseBonus?.phase === moonPhase) {
          bonus *= 1.3;
        }
        
        return bonus;
      },

      gainPrimalExperience: (amount) => {
        set(state => {
          const newXP = state.primalProgression.experience + amount;
          const xpForNextLevel = 1000 * Math.pow(1.5, state.primalProgression.level - 1);
          
          if (newXP >= xpForNextLevel) {
            return {
              primalProgression: {
                ...state.primalProgression,
                level: state.primalProgression.level + 1,
                experience: newXP - xpForNextLevel
              }
            };
          }
          
          return {
            primalProgression: {
              ...state.primalProgression,
              experience: newXP
            }
          };
        });
      },

      getActiveBuffs: () => get().activeBuffs
    }),
    {
      name: 'nutrition-storage'
    }
  )
); 