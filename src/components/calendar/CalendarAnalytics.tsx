import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CalendarAnalyticsProps {
  startDate: Date;
  endDate: Date;
}

export function CalendarAnalytics({ startDate, endDate }: CalendarAnalyticsProps) {
  const { getEventsForDateRange, getDailyXPBreakdown } = useTimelineStore();
  const events = getEventsForDateRange(startDate, endDate);

  const dailyData = eachDayOfInterval({ start: startDate, end: endDate })
    .map(date => ({
      date,
      ...getDailyXPBreakdown(date)
    }));

  const activityTypeData = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const xpBySourceData = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + event.xpGained;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 p-4">
      {/* XP Over Time */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">XP Progression</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <XAxis 
              dataKey="date" 
              tickFormatter={date => format(date, 'MMM d')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={date => format(date, 'MMM d, yyyy')}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3B82F6" 
              name="Total XP"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Activity Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(activityTypeData).map(([type, count]) => ({
              type,
              count
            }))}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">XP by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(xpBySourceData).map(([type, xp]) => ({
              type,
              xp
            }))}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="xp" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total XP Gained"
          value={events.reduce((sum, e) => sum + e.xpGained, 0)}
          trend={10}
        />
        <StatCard
          title="Most Active Time"
          value={getMostActiveTime(events)}
        />
        <StatCard
          title="Completion Rate"
          value={`${Math.round((events.length / dailyData.length) * 100)}%`}
        />
      </div>
    </div>
  );
}

function getMostActiveTime(events: TimelineEvent[]): string {
  const hourCounts = events.reduce((acc, event) => {
    const hour = new Date(event.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const mostActiveHour = Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  return mostActiveHour 
    ? format(new Date().setHours(Number(mostActiveHour)), 'ha')
    : 'N/A';
}

function StatCard({ title, value, trend }: {
  title: string;
  value: string | number;
  trend?: number;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {trend && (
        <div className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
} 