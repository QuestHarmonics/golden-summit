interface EnvironmentalSystem {
  weather: {
    current: WeatherCondition;
    forecast: WeatherForecast[];
    effects: WeatherEffect[];
  };
  season: {
    current: Season;
    tasks: SeasonalTask[];
    bonuses: SeasonalBonus[];
  };
  moonPhase: {
    current: MoonPhase;
    effects: MoonPhaseEffect[];
  };
} 