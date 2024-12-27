interface ResourceNode {
  type: string;
  health: number;
  regenerationRate: number;
  sustainableHarvestRate: number;
  seasonalYields: Record<Season, number>;
  quality: number;
  dependencies: Array<{
    resourceId: string;
    relationship: 'supports' | 'competes' | 'enhances';
  }>;
}

interface EcosystemBalance {
  health: number;
  diversity: number;
  resilience: number;
  indicators: Array<{
    type: string;
    status: number;
    threshold: number;
    effects: any;
  }>;
} 