export interface SleepMetrics {
  bedTime: Date;
  wakeTime: Date;
  totalDuration: number;
  deepSleep: number;
  remSleep: number;
  lightSleep: number;
  awakeTime: number;
  hrv: number;
  respiratoryRate: number;
  temperature: number;
  quality: 1 | 2 | 3 | 4 | 5;
  environmentalFactors: {
    temperature: number;
    humidity: number;
    noise: number;
    light: number;
  };
} 