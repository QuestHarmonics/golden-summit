import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dataService } from '../services/DataService';

export interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  focus: number;
  timeSpent: number;
  activities: Array<{
    date: string;
    duration: number;
    description: string;
  }>;
  progress: {
    daily: number;
    weekly: number;
    total: number;
  };
  description: string;
  connections: string[];
  metrics?: {
    workoutCount?: number;
    totalDuration?: number;
    typesTracked?: Set<string>;
    streakDays?: number;
    lastTracked?: string | null;
    analytics?: {
      preferredTimes: Record<string, number>;
      commonExercises: Record<string, number>;
      progressByType: Record<string, any>;
    };
    averageDuration?: number;
    totalNights?: number;
    qualityScores?: number[];
    patterns?: {
      bedtimes: Record<string, number>;
      wakeTimes: Record<string, number>;
      qualityFactors: Record<string, number>;
      mealTimes: Record<string, number>;
      commonFoods: Record<string, number>;
      nutritionBalance: Record<string, number>;
      peakHours: Record<string, number>;
      taskTypes: Record<string, number>;
      efficiency: Record<string, number>;
    };
    mealsLogged?: number;
    entriesCount?: number;
    moodPatterns?: Record<string, number>;
    triggers?: Record<string, number>;
    correlations?: {
      sleep: any[];
      exercise: any[];
      nutrition: any[];
    };
    tasksCompleted?: number;
    focusSessions?: number;
    timeTracked?: number;
  };
}

interface QuestEvent {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  skillId?: string;
  requiredLevel?: number;
  isSecret?: boolean;
  xpMultiplier?: number;
}

