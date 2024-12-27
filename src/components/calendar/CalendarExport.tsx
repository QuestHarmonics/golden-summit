import React, { useState } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { generateCalendarExports } from '../../utils/calendar/export';

export function CalendarExport() {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const { getEventsForDateRange } = useTimelineStore();

  const handleExport = async (type: 'ics' | 'google' | 'outlook') => {
    const events = getEventsForDateRange(
      new Date(), // Start date
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    );

    const exports = generateCalendarExports(events);

    switch (type) {
      case 'ics':
        // Download ICS file
        const link = document.createElement('a');
        link.href = exports.ics;
        link.download = 'calendar.ics';
        link.click();
        break;
      case 'google':
        window.open(exports.google, '_blank');
        break;
      case 'outlook':
        window.open(exports.outlook, '_blank');
        break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportOptions(!showExportOptions)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Export Calendar
      </button>

      {showExportOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
          <button
            onClick={() => handleExport('ics')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50"
          >
            Download ICS
          </button>
          <button
            onClick={() => handleExport('google')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50"
          >
            Add to Google Calendar
          </button>
          <button
            onClick={() => handleExport('outlook')}
            className="w-full px-4 py-2 text-left hover:bg-gray-50"
          >
            Add to Outlook
          </button>
        </div>
      )}
    </div>
  );
} 