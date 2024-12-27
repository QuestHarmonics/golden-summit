import { create } from 'zustand';
import {
  BiometricReading,
  SleepMetrics,
  CognitiveMetrics,
  PhysicalMetrics,
  BloodMetrics,
  EnvironmentalMetrics,
  NutritionMetrics,
  BiometricType
} from '../types/biometrics';

interface BiometricsStore {
  readings: BiometricReading[];
  sleepMetrics: SleepMetrics[];
  cognitiveMetrics: CognitiveMetrics[];
  physicalMetrics: PhysicalMetrics[];
  bloodMetrics: BloodMetrics[];
  environmentalMetrics: EnvironmentalMetrics[];
  nutritionMetrics: NutritionMetrics[];
  metricTypes: BiometricType[];
  
  // Core CRUD operations
  addReading: (reading: BiometricReading) => void;
  updateReading: (id: string, reading: Partial<BiometricReading>) => void;
  deleteReading: (id: string) => void;
  
  // Specialized metrics operations
  addSleepMetrics: (metrics: SleepMetrics) => void;
  addCognitiveMetrics: (metrics: CognitiveMetrics) => void;
  addPhysicalMetrics: (metrics: PhysicalMetrics) => void;
  addBloodMetrics: (metrics: BloodMetrics) => void;
  addEnvironmentalMetrics: (metrics: EnvironmentalMetrics) => void;
  addNutritionMetrics: (metrics: NutritionMetrics) => void;
  
  // Analysis helpers
  getReadingsByDateRange: (start: Date, end: Date) => BiometricReading[];
  getReadingsByType: (typeId: string) => BiometricReading[];
  getCorrelations: (typeId1: string, typeId2: string) => number;
  getAverageByType: (typeId: string, period: 'day' | 'week' | 'month') => number;
}

export const useBiometricsStore = create<BiometricsStore>((set, get) => ({
  readings: [],
  sleepMetrics: [],
  cognitiveMetrics: [],
  physicalMetrics: [],
  bloodMetrics: [],
  environmentalMetrics: [],
  nutritionMetrics: [],
  metricTypes: [],

  addReading: (reading) =>
    set((state) => ({
      readings: [...state.readings, reading]
    })),

  updateReading: (id, reading) =>
    set((state) => ({
      readings: state.readings.map((r) =>
        r.id === id ? { ...r, ...reading } : r
      )
    })),

  deleteReading: (id) =>
    set((state) => ({
      readings: state.readings.filter((r) => r.id !== id)
    })),

  addSleepMetrics: (metrics) =>
    set((state) => ({
      sleepMetrics: [...state.sleepMetrics, metrics]
    })),

  addCognitiveMetrics: (metrics) =>
    set((state) => ({
      cognitiveMetrics: [...state.cognitiveMetrics, metrics]
    })),

  addPhysicalMetrics: (metrics) =>
    set((state) => ({
      physicalMetrics: [...state.physicalMetrics, metrics]
    })),

  addBloodMetrics: (metrics) =>
    set((state) => ({
      bloodMetrics: [...state.bloodMetrics, metrics]
    })),

  addEnvironmentalMetrics: (metrics) =>
    set((state) => ({
      environmentalMetrics: [...state.environmentalMetrics, metrics]
    })),

  addNutritionMetrics: (metrics) =>
    set((state) => ({
      nutritionMetrics: [...state.nutritionMetrics, metrics]
    })),

  getReadingsByDateRange: (start, end) => {
    const { readings } = get();
    return readings.filter(
      (r) => r.timestamp >= start && r.timestamp <= end
    );
  },

  getReadingsByType: (typeId) => {
    const { readings } = get();
    return readings.filter((r) => r.type.id === typeId);
  },

  getCorrelations: (typeId1, typeId2) => {
    // Implement Pearson correlation coefficient calculation
    return 0; // Placeholder
  },

  getAverageByType: (typeId, period) => {
    const { readings } = get();
    const typeReadings = readings.filter((r) => r.type.id === typeId);
    if (typeReadings.length === 0) return 0;
    
    const sum = typeReadings.reduce((acc, r) => acc + r.value, 0);
    return sum / typeReadings.length;
  }
})); 