export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'skills' | 'quests' | 'social' | 'special';
  requirement: {
    type: 'quest_count' | 'skill_level' | 'total_xp' | 'streak' | 'special';
    value: number;
    skillId?: string;
  };
  reward: {
    xp: number;
    coins: number;
    special?: string;
  };
  secret?: boolean;
}

const achievements: Achievement[] = [
  // Progress Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete the tutorial',
    icon: '🌱',
    category: 'progress',
    requirement: {
      type: 'special',
      value: 1
    },
    reward: {
      xp: 100,
      coins: 10
    }
  },
  {
    id: 'quest_novice',
    title: 'Quest Novice',
    description: 'Complete 5 daily quests',
    icon: '📝',
    category: 'quests',
    requirement: {
      type: 'quest_count',
      value: 5
    },
    reward: {
      xp: 200,
      coins: 20
    }
  },
  {
    id: 'skill_apprentice',
    title: 'Skill Apprentice',
    description: 'Reach level 5 in any skill',
    icon: '📚',
    category: 'skills',
    requirement: {
      type: 'skill_level',
      value: 5
    },
    reward: {
      xp: 300,
      coins: 30
    }
  },
  {
    id: 'xp_milestone_1',
    title: 'Rising Star',
    description: 'Earn 1000 total XP',
    icon: '⭐',
    category: 'progress',
    requirement: {
      type: 'total_xp',
      value: 1000
    },
    reward: {
      xp: 500,
      coins: 50
    }
  },
  {
    id: 'consistency_master',
    title: 'Consistency Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'progress',
    requirement: {
      type: 'streak',
      value: 7
    },
    reward: {
      xp: 400,
      coins: 40,
      special: 'streak_multiplier'
    }
  }
];

class AchievementSystem {
  private static instance: AchievementSystem;
  
  private constructor() {}
  
  public static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  public getAchievements(): Achievement[] {
    return achievements;
  }

  public checkAchievement(achievementId: string, userData: any): boolean {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return false;

    switch (achievement.requirement.type) {
      case 'quest_count':
        return userData.quests.filter((q: any) => q.completed).length >= achievement.requirement.value;
      
      case 'skill_level':
        return userData.skills.some((s: any) => s.level >= achievement.requirement.value);
      
      case 'total_xp':
        return userData.xp >= achievement.requirement.value;
      
      case 'streak':
        return userData.streaks?.daily >= achievement.requirement.value;
      
      case 'special':
        // Handle special achievements (like tutorial completion)
        switch (achievementId) {
          case 'first_steps':
            return userData.isTutorialComplete;
          default:
            return false;
        }
      
      default:
        return false;
    }
  }

  public checkAllAchievements(userData: any): string[] {
    return achievements
      .filter(achievement => !userData.achievements.includes(achievement.id))
      .filter(achievement => this.checkAchievement(achievement.id, userData))
      .map(achievement => achievement.id);
  }

  public getAchievementRewards(achievementId: string): Achievement['reward'] | null {
    const achievement = achievements.find(a => a.id === achievementId);
    return achievement ? achievement.reward : null;
  }

  public getProgress(achievementId: string, userData: any): number {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;

    switch (achievement.requirement.type) {
      case 'quest_count':
        const completedQuests = userData.quests.filter((q: any) => q.completed).length;
        return Math.min(1, completedQuests / achievement.requirement.value);
      
      case 'skill_level':
        const highestLevel = Math.max(...userData.skills.map((s: any) => s.level));
        return Math.min(1, highestLevel / achievement.requirement.value);
      
      case 'total_xp':
        return Math.min(1, userData.xp / achievement.requirement.value);
      
      case 'streak':
        return Math.min(1, (userData.streaks?.daily || 0) / achievement.requirement.value);
      
      case 'special':
        return userData.isTutorialComplete ? 1 : 0;
      
      default:
        return 0;
    }
  }
}

export const achievementSystem = AchievementSystem.getInstance(); 