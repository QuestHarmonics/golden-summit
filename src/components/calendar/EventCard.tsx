import React from 'react';
import { TimelineEvent } from '../../store/timelineStore';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: TimelineEvent;
  showXP?: boolean;
  interactive?: boolean;
}

export function EventCard({ event, showXP, interactive }: EventCardProps) {
  const getEventColor = () => {
    switch (event.type) {
      case 'quest': return 'bg-blue-50 border-blue-200';
      case 'skill': return 'bg-green-50 border-green-200';
      case 'achievement': return 'bg-purple-50 border-purple-200';
      case 'nutrition': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div 
      className={`
        p-3 rounded-lg border ${getEventColor()}
        ${interactive ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">{event.title}</h4>
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
        {showXP && (
          <div className="text-sm font-medium text-green-600">
            +{event.xpGained} XP
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
        {event.duration && (
          <span>• {Math.round(event.duration / 60000)}min</span>
        )}
      </div>
    </div>
  );
} 