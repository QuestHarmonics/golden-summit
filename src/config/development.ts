export const CONFIG = {
  // Core game settings
  PASSIVE_XP_BASE: 10,
  MAX_OFFLINE_HOURS: 72,
  SYNC_INTERVAL: 60000,

  // Quest settings
  MAX_ACTIVE_QUESTS: 3,
  QUEST_REFRESH_HOURS: 24,
  
  // XP Multipliers
  MULTIPLIERS: {
    STREAK_BASE: 0.1,
    ACHIEVEMENT_BASE: 0.05,
    SKILL_MASTERY: 0.2,
    SEASONAL_EVENT: 0.5
  },

  // Development flags
  DEBUG: true,
  MOCK_SERVICES: false,
  AUTO_SAVE_INTERVAL: 5000,

  LEVEL_XP_MULTIPLIER: 1.5
}; 