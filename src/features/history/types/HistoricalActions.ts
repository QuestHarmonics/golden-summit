import { Timestamp } from 'firebase/firestore';

export enum HistoricalActionType {
  ADD_STORY = 'add_story',
  ADD_PHOTO = 'add_photo',
  ADD_LIFE_EVENT = 'add_life_event',
  VERIFY_INFO = 'verify_info',
  ADD_RELATION = 'add_relation',
  COMPLETE_PROFILE = 'complete_profile',
  SHARE_MEMORY = 'share_memory',
  ADD_ACHIEVEMENT = 'add_achievement',
  START_QUEST = 'start_quest',
  COMPLETE_QUEST = 'complete_quest'
}

export enum HistoricalQuestType {
  STORY_COLLECTION = 'story_collection',
  PHOTO_ARCHIVE = 'photo_archive',
  FAMILY_INTERVIEW = 'family_interview',
  TIMELINE_BUILDING = 'timeline_building',
  LEGACY_RESEARCH = 'legacy_research',
  LOCATION_MAPPING = 'location_mapping',
  TRADITION_RECORDING = 'tradition_recording'
}

export interface HistoricalReward {
  xp: number;
  gold: number;
  achievements?: string[];
  unlocks?: {
    questTypes?: HistoricalQuestType[];
    features?: string[];
    items?: string[];
  };
}

export const HISTORICAL_ACTION_REWARDS: Record<HistoricalActionType, HistoricalReward> = {
  [HistoricalActionType.ADD_STORY]: {
    xp: 50,
    gold: 25,
    unlocks: {
      questTypes: [HistoricalQuestType.STORY_COLLECTION]
    }
  },
  [HistoricalActionType.ADD_PHOTO]: {
    xp: 30,
    gold: 15,
    unlocks: {
      questTypes: [HistoricalQuestType.PHOTO_ARCHIVE]
    }
  },
  [HistoricalActionType.ADD_LIFE_EVENT]: {
    xp: 40,
    gold: 20,
    unlocks: {
      questTypes: [HistoricalQuestType.TIMELINE_BUILDING]
    }
  },
  [HistoricalActionType.VERIFY_INFO]: {
    xp: 20,
    gold: 10
  },
  [HistoricalActionType.ADD_RELATION]: {
    xp: 25,
    gold: 12
  },
  [HistoricalActionType.COMPLETE_PROFILE]: {
    xp: 100,
    gold: 50,
    unlocks: {
      questTypes: [
        HistoricalQuestType.LEGACY_RESEARCH,
        HistoricalQuestType.LOCATION_MAPPING
      ]
    }
  },
  [HistoricalActionType.SHARE_MEMORY]: {
    xp: 35,
    gold: 17,
    unlocks: {
      questTypes: [HistoricalQuestType.FAMILY_INTERVIEW]
    }
  },
  [HistoricalActionType.ADD_ACHIEVEMENT]: {
    xp: 45,
    gold: 22
  },
  [HistoricalActionType.START_QUEST]: {
    xp: 10,
    gold: 5
  },
  [HistoricalActionType.COMPLETE_QUEST]: {
    xp: 100,
    gold: 50,
    unlocks: {
      questTypes: [HistoricalQuestType.TRADITION_RECORDING]
    }
  }
};

export interface HistoricalQuest {
  id: string;
  type: HistoricalQuestType;
  nodeId: string;  // Reference to historical node
  title: string;
  description: string;
  requirements: {
    actionType: HistoricalActionType;
    count: number;
    specific?: {
      eventType?: string;
      timeframe?: {
        start: Timestamp;
        end: Timestamp;
      };
    };
  }[];
  rewards: HistoricalReward;
  progress: {
    current: number;
    required: number;
    completedRequirements: string[];
  };
  createdAt: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  createdBy: string;
  assignedTo?: string;
}

export interface HistoricalAction {
  id: string;
  type: HistoricalActionType;
  nodeId: string;
  userId: string;
  questId?: string;
  data: {
    storyId?: string;
    photoId?: string;
    eventId?: string;
    relationId?: string;
    achievementId?: string;
    verificationDetails?: {
      field: string;
      previousValue: any;
      newValue: any;
      source?: string;
    };
  };
  timestamp: Timestamp;
  rewardClaimed: boolean;
  reward?: HistoricalReward;
} 