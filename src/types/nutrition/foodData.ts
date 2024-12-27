import { FoodItem } from './index';

export const FOOD_ITEMS: FoodItem[] = [
  // Proteins
  {
    id: 'grilled-chicken',
    name: 'Grilled Chicken',
    category: 'protein',
    energyType: 'sustained',
    energyValue: 35,
    regenerationRate: 2.5,
    regenerationDuration: 180,
    buffs: {
      energyEfficiency: 1.25,
      skillMultiplier: 1.1
    }
  },
  {
    id: 'salmon',
    name: 'Wild Salmon',
    category: 'protein',
    energyType: 'sustained',
    energyValue: 40,
    regenerationRate: 3,
    regenerationDuration: 240,
    buffs: {
      focusBoost: 1.2,
      energyEfficiency: 1.15
    }
  },

  // Carbs
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    category: 'carbs',
    energyType: 'sustained',
    energyValue: 25,
    regenerationRate: 2,
    regenerationDuration: 120,
    buffs: {
      energyEfficiency: 1.1
    }
  },
  {
    id: 'quinoa-bowl',
    name: 'Quinoa Bowl',
    category: 'carbs',
    energyType: 'sustained',
    energyValue: 30,
    regenerationRate: 2.5,
    regenerationDuration: 150,
    buffs: {
      focusBoost: 1.15,
      energyEfficiency: 1.1
    }
  },

  // Vegetables
  {
    id: 'salad',
    name: 'Fresh Salad',
    category: 'vegetables',
    energyType: 'instant',
    energyValue: 15,
    regenerationRate: 1,
    regenerationDuration: 60,
    buffs: {
      focusBoost: 1.1
    }
  },
  {
    id: 'steamed-veggies',
    name: 'Steamed Vegetables',
    category: 'vegetables',
    energyType: 'sustained',
    energyValue: 20,
    regenerationRate: 1.5,
    regenerationDuration: 90,
    buffs: {
      energyEfficiency: 1.15
    }
  },

  // Fruits
  {
    id: 'berry-mix',
    name: 'Mixed Berries',
    category: 'fruits',
    energyType: 'instant',
    energyValue: 20,
    regenerationRate: 2,
    regenerationDuration: 45,
    buffs: {
      focusBoost: 1.1
    }
  },
  {
    id: 'banana',
    name: 'Banana',
    category: 'fruits',
    energyType: 'boost',
    energyValue: 25,
    regenerationRate: 3,
    regenerationDuration: 30,
    buffs: {
      skillMultiplier: 1.1
    }
  },

  // Snacks
  {
    id: 'trail-mix',
    name: 'Trail Mix',
    category: 'snacks',
    energyType: 'sustained',
    energyValue: 25,
    regenerationRate: 1.5,
    regenerationDuration: 60,
    buffs: {
      energyEfficiency: 1.1
    }
  },
  {
    id: 'protein-bar',
    name: 'Protein Bar',
    category: 'snacks',
    energyType: 'boost',
    energyValue: 30,
    regenerationRate: 2,
    regenerationDuration: 45,
    buffs: {
      skillMultiplier: 1.15
    }
  }
]; 