import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { EventCard } from './EventCard';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';

interface WeekViewProps {
  date: Date;
}

export function WeekView({ date }: WeekViewProps) {
  const { getEventsForDate } = useTimelineStore();
  const weekStart = startOfWeek(date);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 h-full divide-x">
      {days.map(day => (
        <div key={day.toISOString()} className="min-h-full">
          <div className={`
            sticky top-0 p-2 text-center border-b bg-white
            ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}
          `}>
            <div className="text-sm text-gray-600">
              {format(day, 'EEE')}
            </div>
            <div className="text-lg font-medium">
              {format(day, 'd')}
            </div>
          </div>
          <div className="p-2 space-y-2">
            {getEventsForDate(day).map(event => (
              <EventCard
                key={event.id}
                event={event}
                showXP
                interactive
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 