import { Skill } from '../store/gameStore';
import { aiQuestEngine } from './AIQuestEngine';
import { aiQuestTemplates } from './AIQuestTemplates';

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: number;
  baseReward: {
    xp: number;
    coins: number;
  };
  requirements?: {
    level?: number;
    skills?: string[];
  };
  rewards?: {
    items: string[];
    skills?: Record<string, number>;
  };
}

export class QuestGenerator {
  private static instance: QuestGenerator;
  
  private constructor() {}
  
  public static getInstance(): QuestGenerator {
    if (!QuestGenerator.instance) {
      QuestGenerator.instance = new QuestGenerator();
    }
    return QuestGenerator.instance;
  }

  public generateDailyQuests(userData: any): Quest[] {
    const quests: Quest[] = [];
    
    // Analyze user patterns
    const patterns = aiQuestEngine.analyzeUserPatterns(userData);
    
    // Generate 3 daily quests
    for (let i = 0; i < 3; i++) {
      // Get optimal parameters for the quest
      const params = aiQuestEngine.generateOptimalQuest(userData, patterns);
      
      // Generate quest template
      const template = aiQuestTemplates.generateQuestFromParameters(params);
      
      // Interpolate template variables
      const { title, description } = aiQuestTemplates.interpolateTemplate(template);
      
      quests.push(this.createQuest({
        title,
        description,
        type: template.type,
        difficulty: template.difficulty,
        skills: template.skills,
        xpReward: this.calculateXPReward(template.difficulty, params.growthPotential)
      }));
    }
    
    return quests;
  }

  private calculateXPReward(difficulty: number, growthPotential: number): number {
    const baseXP = 100;
    const difficultyMultiplier = 1 + (difficulty - 1) * 0.2;
    const potentialMultiplier = 1 + growthPotential;
    return Math.round(baseXP * difficultyMultiplier * potentialMultiplier);
  }

  private createQuest(params: {
    title: string;
    description: string;
    type: string;
    difficulty: number;
    skills: string[];
    xpReward: number;
  }): Quest {
    return {
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: params.title,
      description: params.description,
      type: params.type,
      difficulty: params.difficulty,
      baseReward: {
        xp: params.xpReward,
        coins: Math.floor(params.xpReward / 10)
      },
      requirements: {
        skills: params.skills
      },
      rewards: {
        items: [],
        skills: params.skills.reduce((acc, skill) => ({
          ...acc,
          [skill]: params.difficulty * 10
        }), {})
      }
    };
  }

  public generateTutorialQuests(): Quest[] {
    return [
      {
        id: 'tutorial_1',
        title: 'Welcome to Golden Summit',
        description: 'Begin your journey with a simple mindfulness exercise. Take three deep breaths and focus on the present moment.',
        type: 'tutorial',
        difficulty: 1,
        baseReward: {
          xp: 50,
          coins: 5
        },
        rewards: {
          items: [],
          skills: {
            'mindfulness': 10
          }
        }
      },
      {
        id: 'tutorial_2',
        title: 'Setting Your First Goal',
        description: 'Think about what you want to achieve today. Write down one specific, achievable goal using the goal-setting feature.',
        type: 'tutorial',
        difficulty: 1,
        baseReward: {
          xp: 75,
          coins: 7
        },
        rewards: {
          items: [],
          skills: {
            'goal-setting': 15,
            'productivity': 10
          }
        }
      }
    ];
  }
}

export const questGenerator = QuestGenerator.getInstance(); 