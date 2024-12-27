import { ScaledReward, Reward } from '../types/progression/rewards';
import { useProgressStore } from '../store/progressStore';
import { Quest } from '../types/quest';

export function calculateScaledReward(
  baseReward: ScaledReward,
  playerLevel: number,
  completionData: Record<string, any> = {}
): Reward {
  // Base scaling with level
  const levelScale = Math.pow(baseReward.scalingFactor, Math.floor(playerLevel / 10));
  
  // Apply level restrictions
  if (playerLevel < baseReward.minLevel) {
    return { xp: 0 };
  }
  if (baseReward.maxLevel && playerLevel > baseReward.maxLevel) {
    playerLevel = baseReward.maxLevel;
  }

  // Calculate bonus multipliers
  let totalMultiplier = 1;
  if (baseReward.bonusConditions) {
    baseReward.bonusConditions.forEach(condition => {
      if (completionData[condition.condition]) {
        totalMultiplier += condition.multiplier;
      }
    });
  }

  // Calculate final XP
  const scaledXP = Math.round(
    baseReward.baseXP * levelScale * totalMultiplier
  );

  // Scale skill rewards if present
  const scaledSkills: Record<string, number> = {};
  if (baseReward.skills) {
    Object.entries(baseReward.skills).forEach(([skill, amount]) => {
      scaledSkills[skill] = Math.round(amount * Math.sqrt(levelScale));
    });
  }

  return {
    xp: scaledXP,
    skills: scaledSkills,
    resources: baseReward.resources,
    unlocks: baseReward.unlocks
  };
}

export function getQuestRewardTemplate(difficulty: 'easy' | 'medium' | 'hard'): ScaledReward {
  const templates: Record<string, ScaledReward> = {
    easy: {
      baseXP: 100,
      scalingFactor: 1.2,
      minLevel: 0,
      bonusConditions: [
        {
          condition: 'perfectCompletion',
          multiplier: 0.2,
          description: 'Perfect completion bonus'
        },
        {
          condition: 'speedCompletion',
          multiplier: 0.1,
          description: 'Completed quickly'
        }
      ]
    },
    medium: {
      baseXP: 250,
      scalingFactor: 1.3,
      minLevel: 5,
      bonusConditions: [
        {
          condition: 'perfectCompletion',
          multiplier: 0.3,
          description: 'Perfect completion bonus'
        },
        {
          condition: 'speedCompletion',
          multiplier: 0.2,
          description: 'Completed quickly'
        }
      ]
    },
    hard: {
      baseXP: 500,
      scalingFactor: 1.4,
      minLevel: 10,
      bonusConditions: [
        {
          condition: 'perfectCompletion',
          multiplier: 0.4,
          description: 'Perfect completion bonus'
        },
        {
          condition: 'speedCompletion',
          multiplier: 0.3,
          description: 'Completed quickly'
        }
      ]
    }
  };

  return templates[difficulty];
}

export function getTaskReward(taskType: string, complexity: number): ScaledReward {
  return {
    baseXP: 50 * complexity,
    scalingFactor: 1.1,
    minLevel: 0,
    bonusConditions: [
      {
        condition: 'streak',
        multiplier: 0.1,
        description: 'Daily streak bonus'
      }
    ]
  };
}

export function generateQuestRewards(quest: Quest) {
  const baseXP = {
    trivial: 50,
    easy: 100,
    medium: 250,
    hard: 500,
    epic: 1000
  }[quest.difficulty];

  // Apply modifiers based on requirements
  const requirementModifier = quest.requirements.length * 0.1 + 1;
  
  // Apply path-specific bonuses
  const pathBonus = {
    artistry: 1.2,
    entrepreneurship: 1.1,
    homesteading: 1.15,
    maintenance: 1.05
  }[quest.path] || 1;

  return {
    xp: Math.round(baseXP * requirementModifier * pathBonus),
    skillXp: quest.rewards.skillXp
  };
} 