import { TimelineEvent } from '../../store/timelineStore';

export interface CalendarView {
  type: 'day' | 'week' | 'month' | 'timeline';
  date: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  type: TimelineEvent['type'];
  xpGained: number;
  color?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface DayStats {
  totalXP: number;
  eventCount: number;
  topActivity?: string;
  streakDay: boolean;
  completedQuests: number;
} 