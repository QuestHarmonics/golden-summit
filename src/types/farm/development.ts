export type DevelopmentPhase = 'planning' | 'acquisition' | 'infrastructure' | 'planting' | 'operation';
export type CostTier = 'LOW' | 'MID' | 'HIGH';

interface FarmDevelopmentTimeline {
  phase: DevelopmentPhase;
  startDate: Date;
  endDate: Date;
  requiredCapital: Record<CostTier, number>;
  prerequisites: string[];
  unlocks: string[];
}

interface FarmProject {
  id: string;
  name: string;
  description: string;
  category: 'infrastructure' | 'planting' | 'livestock' | 'equipment' | 'education';
  timeline: {
    estimatedDuration: number; // in days
    seasonalConstraints?: Season[];
    weatherConstraints?: WeatherCondition[];
  };
  costs: Record<CostTier, number>;
  expectedYield?: {
    type: 'one-time' | 'recurring';
    amount: Record<CostTier, number>;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  requirements: {
    skills: Array<{
      type: string;
      level: number;
    }>;
    resources: Record<string, number>;
    infrastructure?: string[];
  };
} 