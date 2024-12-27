interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  skillIds: string[];
  status: 'active' | 'completed' | 'failed';
}

interface QuestEngine {
  generation: {
    AI: {
      personalizedPrompts: string[];
      difficultyScaling: number;
      contextAwareness: boolean;
    };
    community: {
      shared: Quest[];
      trending: Quest[];
      validated: Quest[];
    }
  }
} 