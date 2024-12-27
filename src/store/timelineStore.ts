import { createStore } from './core/createStore';
import { StoreState } from './types';

export interface TimelineEvent extends BaseEntity {
  type: 'quest' | 'skill' | 'achievement' | 'nutrition' | 'custom';
  title: string;
  description: string;
  timestamp: Date;
  xpGained: number;
  multipliers: Record<string, number>;
  duration?: number;
  linkedIds: {
    questId?: string;
    skillId?: string;
    achievementId?: string;
    recipeId?: string;
  };
  metadata?: Record<string, any>;
}

interface TimelineState extends StoreState {
  events: TimelineEvent[];
  
  // Event management
  addEvent: (event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getEventsForDate: (date: Date) => TimelineEvent[];
  getEventsForDateRange: (start: Date, end: Date) => TimelineEvent[];
  
  // Analytics
  getDailyXPBreakdown: (date: Date) => {
    total: number;
    bySource: Record<string, number>;
    topActivities: TimelineEvent[];
  };
  
  // Calendar integration
  exportToCalendar: (start: Date, end: Date) => CalendarEvent[];
  getStreakData: () => {
    current: number;
    longest: number;
    streakDays: Date[];
  };
}

export const useTimelineStore = createStore<TimelineState>(
  'timeline',
  (set, get) => ({
    events: [],

    addEvent: (event) => {
      const newEvent: TimelineEvent = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...event
      };

      set(state => ({
        events: [...state.events, newEvent]
      }));
    },

    getEventsForDate: (date) => {
      const { events } = get();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      return events.filter(event => 
        event.timestamp >= startOfDay && 
        event.timestamp < endOfDay
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    },

    getDailyXPBreakdown: (date) => {
      const events = get().getEventsForDate(date);
      const breakdown = {
        total: 0,
        bySource: {} as Record<string, number>,
        topActivities: [] as TimelineEvent[]
      };

      events.forEach(event => {
        breakdown.total += event.xpGained;
        breakdown.bySource[event.type] = 
          (breakdown.bySource[event.type] || 0) + event.xpGained;
      });

      breakdown.topActivities = events
        .sort((a, b) => b.xpGained - a.xpGained)
        .slice(0, 5);

      return breakdown;
    }
  })
); 