export interface MealTracking {
  meatType: 'beef' | 'lamb' | 'pork' | 'fish' | 'poultry';
  preparation: 'raw' | 'rare' | 'medium' | 'well-done';
  organMeats: boolean;
  fatContent: number; // percentage
  quantity: number; // grams
  timing: Date;
  hungerLevel: 1 | 2 | 3 | 4 | 5;
  satiety: 1 | 2 | 3 | 4 | 5;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  symptoms?: string[];
} 