interface MotivationType {
  achievement: number;
  social: number;
  exploration: number;
  competition: number;
  creativity: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'core' | 'wellness' | 'special' | 'achievement';
  xpReward: number;
  goldReward: number;
  requirements: {
    level?: number;
    skills?: string[];
    prerequisites?: string[];
  };
  isRequired?: boolean;
  completedAt?: string;
  status?: 'active' | 'completed' | 'failed';
  streak?: number;
  lastUpdated?: string;
  bonusRewards?: {
    items?: string[];
    skills?: Record<string, number>;
    achievements?: string[];
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'milestone' | 'skill' | 'quest' | 'special';
  requirements: {
    type: 'quest_count' | 'skill_level' | 'streak' | 'total_xp' | 'special';
    value: number;
    skillId?: string;
    questId?: string;
  };
  rewards: {
    xp: number;
    gold: number;
    items?: string[];
  };
  unlockedAt?: string;
  progress?: number;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'equipment' | 'collectible';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  effects?: {
    type: 'buff' | 'boost' | 'protection';
    value: number;
    duration?: number;
    target?: string;
  }[];
  quantity: number;
  stackable: boolean;
  tradeable: boolean;
}

const DEFAULT_ITEMS: Record<string, Omit<InventoryItem, 'quantity'>> = {
  'skill_boost_scroll': {
    id: 'skill_boost_scroll',
    name: 'Skill Boost Scroll',
    description: 'Doubles XP gain for a skill for 1 hour',
    type: 'consumable',
    rarity: 'uncommon',
    effects: [{
      type: 'boost',
      value: 2,
      duration: 3600,
      target: 'skill_xp'
    }],
    stackable: true,
    tradeable: true
  },
  'streak_protection_charm': {
    id: 'streak_protection_charm',
    name: 'Streak Protection Charm',
    description: 'Prevents losing a streak once',
    type: 'consumable',
    rarity: 'rare',
    effects: [{
      type: 'protection',
      value: 1,
      target: 'streak'
    }],
    stackable: true,
    tradeable: true
  },
  'focus_crystal': {
    id: 'focus_crystal',
    name: 'Focus Crystal',
    description: 'Increases focus gain by 50% for 30 minutes',
    type: 'consumable',
    rarity: 'uncommon',
    effects: [{
      type: 'buff',
      value: 1.5,
      duration: 1800,
      target: 'focus_gain'
    }],
    stackable: true,
    tradeable: true
  }
};

export interface UserData {
  skills: Array<{
    id: string;
    name: string;
    level: number;
    xp: number;
    focus: number;
    timeSpent: number;
    activities: Array<{
      date: string;
      duration: number;
      description: string;
    }>;
    progress: {
      daily: number;
      weekly: number;
      total: number;
    };
    description: string;
    connections: string[];
  }>;
  xp: number;
  level: number;
  coins: number;
  quests: Quest[];
  achievements: Achievement[];
  inventory: InventoryItem[];
  settings: {
    theme: string;
    notifications: boolean;
  };
  recommendations?: {
    questStyle: 'competitive' | 'personal';
    rewardSystem: 'social' | 'achievement';
    trackingPreference: 'flexible' | 'structured';
    challengeType: 'discovery' | 'mastery';
  };
  motivationProfile?: {
    achievement: number;
    social: number;
    exploration: number;
    competition: number;
    creativity: number;
  };
  gameSettings?: {
    questFrequency: 'high' | 'moderate' | 'low';
    socialFeatures: 'enabled' | 'minimal' | 'disabled';
    competitionMode: 'enabled' | 'disabled';
    explorationMode: 'enabled' | 'disabled';
  };
}

interface GameState {
  users: Record<string, { data: UserData }>;
  currentUser: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isTutorialComplete: boolean;
}

interface GameActions {
  login: (username: string, password: string) => void;
  register: (username: string, password: string) => void;
  logout: () => void;
  updateUserData: (username: string, data: Partial<UserData>) => void;
  deleteProfile: (username: string) => void;
  exportData: (username: string) => void;
  importData: (data: any) => void;
  completeTutorial: () => void;
  resetQuests: () => void;
}

const DEFAULT_SKILLS = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Awareness and presence in daily activities',
    connections: ['stress-management', 'sleep-quality']
  },
  {
    id: 'sleep-quality',
    name: 'Sleep Quality',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Optimize sleep patterns and recovery',
    connections: ['energy-management', 'stress-management']
  },
  {
    id: 'nutrition-awareness',
    name: 'Nutrition Awareness',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Understanding and optimizing nutrition',
    connections: ['meal-planning', 'energy-management']
  },
  {
    id: 'physical-activity',
    name: 'Physical Activity',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Regular movement and exercise',
    connections: ['energy-management', 'stress-management']
  },
  {
    id: 'stress-management',
    name: 'Stress Management',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Techniques for handling stress',
    connections: ['emotional-intelligence', 'mindfulness']
  },
  {
    id: 'time-management',
    name: 'Time Management',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Effective use of time',
    connections: ['productivity', 'goal-setting']
  },
  {
    id: 'productivity',
    name: 'Productivity',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Efficient task completion',
    connections: ['focus-mastery', 'time-management']
  },
  {
    id: 'focus-mastery',
    name: 'Focus Mastery',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Deep work and concentration',
    connections: ['productivity', 'mindfulness']
  },
  {
    id: 'emotional-intelligence',
    name: 'Emotional Intelligence',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Understanding and managing emotions',
    connections: ['relationship-building', 'stress-management']
  },
  {
    id: 'relationship-building',
    name: 'Relationship Building',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Developing meaningful connections',
    connections: ['emotional-intelligence', 'communication']
  },
  {
    id: 'communication',
    name: 'Communication',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Clear and effective expression',
    connections: ['relationship-building', 'leadership']
  },
  {
    id: 'leadership',
    name: 'Leadership',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Guiding and inspiring others',
    connections: ['communication', 'decision-making']
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Making effective choices',
    connections: ['problem-solving', 'leadership']
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Finding creative solutions',
    connections: ['decision-making', 'critical-thinking']
  },
  {
    id: 'critical-thinking',
    name: 'Critical Thinking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Analytical and logical reasoning',
    connections: ['problem-solving', 'learning-ability']
  },
  {
    id: 'learning-ability',
    name: 'Learning Ability',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Acquiring new knowledge effectively',
    connections: ['critical-thinking', 'adaptability']
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Flexibility in changing situations',
    connections: ['learning-ability', 'resilience']
  },
  {
    id: 'resilience',
    name: 'Resilience',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Bouncing back from challenges',
    connections: ['adaptability', 'stress-management']
  },
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Planning and achieving objectives',
    connections: ['time-management', 'productivity']
  },
  {
    id: 'energy-management',
    name: 'Energy Management',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Optimizing personal energy levels',
    connections: ['sleep-quality', 'physical-activity']
  },
  {
    id: 'workout-tracking',
    name: 'Workout Tracking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Track and analyze workout patterns',
    connections: ['physical-activity', 'goal-setting'],
    metrics: {
      workoutCount: 0,
      totalDuration: 0,
      typesTracked: new Set(),
      streakDays: 0,
      lastTracked: null,
      analytics: {
        preferredTimes: {},
        commonExercises: {},
        progressByType: {}
      }
    }
  },
  {
    id: 'sleep-tracking',
    name: 'Sleep Tracking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Monitor sleep patterns and quality',
    connections: ['sleep-quality', 'energy-management'],
    metrics: {
      averageDuration: 0,
      totalNights: 0,
      qualityScores: [],
      patterns: {
        bedtimes: {},
        wakeTimes: {},
        qualityFactors: {}
      }
    }
  },
  {
    id: 'nutrition-tracking',
    name: 'Nutrition Tracking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Record and analyze eating habits',
    connections: ['nutrition-awareness', 'energy-management'],
    metrics: {
      mealsLogged: 0,
      streakDays: 0,
      patterns: {
        mealTimes: {},
        commonFoods: {},
        nutritionBalance: {}
      }
    }
  },
  {
    id: 'mood-tracking',
    name: 'Mood Tracking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Monitor emotional patterns',
    connections: ['emotional-intelligence', 'stress-management'],
    metrics: {
      entriesCount: 0,
      moodPatterns: {},
      triggers: {},
      correlations: {
        sleep: [],
        exercise: [],
        nutrition: []
      }
    }
  },
  {
    id: 'productivity-tracking',
    name: 'Productivity Tracking',
    level: 1,
    xp: 0,
    focus: 0,
    timeSpent: 0,
    activities: [],
    progress: { daily: 0, weekly: 0, total: 0 },
    description: 'Monitor work patterns and efficiency',
    connections: ['productivity', 'time-management'],
    metrics: {
      tasksCompleted: 0,
      focusSessions: 0,
      timeTracked: 0,
      patterns: {
        peakHours: {},
        taskTypes: {},
        efficiency: {}
      }
    }
  }
];

