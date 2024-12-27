import { FamilyQuest, FamilyMember, FamilyProfile } from '../types/FamilyTypes';
import { aiQuestEngine } from '../../../utils/AIQuestEngine';
import { aiQuestTemplates } from '../../../utils/AIQuestTemplates';

interface FamilyQuestParameters {
  type: FamilyQuest['type'];
  minParticipants: number;
  maxParticipants: number;
  duration: number;
  difficulty: number;
  primarySkill: string;
  secondarySkills: string[];
  ageAppropriate: boolean;
}

export class FamilyQuestGenerator {
  private static instance: FamilyQuestGenerator;
  
  private constructor() {}
  
  public static getInstance(): FamilyQuestGenerator {
    if (!FamilyQuestGenerator.instance) {
      FamilyQuestGenerator.instance = new FamilyQuestGenerator();
    }
    return FamilyQuestGenerator.instance;
  }

  public generateDailyFamilyQuests(familyProfile: FamilyProfile): FamilyQuest[] {
    const quests: FamilyQuest[] = [];
    
    // Generate different types of family quests
    quests.push(this.generateTraditionQuest(familyProfile));
    quests.push(this.generateSkillSharingQuest(familyProfile));
    quests.push(this.generateBondingQuest(familyProfile));

    return quests;
  }

  private generateTraditionQuest(familyProfile: FamilyProfile): FamilyQuest {
    const activeTraditions = familyProfile.traditions.filter(t => 
      !t.lastCelebrated || this.isTimeForTradition(t.frequency, t.lastCelebrated)
    );

    if (activeTraditions.length > 0) {
      const tradition = activeTraditions[0];
      return {
        id: `fquest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `Celebrate: ${tradition.name}`,
        description: tradition.description,
        type: 'tradition',
        participants: {
          required: tradition.participants,
          optional: familyProfile.members
            .filter(m => !tradition.participants.includes(m.id))
            .map(m => m.id)
        },
        schedule: {
          startDate: new Date().toISOString(),
          recurringPattern: this.getRecurringPattern(tradition.frequency)
        },
        rewards: this.calculateTraditionRewards(tradition, familyProfile),
        progress: {
          status: 'active',
          participantProgress: {},
          overallProgress: 0
        }
      };
    }

    return this.generateGenericFamilyQuest(familyProfile, {
      type: 'tradition',
      minParticipants: 2,
      maxParticipants: familyProfile.members.length,
      duration: 60,
      difficulty: 2,
      primarySkill: 'relationship-building',
      secondarySkills: ['communication', 'emotional-intelligence'],
      ageAppropriate: true
    });
  }

  private generateSkillSharingQuest(familyProfile: FamilyProfile): FamilyQuest {
    // Find members with complementary skills
    const skillPairs = this.findComplementarySkills(familyProfile.members);
    
    if (skillPairs.length > 0) {
      const pair = skillPairs[0];
      return {
        id: `fquest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `Share & Learn: ${pair.skill}`,
        description: `${pair.teacher.name} will teach ${pair.learner.name} about ${pair.skill}`,
        type: 'skill-sharing',
        participants: {
          required: [pair.teacher.id, pair.learner.id],
          optional: []
        },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString()
        },
        rewards: {
          individual: {
            xp: 150,
            skills: { [pair.skill]: 20 }
          },
          family: {
            traditionPoints: 10,
            legacyPoints: 15
          }
        },
        progress: {
          status: 'active',
          participantProgress: {},
          overallProgress: 0
        }
      };
    }

