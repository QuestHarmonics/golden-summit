import React from 'react';
import { TimelineEvent } from '../../store/timelineStore';
import { EventCard } from './EventCard';

interface DayViewProps {
  date: Date;
  events: TimelineEvent[];
}

export function DayView({ date, events }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventHour = new Date(event.timestamp).getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-4">
      {hours.map(hour => (
        <React.Fragment key={hour}>
          <div className="text-right text-sm text-gray-500 pr-2 py-2">
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
          <div className="border-l border-gray-200 pl-4 py-2">
            {getEventsForHour(hour).map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                showXP
                interactive
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
} 