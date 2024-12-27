interface WeatherActivity {
  id: string;
  name: string;
  conditions: WeatherCondition[];
  energyCost: number;
  duration: number;
  rewards: {
    xp: number;
    resources: string[];
    skills: Array<{
      id: string;
      multiplier: number;
    }>;
  };
  bonusConditions?: {
    moonPhase?: MoonPhase;
    season?: Season;
    timeOfDay?: TimeOfDay;
  };
}

const WEATHER_ACTIVITIES = [
  {
    id: 'mushroom-foraging',
    name: 'Mushroom Foraging',
    conditions: ['rainy', 'overcast'],
    energyCost: 30,
    duration: 120,
    rewards: {
      xp: 150,
      resources: ['medicinal-mushrooms', 'edible-fungi'],
      skills: [
        { id: 'foraging', multiplier: 1.5 },
        { id: 'nature-knowledge', multiplier: 1.2 }
      ]
    }
  }
]; 