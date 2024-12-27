import React from 'react';
import { TimelineEvent } from '../../store/timelineStore';

interface CalendarFiltersProps {
  onFilterChange: (filters: CalendarFilters) => void;
}

export interface CalendarFilters {
  eventTypes: string[];
  minXP?: number;
  maxXP?: number;
  searchTerm?: string;
  tags?: string[];
  dateRange?: [Date, Date];
}

export function CalendarFilters({ onFilterChange }: CalendarFiltersProps) {
  const [filters, setFilters] = React.useState<CalendarFilters>({
    eventTypes: ['quest', 'skill', 'achievement', 'nutrition', 'custom']
  });

  const handleTypeToggle = (type: string) => {
    setFilters(prev => {
      const types = prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type];
      
      const newFilters = { ...prev, eventTypes: types };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex flex-wrap gap-2">
        {['quest', 'skill', 'achievement', 'nutrition', 'custom'].map(type => (
          <button
            key={type}
            onClick={() => handleTypeToggle(type)}
            className={`
              px-3 py-1 rounded-full text-sm
              ${filters.eventTypes.includes(type)
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600'}
            `}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="px-3 py-1 border rounded"
          onChange={e => {
            const newFilters = { ...filters, searchTerm: e.target.value };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
        />
        
        <select
          onChange={e => {
            const newFilters = { ...filters, minXP: Number(e.target.value) };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="px-3 py-1 border rounded"
        >
          <option value="">Min XP</option>
          <option value="10">10+ XP</option>
          <option value="50">50+ XP</option>
          <option value="100">100+ XP</option>
        </select>
      </div>
    </div>
  );
} 