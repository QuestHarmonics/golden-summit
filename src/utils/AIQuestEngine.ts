import { Skill, UserData } from '../store/gameStore';

interface UserPattern {
  preferredTimes: Record<string, number>;
  completionRates: Record<string, number>;
  energyLevels: Record<string, number>;
  skillProgress: Record<string, {
    growth: number;
    consistency: number;
    challenges: string[];
  }>;
}

export interface QuestParameters {
  difficulty: number;
  timeRequired: number;
  energyRequired: number;
  focusLevel: number;
  skillAlignment: string[];
  growthPotential: number;
}

export class AIQuestEngine {
  private static instance: AIQuestEngine;
  
  private constructor() {}
  
  public static getInstance(): AIQuestEngine {
    if (!AIQuestEngine.instance) {
      AIQuestEngine.instance = new AIQuestEngine();
    }
    return AIQuestEngine.instance;
  }

  public analyzeUserPatterns(userData: UserData): UserPattern {
    const patterns: UserPattern = {
      preferredTimes: {},
      completionRates: {},
      energyLevels: {},
      skillProgress: {}
    };

    // Analyze completion times
    userData.quests.forEach(quest => {
      if (quest.completed) {
        const hour = new Date(quest.date).getHours();
        patterns.preferredTimes[hour] = (patterns.preferredTimes[hour] || 0) + 1;
      }
    });

    // Analyze skill progress patterns
    userData.skills.forEach(skill => {
      patterns.skillProgress[skill.id] = {
        growth: this.calculateGrowthRate(skill),
        consistency: this.calculateConsistency(skill),
        challenges: this.identifyChallenges(skill)
      };
    });

    // Calculate energy patterns
    userData.skills.forEach(skill => {
      skill.activities.forEach(activity => {
        const hour = new Date(activity.date).getHours();
        patterns.energyLevels[hour] = (patterns.energyLevels[hour] || 0) + activity.duration;
      });
    });

    return patterns;
  }

  private calculateGrowthRate(skill: Skill): number {
    const recentActivities = skill.activities.slice(-10);
    if (recentActivities.length < 2) return 0;

    const progressRates = recentActivities.map((activity, i) => {
      if (i === 0) return 0;
      return (activity.duration - recentActivities[i-1].duration) / activity.duration;
    });

    return progressRates.reduce((a, b) => a + b, 0) / progressRates.length;
  }

  private calculateConsistency(skill: Skill): number {
    const dailyActivities = new Set(
      skill.activities.map(a => new Date(a.date).toDateString())
    );
    const totalDays = (
      new Date().getTime() - 
      new Date(skill.activities[0]?.date || new Date()).getTime()
    ) / (1000 * 60 * 60 * 24);

    return dailyActivities.size / totalDays;
  }

  private identifyChallenges(skill: Skill): string[] {
    const challenges: string[] = [];
    const consistency = this.calculateConsistency(skill);
    const growth = this.calculateGrowthRate(skill);

    if (consistency < 0.3) challenges.push('consistency');
    if (growth < 0.1) challenges.push('growth');
    if (skill.focus < 3) challenges.push('focus');
    if (skill.timeSpent < 60) challenges.push('commitment');

    return challenges;
  }

  public generateOptimalQuest(userData: UserData, patterns: UserPattern): QuestParameters {
    // Find skills needing most attention
    const prioritySkills = Object.entries(patterns.skillProgress)
      .sort((a, b) => a[1].challenges.length - b[1].challenges.length)
      .slice(0, 3)
      .map(([skillId]) => skillId);

    // Calculate optimal time
    const optimalHour = Object.entries(patterns.preferredTimes)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Calculate appropriate difficulty
    const averageCompletion = Object.values(patterns.completionRates)
      .reduce((a, b) => a + b, 0) / Object.values(patterns.completionRates).length;
    
    const difficulty = this.calculateOptimalDifficulty(averageCompletion);

    return {
      difficulty,
      timeRequired: this.calculateOptimalDuration(patterns.energyLevels, parseInt(optimalHour)),
      energyRequired: this.calculateEnergyRequirement(patterns.energyLevels, parseInt(optimalHour)),
      focusLevel: this.calculateFocusRequirement(userData.skills, prioritySkills),
      skillAlignment: prioritySkills,
      growthPotential: this.calculateGrowthPotential(patterns.skillProgress, prioritySkills)
    };
  }

  private calculateOptimalDifficulty(completionRate: number): number {
    // Adjust difficulty to maintain ~70% completion rate
    if (completionRate > 0.8) return Math.min(5, Math.ceil(completionRate * 1.5));
    if (completionRate < 0.6) return Math.max(1, Math.floor(completionRate * 0.8));
    return 3;
  }

  private calculateOptimalDuration(energyLevels: Record<string, number>, hour: number): number {
    const averageEnergy = energyLevels[hour] || 30;
    return Math.min(60, Math.max(15, averageEnergy));
  }

  private calculateEnergyRequirement(energyLevels: Record<string, number>, hour: number): number {
    const maxEnergy = Math.max(...Object.values(energyLevels));
    const currentEnergy = energyLevels[hour] || maxEnergy / 2;
    return currentEnergy / maxEnergy;
  }

  private calculateFocusRequirement(skills: Skill[], prioritySkills: string[]): number {
    const relevantSkills = skills.filter(s => prioritySkills.includes(s.id));
    return Math.min(5, Math.ceil(
      relevantSkills.reduce((acc, s) => acc + s.focus, 0) / relevantSkills.length
    ));
  }

  private calculateGrowthPotential(
    skillProgress: Record<string, { growth: number; consistency: number }>,
    prioritySkills: string[]
  ): number {
    return prioritySkills.reduce((acc, skillId) => {
      const progress = skillProgress[skillId];
      return acc + (1 - progress.growth) * progress.consistency;
    }, 0) / prioritySkills.length;
  }
}

export const aiQuestEngine = AIQuestEngine.getInstance(); 