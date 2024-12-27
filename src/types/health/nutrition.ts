export interface NutrientProfile {
  protein: number;
  fats: {
    saturated: number;
    monounsaturated: number;
    polyunsaturated: number;
    omega3: number;
    omega6: number;
  };
  carbohydrates: number;
  fiber: number;
  micronutrients: Record<Micronutrient, number>;
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  quality: FoodQuality;
  nutrients: NutrientProfile;
  servingSize: number;
  servingUnit: 'g' | 'oz' | 'ml';
  tags: string[];
  preparation?: string[];
  cookingTime?: number;
}

export type FoodCategory =
  | 'grassfed-meat'
  | 'organ-meat'
  | 'wild-fish'
  | 'pastured-eggs'
  | 'vegetables'
  | 'fruits'
  | 'nuts-seeds'
  | 'dairy'
  | 'fermented';

export type FoodQuality = 
  | 'grass-fed'
  | 'pastured'
  | 'wild-caught'
  | 'organic'
  | 'conventional';

export type Micronutrient =
  | 'vitamin-a'
  | 'vitamin-d'
  | 'vitamin-k2'
  | 'vitamin-b12'
  | 'iron'
  | 'zinc'
  | 'magnesium'
  | 'calcium';

export interface MealEntry {
  id: string;
  timestamp: Date;
  foods: Array<{
    foodId: string;
    servings: number;
  }>;
  totalNutrients: NutrientProfile;
  preparationTime?: number;
  cookingSkillXP?: number;
  tags: string[];
} 