import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { EventCard } from './EventCard';
import { format, isSameDay } from 'date-fns';

interface TimelineViewProps {
  date: Date;
}

export function TimelineView({ date }: TimelineViewProps) {
  const { getEventsForDate } = useTimelineStore();
  const events = getEventsForDate(date);

  return (
    <div className="p-4">
      <div className="relative border-l-2 border-gray-200 ml-4">
        {events.map((event, index) => (
          <div key={event.id} className="mb-8 ml-6">
            <div className="absolute -left-4 mt-2">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-1">
              {format(event.timestamp, 'HH:mm')}
            </div>
            <EventCard
              event={event}
              showXP
              interactive
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'quest': return '🎯';
    case 'skill': return '⚡';
    case 'achievement': return '🏆';
    case 'nutrition': return '🍎';
    default: return '📝';
  }
} 