import { BaseEntity } from '../shared';

export type MetricSource = 'MANUAL' | 'OURA' | 'WHOOP' | 'APPLE_HEALTH' | 'GARMIN' | 'FITBIT' | 'BIOSENSE' | 'LEVELS' | 'DEXCOM';

export interface BiometricReading extends BaseEntity {
  type: BiometricType;
  value: number;
  unit: string;
  source: MetricSource;
  timestamp: Date;
  tags: string[];
  notes?: string;
  confidence: number; // 0-1 for data quality
}

export interface BiometricType {
  id: string;
  name: string;
  category: BiometricCategory;
  unit: string;
  optimalRange: {
    min: number;
    max: number;
  };
  frequency: TrackingFrequency;
}

export type BiometricCategory =
  | 'SLEEP'
  | 'RECOVERY'
  | 'ENERGY'
  | 'COGNITION'
  | 'PHYSICAL'
  | 'BLOOD'
  | 'HORMONES'
  | 'NUTRITION'
  | 'ENVIRONMENTAL';

export type TrackingFrequency = 
  | 'CONTINUOUS'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'ON_DEMAND';

export interface SleepMetrics extends BaseEntity {
  startTime: Date;
  endTime: Date;
  duration: number;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  awakeDuration: number;
  hrv: number[];
  respiratoryRate: number;
  restingHeartRate: number;
  sleepScore: number;
  temperature: number;
  readiness: number;
}

export interface CognitiveMetrics extends BaseEntity {
  reactionTime: number;
  workingMemory: number;
  processingSpeed: number;
  decisionQuality: number;
  focusDuration: number;
  mentalFatigue: number;
  mood: number;
  stressLevel: number;
  flowStates: {
    startTime: Date;
    endTime: Date;
    intensity: number;
    activity: string;
  }[];
}

export interface PhysicalMetrics extends BaseEntity {
  hrv: number;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodOxygen: number;
  temperature: number;
  respiratoryRate: number;
  steps: number;
  activeCalories: number;
  recovery: number;
  strain: number;
  muscleLoad: number;
  fatigue: number;
}

export interface BloodMetrics extends BaseEntity {
  glucose: number[];
  ketones: number;
  lactate: number;
  creatineKinase: number;
  inflammation: number;
  lipidPanel: {
    totalCholesterol: number;
    ldl: number;
    hdl: number;
    triglycerides: number;
  };
  hormones: {
    cortisol: number;
    testosterone: number;
    igf1: number;
    insulin: number;
  };
}

export interface EnvironmentalMetrics extends BaseEntity {
  temperature: number;
  humidity: number;
  co2: number;
  tvoc: number;
  lightIntensity: number;
  noise: number;
  emf: number;
  airQuality: number;
}

export interface NutritionMetrics extends BaseEntity {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micronutrients: Record<string, number>;
  hydration: number;
  supplements: Array<{
    name: string;
    dose: number;
    unit: string;
    timing: Date;
  }>;
  fastingWindow: {
    start: Date;
    end: Date;
    duration: number;
  };
}

export interface BiometricData {
  glucose: number[];
  ketones: number[];
  hrv: number[];
  temperature: number[];
  sleep: {
    duration: number;
    quality: 1 | 2 | 3 | 4 | 5;
    deepSleep: number;
  };
  recovery: {
    readiness: number;
    strain: number;
  };
}

export interface BiometricStore {
  data: BiometricData;
  devices: {
    dexcom: boolean;
    oura: boolean;
    whoop: boolean;
    biosense: boolean;
  };
  sync: () => Promise<void>;
} 