const DEFAULT_QUESTS: Omit<Quest, 'status' | 'completedAt'>[] = [
  // Core Daily Quests
  {
    id: 'daily-reflection',
    title: 'Daily Reflection',
    description: 'Take a moment to reflect on your progress and set intentions for the day. What will you accomplish?',
    type: 'daily' as const,
    xpReward: 50,
    goldReward: 10,
    requirements: { level: 1 },
    isRequired: true,
    category: 'core' as const
  },
  {
    id: 'skill-practice',
    title: 'Practice a Skill',
    description: 'Spend at least 10 minutes practicing any skill. Quality practice leads to mastery!',
    type: 'daily' as const,
    xpReward: 100,
    goldReward: 20,
    requirements: { level: 1 },
    isRequired: true,
    category: 'core' as const
  },
  // Wellness Quests
  {
    id: 'mindful-minutes',
    title: 'Mindful Minutes',
    description: 'Complete 5 minutes of mindful breathing or meditation',
    type: 'daily' as const,
    xpReward: 75,
    goldReward: 15,
    requirements: { level: 1, skills: ['mindfulness'] },
    category: 'wellness' as const
  },
  {
    id: 'sleep-schedule',
    title: 'Sleep Guardian',
    description: 'Maintain a consistent sleep schedule',
    type: 'daily' as const,
    xpReward: 80,
    goldReward: 20,
    requirements: { level: 1, skills: ['sleep-quality'] },
    category: 'wellness' as const
  },
  // Progress Tracking
  {
    id: 'track-progress',
    title: 'Track Your Progress',
    description: 'Update your activity log for any skill. Knowledge is power!',
    type: 'daily' as const,
    xpReward: 75,
    goldReward: 15,
    requirements: { level: 1 },
    isRequired: true,
    category: 'core' as const
  },
  // Weekly Planning
  {
    id: 'weekly-goal',
    title: 'Set Weekly Goal',
    description: 'Plan your objectives for the week ahead. A goal without a plan is just a wish!',
    type: 'weekly' as const,
    xpReward: 200,
    goldReward: 50,
    requirements: { level: 1 },
    isRequired: true,
    category: 'core' as const
  },
  // Special Quests
  {
    id: 'skill-synergy',
    title: 'Skill Synergy',
    description: 'Practice two connected skills in the same day',
    type: 'daily' as const,
    xpReward: 150,
    goldReward: 30,
    requirements: { level: 2 },
    category: 'special' as const
  },
  {
    id: 'streak-keeper',
    title: 'Streak Keeper',
    description: 'Maintain a 3-day streak in any skill',
    type: 'special' as const,
    xpReward: 300,
    goldReward: 100,
    requirements: { level: 2 },
    category: 'achievement' as const
  },
  // Monthly Challenges
  {
    id: 'monthly-mastery',
    title: 'Monthly Mastery',
    description: 'Reach level 5 in any skill',
    type: 'monthly' as const,
    xpReward: 1000,
    goldReward: 500,
    requirements: { level: 3 },
    category: 'achievement' as const
  }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Milestone Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first quest',
    category: 'milestone',
    requirements: {
      type: 'quest_count',
      value: 1
    },
    rewards: {
      xp: 100,
      gold: 50
    }
  },
  {
    id: 'habit-former',
    title: 'Habit Former',
    description: 'Complete 10 daily quests',
    category: 'milestone',
    requirements: {
      type: 'quest_count',
      value: 10
    },
    rewards: {
      xp: 500,
      gold: 200
    }
  },
  // Skill Achievements
  {
    id: 'skill-master',
    title: 'Skill Master',
    description: 'Reach level 5 in any skill',
    category: 'skill',
    requirements: {
      type: 'skill_level',
      value: 5
    },
    rewards: {
      xp: 1000,
      gold: 500,
      items: ['skill_boost_scroll']
    }
  },
  // Streak Achievements
  {
    id: 'consistent-learner',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day streak',
    category: 'quest',
    requirements: {
      type: 'streak',
      value: 7
    },
    rewards: {
      xp: 700,
      gold: 300,
      items: ['streak_protection_charm']
    }
  }
];

