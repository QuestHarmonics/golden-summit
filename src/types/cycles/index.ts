interface NaturalCycle {
  type: 'lunar' | 'seasonal' | 'daily';
  currentPhase: string;
  effects: {
    energyModifier: number;
    skillModifiers: Record<string, number>;
    availableActivities: string[];
    specialEvents?: Array<{
      name: string;
      trigger: () => boolean;
      effects: any;
    }>;
  };
}

interface BiodynamicTiming {
  activity: string;
  optimalTimes: Array<{
    moonPhase: MoonPhase;
    timeOfDay: TimeOfDay;
    season: Season;
    multiplier: number;
  }>;
} 