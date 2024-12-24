import { create } from 'zustand';
import { Region } from '../types/map';

interface MapStore {
  regions: Region[];
  activeRegion: Region | null;
  addRegion: (region: Region) => void;
  unlockRegion: (regionId: string) => void;
  setActiveRegion: (region: Region | null) => void;
  connectRegions: (regionId1: string, regionId2: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  regions: [],
  activeRegion: null,
  addRegion: (region) => set((state) => ({ regions: [...state.regions, region] })),
  unlockRegion: (regionId) =>
    set((state) => ({
      regions: state.regions.map((r) =>
        r.id === regionId ? { ...r, unlockedAt: new Date() } : r
      ),
    })),
  setActiveRegion: (region) => set({ activeRegion: region }),
  connectRegions: (regionId1, regionId2) =>
    set((state) => ({
      regions: state.regions.map((r) => {
        if (r.id === regionId1) {
          return {
            ...r,
            connectedRegions: [...new Set([...r.connectedRegions, regionId2])],
          };
        }
        if (r.id === regionId2) {
          return {
            ...r,
            connectedRegions: [...new Set([...r.connectedRegions, regionId1])],
          };
        }
        return r;
      }),
    })),
})); 