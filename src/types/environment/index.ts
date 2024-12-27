export interface EnvironmentalData {
  sunlight: {
    duration: number;
    timeOfDay: string[];
    uvIndex: number;
  };
  temperature: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  emf: {
    electric: number;
    magnetic: number;
    rf: number;
  };
} 