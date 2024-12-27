import { TimelineEvent } from '../../store/timelineStore';
import { 
  eachDayOfInterval, 
  eachHourOfInterval,
  isSameDay,
  differenceInDays,
  format 
} from 'date-fns';

export interface ActivityPattern {
  type: 'daily' | 'weekly' | 'time-of-day';
  confidence: number; // 0-1
  description: string;
  details: Record<string, number>;
  recommendation?: string;
}

export interface StreakAnalysis {
  currentStreak: number;
  longestStreak: number;
  totalStreakDays: number;
  streakHistory: {
    start: Date;
    end: Date;
    length: number;
  }[];
  consistency: number; // 0-1
}

export function analyzePatterns(events: TimelineEvent[]): ActivityPattern[] {
  const patterns: ActivityPattern[] = [];

  // Time of day patterns
  const hourlyDistribution = getHourlyDistribution(events);
  const timePatterns = analyzeTimePatterns(hourlyDistribution);
  patterns.push(timePatterns);

  // Daily patterns
  const dailyDistribution = getDailyDistribution(events);
  const dailyPatterns = analyzeDailyPatterns(dailyDistribution);
  patterns.push(dailyPatterns);

  // Weekly patterns
  const weeklyDistribution = getWeeklyDistribution(events);
  const weeklyPatterns = analyzeWeeklyPatterns(weeklyDistribution);
  patterns.push(weeklyPatterns);

  return patterns;
}

export function analyzeStreaks(
  events: TimelineEvent[], 
  targetTypes: string[]
): StreakAnalysis {
  let currentStreak = 0;
  let longestStreak = 0;
  let streakHistory = [];
  let streakStart = null;

  const days = eachDayOfInterval({
    start: events[0].timestamp,
    end: events[events.length - 1].timestamp
  });

  let prevDay = null;
  for (const day of days) {
    const dayEvents = events.filter(e => 
      isSameDay(e.timestamp, day) && 
      targetTypes.includes(e.type)
    );

    if (dayEvents.length > 0) {
      if (!streakStart) streakStart = day;
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      if (streakStart) {
        streakHistory.push({
          start: streakStart,
          end: prevDay,
          length: currentStreak
        });
      }
      streakStart = null;
      currentStreak = 0;
    }
    prevDay = day;
  }

  const totalDays = differenceInDays(
    events[events.length - 1].timestamp,
    events[0].timestamp
  );

  return {
    currentStreak,
    longestStreak,
    totalStreakDays: streakHistory.reduce((sum, s) => sum + s.length, 0),
    streakHistory,
    consistency: streakHistory.reduce((sum, s) => sum + s.length, 0) / totalDays
  };
}

function getHourlyDistribution(events: TimelineEvent[]): Record<number, number> {
  return events.reduce((acc, event) => {
    const hour = new Date(event.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}

function analyzeTimePatterns(hourlyDist: Record<number, number>): ActivityPattern {
  const total = Object.values(hourlyDist).reduce((sum, count) => sum + count, 0);
  const peakHours = Object.entries(hourlyDist)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => Number(hour));

  return {
    type: 'time-of-day',
    confidence: calculateConfidence(hourlyDist),
    description: `Most active during ${formatHourRange(peakHours)}`,
    details: hourlyDist,
    recommendation: generateTimeRecommendation(peakHours)
  };
}

// Similar implementations for daily and weekly patterns...

function calculateConfidence(distribution: Record<string | number, number>): number {
  const values = Object.values(distribution);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return (max - min) / (max + min);
}

function formatHourRange(hours: number[]): string {
  return hours
    .map(h => format(new Date().setHours(h), 'ha'))
    .join(', ');
}

function generateTimeRecommendation(peakHours: number[]): string {
  const avgHour = Math.round(peakHours.reduce((sum, h) => sum + h, 0) / peakHours.length);
  return `Schedule important tasks around ${format(new Date().setHours(avgHour), 'ha')} for optimal performance`;
} 