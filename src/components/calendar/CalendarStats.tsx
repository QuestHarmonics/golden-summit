import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { format } from 'date-fns';

interface CalendarStatsProps {
  date: Date;
}

export function CalendarStats({ date }: CalendarStatsProps) {
  const { getDailyXPBreakdown } = useTimelineStore();
  const stats = getDailyXPBreakdown(date);

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-white border-b">
      <StatCard
        title="Total XP"
        value={stats.total}
        suffix="XP"
        trend={10} // Calculate trend
      />
      <StatCard
        title="Activities"
        value={stats.topActivities.length}
        suffix="completed"
      />
      <StatCard
        title="Top Source"
        value={Object.entries(stats.bySource)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
      />
      <StatCard
        title="Efficiency"
        value={Math.round((stats.total / (stats.topActivities.length || 1)) * 10) / 10}
        suffix="XP/activity"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  trend?: number;
}

function StatCard({ title, value, suffix, trend }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 flex items-baseline">
        <div className="text-2xl font-semibold">{value}</div>
        {suffix && (
          <div className="ml-1 text-sm text-gray-500">{suffix}</div>
        )}
      </div>
      {trend && (
        <div className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
} 