const initialState: GameState = {
  users: {},
  currentUser: null,
  isAuthenticated: false,
  error: null,
  isTutorialComplete: false
};

const createInitialUserData = (): UserData => ({
  skills: DEFAULT_SKILLS,
  xp: 0,
  level: 1,
  coins: 100, // Starting coins
  quests: DEFAULT_QUESTS.map(quest => ({
    ...quest,
    status: 'active' as const
  })),
  achievements: DEFAULT_ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    progress: 0
  })),
  inventory: [
    // Starting items
    {
      ...DEFAULT_ITEMS.skill_boost_scroll,
      quantity: 1
    },
    {
      ...DEFAULT_ITEMS.focus_crystal,
      quantity: 2
    }
  ],
  settings: {
    theme: 'light',
    notifications: true
  },
  gameSettings: {
    questFrequency: 'moderate',
    socialFeatures: 'enabled',
    competitionMode: 'disabled',
    explorationMode: 'enabled'
  }
});

const addSkillActivity = (skill: any, activityData: any) => {
  const now = new Date();
  skill.activities.push({
    date: now.toISOString(),
    duration: activityData.duration || 0,
    description: activityData.description,
    metrics: activityData.metrics || {}
  });

  // Update metrics based on activity type
  if (skill.metrics) {
    switch (skill.id) {
      case 'workout-tracking':
        skill.metrics.workoutCount++;
        skill.metrics.totalDuration += activityData.duration;
        skill.metrics.typesTracked.add(activityData.metrics?.type);
        skill.metrics.analytics.preferredTimes[activityData.metrics?.timeOfDay] = 
          (skill.metrics.analytics.preferredTimes[activityData.metrics?.timeOfDay] || 0) + 1;
        break;
      case 'sleep-tracking':
        skill.metrics.totalNights++;
        skill.metrics.averageDuration = 
          (skill.metrics.averageDuration * (skill.metrics.totalNights - 1) + activityData.duration) / 
          skill.metrics.totalNights;
        break;
      // Add other tracking type handlers
    }
  }

  // Update progress
  skill.progress.daily++;
  skill.progress.weekly++;
  skill.progress.total++;
};

