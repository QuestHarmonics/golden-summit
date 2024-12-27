import React, { useState } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { analyzePatterns, analyzeStreaks } from '../../utils/analytics/patterns';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie
} from 'recharts';

interface AdvancedAnalyticsProps {
  startDate: Date;
  endDate: Date;
}

export function AdvancedAnalytics({ startDate, endDate }: AdvancedAnalyticsProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>('time-of-day');
  const { getEventsForDateRange } = useTimelineStore();
  const events = getEventsForDateRange(startDate, endDate);

  const patterns = analyzePatterns(events);
  const streaks = analyzeStreaks(events, ['quest', 'skill']);

  return (
    <div className="space-y-8">
      {/* Pattern Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Activity Patterns</h3>
        <div className="flex gap-4 mb-4">
          {patterns.map(pattern => (
            <button
              key={pattern.type}
              onClick={() => setSelectedPattern(pattern.type)}
              className={`px-4 py-2 rounded-lg ${
                selectedPattern === pattern.type
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100'
              }`}
            >
              {pattern.type.split('-').map(w => 
                w.charAt(0).toUpperCase() + w.slice(1)
              ).join(' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <PatternVisualization 
              pattern={patterns.find(p => p.type === selectedPattern)}
            />
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pattern Insights</h4>
              <p>{patterns.find(p => p.type === selectedPattern)?.description}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <p>{patterns.find(p => p.type === selectedPattern)?.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Streak Analysis</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Current Streak"
            value={streaks.currentStreak}
            suffix="days"
          />
          <StatCard
            title="Longest Streak"
            value={streaks.longestStreak}
            suffix="days"
          />
          <StatCard
            title="Consistency"
            value={Math.round(streaks.consistency * 100)}
            suffix="%"
          />
          <StatCard
            title="Total Streak Days"
            value={streaks.totalStreakDays}
            suffix="days"
          />
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streaks.streakHistory.map(streak => ({
              start: streak.start,
              length: streak.length
            }))}>
              <XAxis 
                dataKey="start"
                tickFormatter={date => format(date, 'MMM d')}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone"
                dataKey="length"
                stroke="#3B82F6"
                name="Streak Length"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Add to existing StatCard component or create new one if needed 