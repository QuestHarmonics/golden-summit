import { QuestParameters } from './AIQuestEngine';

interface QuestTemplate {
  title: string;
  description: string;
  type: string;
  difficulty: number;
  timeEstimate: number;
  energyLevel: number;
  focusRequired: number;
  skills: string[];
  variables?: Record<string, string | number>;
}

const baseTemplates: Record<string, QuestTemplate[]> = {
  mindfulness: [
    {
      title: "{duration}-Minute Mindful Meditation",
      description: "Complete a {duration}-minute guided meditation focusing on {focus}.",
      type: "mindfulness",
      difficulty: 1,
      timeEstimate: 5,
      energyLevel: 0.3,
      focusRequired: 3,
      skills: ['mindfulness', 'stress-management'],
      variables: {
        duration: 5,
        focus: "breath awareness"
      }
    }
  ],
  productivity: [
    {
      title: "{duration}-Minute Deep Work Session",
      description: "Complete {duration} minutes of focused work on {task}, following the Pomodoro technique.",
      type: "productivity",
      difficulty: 2,
      timeEstimate: 25,
      energyLevel: 0.7,
      focusRequired: 4,
      skills: ['productivity', 'focus-mastery'],
      variables: {
        duration: 25,
        task: "your most important task"
      }
    }
  ]
  // Add more base templates for other skill types
};

export class AIQuestTemplates {
  private static instance: AIQuestTemplates;
  
  private constructor() {}
  
  public static getInstance(): AIQuestTemplates {
    if (!AIQuestTemplates.instance) {
      AIQuestTemplates.instance = new AIQuestTemplates();
    }
    return AIQuestTemplates.instance;
  }

  public generateQuestFromParameters(params: QuestParameters): QuestTemplate {
    // Find matching base templates
    const matchingTemplates = this.findMatchingTemplates(params);
    
    // Select best template
    const bestTemplate = this.selectBestTemplate(matchingTemplates, params);
    
    // Customize template
    return this.customizeTemplate(bestTemplate, params);
  }

  private findMatchingTemplates(params: QuestParameters): QuestTemplate[] {
    const matches: QuestTemplate[] = [];
    
    for (const skillTemplates of Object.values(baseTemplates)) {
      skillTemplates.forEach(template => {
        if (this.isTemplateCompatible(template, params)) {
          matches.push(template);
        }
      });
    }

    return matches;
  }

  private isTemplateCompatible(template: QuestTemplate, params: QuestParameters): boolean {
    // Check if template matches the required parameters within acceptable ranges
    return (
      Math.abs(template.difficulty - params.difficulty) <= 1 &&
      Math.abs(template.timeEstimate - params.timeRequired) <= 15 &&
      Math.abs(template.energyLevel - params.energyRequired) <= 0.3 &&
      Math.abs(template.focusRequired - params.focusLevel) <= 1 &&
      template.skills.some(skill => params.skillAlignment.includes(skill))
    );
  }

  private selectBestTemplate(templates: QuestTemplate[], params: QuestParameters): QuestTemplate {
    if (templates.length === 0) {
      // Return a fallback template if no matches found
      return this.generateFallbackTemplate(params);
    }

    return templates.reduce((best, current) => {
      const bestScore = this.calculateTemplateScore(best, params);
      const currentScore = this.calculateTemplateScore(current, params);
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateTemplateScore(template: QuestTemplate, params: QuestParameters): number {
    const difficultyMatch = 1 - Math.abs(template.difficulty - params.difficulty) / 5;
    const timeMatch = 1 - Math.abs(template.timeEstimate - params.timeRequired) / 60;
    const energyMatch = 1 - Math.abs(template.energyLevel - params.energyRequired);
    const focusMatch = 1 - Math.abs(template.focusRequired - params.focusLevel) / 5;
    const skillMatch = template.skills.filter(s => params.skillAlignment.includes(s)).length / 
                      Math.max(template.skills.length, params.skillAlignment.length);

    return (
      difficultyMatch * 0.2 +
      timeMatch * 0.2 +
      energyMatch * 0.2 +
      focusMatch * 0.2 +
      skillMatch * 0.2
    );
  }

  private customizeTemplate(template: QuestTemplate, params: QuestParameters): QuestTemplate {
    const customized = { ...template };
    
    // Adjust time based on params
    if (customized.variables && customized.variables.duration) {
      customized.variables.duration = Math.round(params.timeRequired / 5) * 5;
    }

    // Adjust difficulty elements
    if (params.difficulty > template.difficulty) {
      customized.description += " Maintain perfect focus throughout the session.";
    }

    // Add skill-specific elements
    params.skillAlignment.forEach(skill => {
      if (!template.skills.includes(skill)) {
        customized.description += ` This will help improve your ${skill.replace('-', ' ')}.`;
      }
    });

    return customized;
  }

  private generateFallbackTemplate(params: QuestParameters): QuestTemplate {
    return {
      title: "Personal Growth Challenge",
      description: `Complete a ${params.timeRequired}-minute focused session working on your ${params.skillAlignment[0].replace('-', ' ')} skills.`,
      type: params.skillAlignment[0],
      difficulty: params.difficulty,
      timeEstimate: params.timeRequired,
      energyLevel: params.energyRequired,
      focusRequired: params.focusLevel,
      skills: params.skillAlignment
    };
  }

  public interpolateTemplate(template: QuestTemplate): { title: string; description: string } {
    let title = template.title;
    let description = template.description;

    if (template.variables) {
      Object.entries(template.variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        title = title.replace(regex, value.toString());
        description = description.replace(regex, value.toString());
      });
    }

    return { title, description };
  }
}

export const aiQuestTemplates = AIQuestTemplates.getInstance(); 