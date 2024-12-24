import { create } from 'zustand';
import { EnergyLog, DailyStats } from '../types/resources';

interface ResourceStore {
  energyLogs: EnergyLog[];
  dailyStats: DailyStats[];
  addEnergyLog: (log: EnergyLog) => void;
  updateDailyStats: (stats: DailyStats) => void;
  getCurrentEnergy: () => number;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  energyLogs: [],
  dailyStats: [],
  addEnergyLog: (log) =>
    set((state) => ({ energyLogs: [...state.energyLogs, log] })),
  updateDailyStats: (stats) =>
    set((state) => ({
      dailyStats: [
        ...state.dailyStats.filter(
          (s) => s.date.toDateString() !== stats.date.toDateString()
        ),
        stats,
      ],
    })),
  getCurrentEnergy: () => {
    const logs = get().energyLogs;
    return logs.length > 0 ? logs[logs.length - 1].currentEnergy : 100;
  },
})); 