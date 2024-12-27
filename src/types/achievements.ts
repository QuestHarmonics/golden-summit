export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  condition: () => boolean;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'EARLY_BIRD',
    title: 'Early Bird',
    description: 'Complete your first morning routine',
    xpReward: 100,
    condition: () => true, // Replace with actual condition
    icon: '🌅',
    unlocked: false
  },
  // Add more achievements
]; 