interface Activity {
  id: string;
  name: string;
  duration: number;
  xpGain: number;
  timestamp: Date;
  completed: boolean;
}

interface Reward {
  id: string;
  type: 'xp' | 'multiplier' | 'achievement' | 'item';
  value: number;
  duration?: number; // For time-limited rewards
  description: string;
}

interface SkillSystem {
  skills: {
    id: string;
    name: string;
    level: number;
    xp: number;
    activities: Activity[];
    multiplier: number;
  };

  tracking: {
    realTime: boolean;    // Track time spent
    verification: string; // Photo/GPS/peer verification
    rewards: Reward[];    // Immediate feedback
  };
} 