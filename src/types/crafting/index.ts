interface Tool {
  id: string;
  name: string;
  durability: number;
  efficiency: number;
  quality: number;
  maintenance: {
    frequency: number;
    requirements: any[];
    skillBonus: Record<string, number>;
  };
  specialties: Array<{
    activity: string;
    bonus: number;
  }>;
}

interface CraftingProject {
  type: string;
  materials: Record<string, number>;
  tools: string[];
  skills: Record<string, number>;
  stages: Array<{
    name: string;
    duration: number;
    qualityFactors: string[];
    weatherSensitive: boolean;
  }>;
  seasonalConsiderations?: Record<Season, {
    difficulty: number;
    materialAvailability: number;
  }>;
} 