import React from 'react';
import { CalendarView } from '../../types/calendar';
import { format, addDays, addMonths, subDays, subMonths } from 'date-fns';

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({ view, onViewChange }: CalendarHeaderProps) {
  const handlePrevious = () => {
    const newDate = view.type === 'month' 
      ? subMonths(view.date, 1)
      : subDays(view.date, view.type === 'week' ? 7 : 1);
    
    onViewChange({ ...view, date: newDate });
  };

  const handleNext = () => {
    const newDate = view.type === 'month'
      ? addMonths(view.date, 1)
      : addDays(view.date, view.type === 'week' ? 7 : 1);
    
    onViewChange({ ...view, date: newDate });
  };

  const formatDate = () => {
    switch (view.type) {
      case 'day':
        return format(view.date, 'MMMM d, yyyy');
      case 'week':
        const weekEnd = addDays(view.date, 6);
        return `${format(view.date, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'month':
        return format(view.date, 'MMMM yyyy');
      case 'timeline':
        return format(view.date, 'MMMM d, yyyy');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        <span className="text-lg font-medium">{formatDate()}</span>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          →
        </button>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {(['day', 'week', 'month', 'timeline'] as const).map(type => (
          <button
            key={type}
            onClick={() => onViewChange({ ...view, type })}
            className={`
              px-3 py-1 rounded-md text-sm
              ${view.type === type 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-600 hover:bg-gray-200'}
            `}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
} 