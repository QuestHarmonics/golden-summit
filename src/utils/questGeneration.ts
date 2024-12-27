import { Quest } from '../types/quest';
import { getQuestRewardTemplate, calculateScaledReward } from './rewardCalculations';
import { useProgressStore } from '../store/progressStore';

export function generateQuest(type: string, playerLevel: number): Quest {
  const difficulty = calculateQuestDifficulty(type, playerLevel);
  const rewardTemplate = getQuestRewardTemplate(difficulty);
  
  const quest: Quest = {
    id: crypto.randomUUID(),
    type,
    title: generateQuestTitle(type, difficulty),
    description: generateQuestDescription(type, difficulty),
    difficulty,
    requirements: generateRequirements(difficulty, playerLevel),
    reward: calculateScaledReward(rewardTemplate, playerLevel),
    createdAt: new Date(),
    updatedAt: new Date(),
    completionCriteria: generateCompletionCriteria(type, difficulty)
  };

  return quest;
}

function calculateQuestDifficulty(type: string, playerLevel: number): 'easy' | 'medium' | 'hard' {
  // Dynamic difficulty based on player level and quest type
  if (playerLevel < 5) return 'easy';
  if (playerLevel < 15) return Math.random() > 0.7 ? 'medium' : 'easy';
  return ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
}

// ... rest of quest generation logic 