import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { EventCard } from './EventCard';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay
} from 'date-fns';

interface MonthViewProps {
  date: Date;
}

export function MonthView({ date }: MonthViewProps) {
  const { getEventsForDate, getDailyXPBreakdown } = useTimelineStore();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-1 p-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center text-sm text-gray-500 pb-2">
          {day}
        </div>
      ))}
      
      {days.map(day => {
        const events = getEventsForDate(day);
        const stats = getDailyXPBreakdown(day);
        
        return (
          <div 
            key={day.toISOString()}
            className={`
              min-h-[120px] p-2 border rounded-lg
              ${!isSameMonth(day, date) ? 'bg-gray-50' : ''}
              ${isSameDay(day, new Date()) ? 'border-blue-400' : ''}
            `}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">
                {format(day, 'd')}
              </span>
              {stats.total > 0 && (
                <span className="text-xs font-medium text-green-600">
                  +{stats.total}
                </span>
              )}
            </div>
            <div className="mt-1 space-y-1">
              {events.slice(0, 3).map(event => (
                <div 
                  key={event.id}
                  className="text-xs truncate"
                  style={{ color: getEventTypeColor(event.type) }}
                >
                  • {event.title}
                </div>
              ))}
              {events.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{events.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case 'quest': return '#3B82F6';
    case 'skill': return '#10B981';
    case 'achievement': return '#8B5CF6';
    case 'nutrition': return '#F59E0B';
    default: return '#6B7280';
  }
} 