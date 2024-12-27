import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EnvironmentalSystem } from './types';

interface EnvironmentStore extends EnvironmentalSystem {
  // Weather
  updateWeather: (weather: WeatherCondition) => void;
  updateForecast: (forecast: WeatherForecast[]) => void;
  
  // Seasons
  advanceSeason: () => void;
  getSeasonalTasks: () => SeasonalTask[];
  
  // Moon Phases
  updateMoonPhase: (phase: MoonPhase) => void;
  getMoonEffects: () => MoonPhaseEffect[];
  
  // Integrations
  getTaskModifiers: () => TaskModifier[];
  getEnergyModifiers: () => ResourceModifier[];
}

export const useEnvironmentStore = create<EnvironmentStore>()(
  persist(
    (set, get) => ({
      // Implementation
    }),
    {
      name: 'environment-storage'
    }
  )
); 