// Add helper function for week completion check
const isWeekComplete = (completedAt: string | undefined): boolean => {
  if (!completedAt) return false;
  const completedDate = new Date(completedAt);
  const now = new Date();
  return now.getTime() - completedDate.getTime() >= 7 * 24 * 60 * 60 * 1000;
};

export const useGameStore = create(
  persist<GameState & GameActions>(
    (set, get) => ({
      ...initialState,

      login: async (username: string, password: string) => {
        try {
          // TODO: Add actual authentication
          const userData = dataService.getUserData(username) || createInitialUserData();
          set({
            users: { ...get().users, [username]: { data: userData } },
            currentUser: username,
            isAuthenticated: true,
            error: null
          });
        } catch (error) {
          set({ error: 'Login failed' });
        }
      },

      register: async (username: string, password: string) => {
        try {
          if (dataService.isDataAvailable(username)) {
            set({ error: 'Username already exists' });
            return;
          }
          const userData = createInitialUserData();
          await dataService.saveUserData(username, userData);
          set({
            users: { ...get().users, [username]: { data: userData } },
            currentUser: username,
            isAuthenticated: true,
            error: null
          });
        } catch (error) {
          set({ error: 'Registration failed' });
        }
      },

      logout: () => {
        const { currentUser } = get();
        if (currentUser) {
          const userData = get().users[currentUser]?.data;
          if (userData) {
            dataService.saveUserData(currentUser, userData);
          }
        }
        set({
          currentUser: null,
          isAuthenticated: false
        });
      },

      updateUserData: async (username: string, data: Partial<UserData>) => {
        const currentData = get().users[username]?.data;
        if (currentData) {
          const updatedData = { ...currentData, ...data };
          await dataService.saveUserData(username, updatedData);
          set({
            users: {
              ...get().users,
              [username]: { data: updatedData }
            }
          });
        }
      },

      deleteProfile: async (username: string) => {
        dataService.clearUserData(username);
        const users = { ...get().users };
        delete users[username];
        set({
          users,
          currentUser: null,
          isAuthenticated: false
        });
      },

      exportData: (username: string) => {
        return dataService.exportUserData(username);
      },

      importData: async (data: string) => {
        const { currentUser } = get();
        if (currentUser && data) {
          const success = dataService.importUserData(currentUser, data);
          if (success) {
            const userData = dataService.getUserData(currentUser);
            if (userData) {
              set({
                users: {
                  ...get().users,
                  [currentUser]: { data: userData }
                }
              });
            }
          }
        }
      },

      completeTutorial: () => {
        set({ isTutorialComplete: true });
      },

      resetQuests: () => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        const userData = users[currentUser].data;
        const updatedQuests = userData.quests.map(quest => {
          if ((quest.type === 'daily' && quest.status === 'completed') ||
              (quest.type === 'weekly' && quest.status === 'completed' && isWeekComplete(quest.completedAt))) {
            return {
              ...quest,
              status: 'active' as const,
              completedAt: undefined
            };
          }
          return quest;
        });

        set(state => ({
          users: {
            ...state.users,
            [currentUser]: {
              ...state.users[currentUser],
              data: {
                ...userData,
                quests: updatedQuests
              }
            }
          }
        }));
      }
    }),
    {
      name: 'game-storage',
      getStorage: () => localStorage
    }
  )
); 

export { addSkillActivity }; 