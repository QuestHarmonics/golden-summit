// Need to define integration types
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  forecast: WeatherForecast[];
}

export interface MoonPhaseData {
  phase: string;
  illumination: number;
  nextFullMoon: Date;
  effects: MoonEffects;
} 