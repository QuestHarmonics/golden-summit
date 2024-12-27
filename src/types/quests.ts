export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'achievement';
  requirements: {
    type: 'xp' | 'activity' | 'streak' | 'level';
    value: number;
  }[];
  rewards: {
    type: 'xp' | 'coins' | 'achievement';
    amount: number;
  }[];
  progress: number;
  completed: boolean;
}

export interface QuestSuggestion {
  quest: Quest;
  confidence: number;
  reason: string;
} 