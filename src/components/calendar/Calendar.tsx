import React, { useState } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { CalendarView, DayStats } from '../../types/calendar';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { TimelineView } from './TimelineView';
import { CalendarHeader } from './CalendarHeader';
import { CalendarStats } from './CalendarStats';
import { CalendarFilters, type CalendarFilters as FilterType } from './CalendarFilters';
import { CalendarExport } from './CalendarExport';

export function Calendar() {
  const [view, setView] = useState<CalendarView>({
    type: 'day',
    date: new Date()
  });

  const { getEventsForDate, getEventsForDateRange, getDailyXPBreakdown } = useTimelineStore();

  const [filters, setFilters] = useState<FilterType>({
    eventTypes: ['quest', 'skill', 'achievement', 'nutrition', 'custom']
  });

  const filterEvents = (events: TimelineEvent[]) => {
    return events.filter(event => {
      if (!filters.eventTypes.includes(event.type)) return false;
      if (filters.minXP && event.xpGained < filters.minXP) return false;
      if (filters.maxXP && event.xpGained > filters.maxXP) return false;
      if (filters.searchTerm && !event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      return true;
    });
  };

  const renderView = () => {
    switch (view.type) {
      case 'day':
        return <DayView date={view.date} events={getEventsForDate(view.date)} />;
      case 'week':
        return <WeekView date={view.date} />;
      case 'month':
        return <MonthView date={view.date} />;
      case 'timeline':
        return <TimelineView date={view.date} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <CalendarHeader 
          view={view} 
          onViewChange={setView}
        />
        <CalendarExport />
      </div>
      <CalendarStats date={view.date} />
      <div className="flex-1 overflow-auto">
        {renderView()}
      </div>
      <CalendarFilters onFilterChange={setFilters} />
    </div>
  );
} 