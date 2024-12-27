import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FarmProject, CropSystem } from '../types/farm';

interface FarmState {
  capital: number;
  infrastructure: Record<string, {
    status: 'planned' | 'in-progress' | 'completed';
    condition: number;
    lastMaintenance: Date;
  }>;
  crops: Record<string, {
    quantity: number;
    plantedDate: Date;
    stage: number;
    health: number;
    lastCare: Record<string, Date>;
  }>;
  projectedCashFlow: {
    monthly: Record<string, number>;
    yearly: Record<string, number>;
  };
}

interface FarmStore extends FarmState {
  startProject: (projectId: string, costTier: CostTier) => boolean;
  plantCrop: (cropId: string, quantity: number) => void;
  performMaintenance: (infrastructureId: string) => void;
  harvestCrop: (cropId: string) => number;
  calculateProjectedYield: (cropId: string) => Record<CostTier, number>;
  checkProjectRequirements: (projectId: string) => boolean;
}

export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      // ... implementation
    }),
    {
      name: 'farm-storage'
    }
  )
); 