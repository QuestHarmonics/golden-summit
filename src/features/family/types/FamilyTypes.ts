export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'guardian';
  avatar?: string;
  skills: {
    teaching: string[];
    learning: string[];
    shared: string[];
  };
  preferences: {
    notificationEnabled: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
    privacyLevel: 'private' | 'family' | 'public';
  };
}

export interface FamilyTradition {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  participants: string[];
  skills: string[];
  lastCelebrated?: string;
  memories: Array<{
    date: string;
    description: string;
    photos?: string[];
    participants: string[];
  }>;
}

export interface FamilyQuest {
  id: string;
  title: string;
  description: string;
  type: 'tradition' | 'skill-sharing' | 'bonding';
  participants: {
    required: string[];
    optional: string[];
  };
  schedule: {
    startDate: string;
    endDate?: string;
    recurringPattern?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      days?: number[];
    };
  };
  rewards: {
    individual: {
      xp: number;
      skills: Record<string, number>;
    };
    family: {
      traditionPoints: number;
      legacyPoints: number;
    };
  };
  progress: {
    status: 'active' | 'completed' | 'failed';
    participantProgress: Record<string, number>;
    overallProgress: number;
  };
}

export interface FamilyLegacy {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  type: 'achievement' | 'milestone' | 'tradition';
  participants: string[];
  photos?: string[];
  impact: number;
}

export interface FamilyStats {
  totalTraditions: number;
  activeTraditions: number;
  sharedSkills: number;
  familyLevel: number;
  legacyPoints: number;
  questsCompleted: number;
  milestonesAchieved: number;
}

export interface FamilySettings {
  privacyLevel: 'private' | 'family' | 'public';
  notificationPreferences: {
    traditions: boolean;
    quests: boolean;
    achievements: boolean;
    milestones: boolean;
  };
  automatedQuests: boolean;
  traditionReminders: boolean;
}

export interface FamilyProfile {
  id: string;
  name: string;
  createdAt: string;
  members: FamilyMember[];
  traditions: FamilyTradition[];
  quests: FamilyQuest[];
  legacies: FamilyLegacy[];
  stats: FamilyStats;
  settings: FamilySettings;
} 