    return this.generateGenericFamilyQuest(familyProfile, {
      type: 'skill-sharing',
      minParticipants: 2,
      maxParticipants: 3,
      duration: 30,
      difficulty: 2,
      primarySkill: 'teaching',
      secondarySkills: ['learning-ability', 'communication'],
      ageAppropriate: true
    });
  }

  private generateBondingQuest(familyProfile: FamilyProfile): FamilyQuest {
    return this.generateGenericFamilyQuest(familyProfile, {
      type: 'bonding',
      minParticipants: 2,
      maxParticipants: familyProfile.members.length,
      duration: 45,
      difficulty: 1,
      primarySkill: 'relationship-building',
      secondarySkills: ['emotional-intelligence', 'communication'],
      ageAppropriate: true
    });
  }

  private generateGenericFamilyQuest(
    familyProfile: FamilyProfile,
    params: FamilyQuestParameters
  ): FamilyQuest {
    const availableMembers = this.getAvailableMembers(familyProfile);
    const participants = this.selectParticipants(
      availableMembers,
      params.minParticipants,
      params.maxParticipants
    );

    const questParams = {
      difficulty: params.difficulty,
      timeRequired: params.duration,
      energyRequired: 0.6,
      focusLevel: 3,
      skillAlignment: [params.primarySkill, ...params.secondarySkills],
      growthPotential: 0.8
    };

    const template = aiQuestTemplates.generateQuestFromParameters(questParams);
    const { title, description } = aiQuestTemplates.interpolateTemplate(template);

    return {
      id: `fquest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Family ${title}`,
      description: this.adaptDescriptionForFamily(description, participants),
      type: params.type,
      participants: {
        required: participants.required,
        optional: participants.optional
      },
      schedule: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + params.duration * 60000).toISOString()
      },
      rewards: {
        individual: {
          xp: 100 * params.difficulty,
          skills: {
            [params.primarySkill]: 15,
            ...params.secondarySkills.reduce((acc, skill) => ({
              ...acc,
              [skill]: 10
            }), {})
          }
        },
        family: {
          traditionPoints: params.type === 'tradition' ? 20 : 10,
          legacyPoints: 5 * params.difficulty
        }
      },
      progress: {
        status: 'active',
        participantProgress: {},
        overallProgress: 0
      }
    };
  }

  private findComplementarySkills(members: FamilyMember[]): Array<{
    teacher: FamilyMember;
    learner: FamilyMember;
    skill: string;
  }> {
    const pairs: Array<{
      teacher: FamilyMember;
      learner: FamilyMember;
      skill: string;
    }> = [];

    members.forEach(teacher => {
      teacher.skills.teaching.forEach(skill => {
        members.forEach(learner => {
          if (
            teacher.id !== learner.id &&
            learner.skills.learning.includes(skill)
          ) {
            pairs.push({ teacher, learner, skill });
          }
        });
      });
    });

    return pairs;
  }

  private getAvailableMembers(familyProfile: FamilyProfile) {
    // In a real implementation, check schedules and availability
    return familyProfile.members;
  }

  private selectParticipants(
    members: FamilyMember[],
    min: number,
    max: number
  ): { required: string[]; optional: string[] } {
    const required = members
      .slice(0, min)
      .map(m => m.id);
    
    const optional = members
      .slice(min, max)
      .map(m => m.id);

    return { required, optional };
  }

  private adaptDescriptionForFamily(
    description: string,
    participants: { required: string[]; optional: string[] }
  ): string {
    return `Family Activity: ${description} This is a group activity for ${
      participants.required.length
    } family members${
      participants.optional.length > 0
        ? `, with up to ${participants.optional.length} additional participants welcome`
        : ''
    }.`;
  }

  private isTimeForTradition(frequency: string, lastCelebrated: string): boolean {
    const now = new Date();
    const last = new Date(lastCelebrated);
    const daysSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    switch (frequency) {
      case 'daily': return daysSince >= 1;
      case 'weekly': return daysSince >= 7;
      case 'monthly': return daysSince >= 30;
      case 'yearly': return daysSince >= 365;
      default: return true;
    }
  }

  private getRecurringPattern(frequency: string): FamilyQuest['schedule']['recurringPattern'] {
    switch (frequency) {
      case 'daily':
        return { frequency: 'daily' };
      case 'weekly':
        return { frequency: 'weekly', days: [new Date().getDay()] };
      case 'monthly':
        return { frequency: 'monthly' };
      default:
        return undefined;
    }
  }

  private calculateTraditionRewards(tradition: any, familyProfile: FamilyProfile) {
    const baseXP = 100;
    const participantMultiplier = Math.min(2, tradition.participants.length / 2);
    const traditionLevel = familyProfile.stats.activeTraditions;
    
    return {
      individual: {
        xp: Math.round(baseXP * participantMultiplier),
        skills: tradition.skills.reduce((acc: Record<string, number>, skill: string) => ({
          ...acc,
          [skill]: 10
        }), {})
      },
      family: {
        traditionPoints: 20 + traditionLevel,
        legacyPoints: 10
      }
    };
  }
}

export const familyQuestGenerator = FamilyQuestGenerator.getInstance(); 