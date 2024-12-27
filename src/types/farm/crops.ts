interface CropSystem {
  id: string;
  name: string;
  category: 'fruit' | 'vegetable' | 'berry' | 'citrus' | 'native';
  plantingDetails: {
    quantity: number;
    spacing: number;
    depth: number;
    seasonalWindow: Season[];
  };
  growth: {
    daysToMaturity: number;
    stages: Array<{
      name: string;
      duration: number;
      careRequirements: string[];
    }>;
  };
  harvest: {
    yieldsPerPlant: Record<CostTier, number>;
    marketPrice: Record<CostTier, number>;
    harvestWindow: number; // days
  };
  maintenance: {
    waterNeeds: number;
    fertilizationSchedule: number[];
    pruningRequired: boolean;
  };
}

// Example implementation
export const CROP_SYSTEMS: Record<string, CropSystem> = {
  'blackberries': {
    id: 'blackberries',
    name: 'Blackberry Bushes',
    category: 'berry',
    plantingDetails: {
      quantity: 200,
      spacing: 6, // feet
      depth: 0.5, // feet
      seasonalWindow: ['winter', 'early-spring']
    },
    growth: {
      daysToMaturity: 365,
      stages: [
        { name: 'establishment', duration: 90, careRequirements: ['regular-watering', 'weed-control'] },
        { name: 'vegetative', duration: 120, careRequirements: ['pruning', 'fertilization'] },
        { name: 'flowering', duration: 30, careRequirements: ['pollinator-support'] },
        { name: 'fruiting', duration: 45, careRequirements: ['bird-protection', 'support-structure'] }
      ]
    },
    harvest: {
      yieldsPerPlant: {
        LOW: 1,
        MID: 2,
        HIGH: 3
      },
      marketPrice: {
        LOW: 11,
        MID: 11.5,
        HIGH: 12
      },
      harvestWindow: 21
    },
    maintenance: {
      waterNeeds: 1.5, // inches per week
      fertilizationSchedule: [60, 120, 180], // days after planting
      pruningRequired: true
    }
  }
}; 