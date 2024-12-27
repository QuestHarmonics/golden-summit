export type HomesteadSkillType = 
  | 'FORAGING'
  | 'HUNTING'
  | 'PRESERVATION'
  | 'FERMENTATION'
  | 'ANIMAL_HUSBANDRY'
  | 'GARDENING'
  | 'CRAFTING'
  | 'TOOL_MAKING'
  | 'SHELTER_BUILDING'
  | 'WATER_MANAGEMENT'
  | 'FIRE_MAKING'
  | 'COMPOSTING';

export type ResourceType =
  | 'MEAT'
  | 'ORGANS'
  | 'BONES'
  | 'FAT'
  | 'HERBS'
  | 'MUSHROOMS'
  | 'FIREWOOD'
  | 'WATER'
  | 'COMPOST'
  | 'TOOLS'
  | 'PRESERVED_FOODS'
  | 'FERMENTED_FOODS';

export interface HomesteadSkill {
  id: HomesteadSkillType;
  name: string;
  description: string;
  currentLevel: number;
  maxLevel: number;
  xp: number;
  xpRequired: number;
  produces: ResourceType[];
  unlocksAt: {
    [key: number]: HomesteadUnlock[];
  };
}

export interface HomesteadUnlock {
  type: 'RECIPE' | 'TECHNIQUE' | 'TOOL' | 'STORAGE';
  name: string;
  description: string;
  resourceBonus?: number;
  efficiencyBonus?: number;
}

export interface HomesteadTask {
  id: string;
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL';
  title: string;
  description: string;
  skillType: HomesteadSkillType;
  xpReward: number;
  resourceRewards: {
    type: ResourceType;
    amount: number;
  }[];
  requirements?: {
    skills: {
      type: HomesteadSkillType;
      level: number;
    }[];
    resources?: {
      type: ResourceType;
      amount: number;
    }[];
  };
  streak: number;
  streakBonus: number;
}

export interface HomesteadProject {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  requiredSkills: {
    type: HomesteadSkillType;
    level: number;
  }[];
  requiredResources: {
    type: ResourceType;
    amount: number;
  }[];
  rewards: {
    xp: number;
    resources: {
      type: ResourceType;
      amount: number;
    }[];
    unlocks?: HomesteadUnlock[];
  };
  steps: {
    description: string;
    duration: number;
    skillType: HomesteadSkillType;
  }[];
}

export type PlotType = 'garden' | 'greenhouse' | 'orchard' | 'medicinal' | 'composting';
export type SeasonalActivity = 'planting' | 'maintenance' | 'harvesting' | 'preservation';

interface HomesteadPlot {
  type: PlotType;
  size: number;
  plants: Array<{
    id: string;
    growthStage: number;
    health: number;
    plantedDate: Date;
    harvestWindow?: [Date, Date];
  }>;
  soil: {
    quality: number;
    moisture: number;
    nutrients: number;
  };
}

interface PreservationMethod {
  type: 'fermentation' | 'dehydration' | 'canning' | 'root-cellaring';
  duration: number;
  qualityRetention: number;
  nutritionRetention: number;
} 