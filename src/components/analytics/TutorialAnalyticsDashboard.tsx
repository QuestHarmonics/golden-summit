import React from 'react';
import { useAnalyticsStore } from '../../store/analyticsStore';
import { TutorialAnalytics } from '../../types/analytics';
import { CompletionRateChart } from './charts/CompletionRateChart';
import { TimePerStepChart } from './charts/TimePerStepChart';
import { EngagementMetrics } from './EngagementMetrics';

export function TutorialAnalyticsDashboard() {
  const currentSession = useAnalyticsStore(state => state.currentSession);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-pixel">Tutorial Analytics</h2>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Users"
          value="247"
          change={+12.5}
          period="Last 7 days"
        />
        <MetricCard
          title="Completion Rate"
          value="84%"
          change={+3.2}
          period="This month"
        />
        <MetricCard
          title="Avg. Completion Time"
          value="8m 32s"
          change={-1.5}
          period="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompletionRateChart />
        <TimePerStepChart />
      </div>

      {/* Detailed metrics */}
      <EngagementMetrics />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
}

function MetricCard({ title, value, change, period }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-gray-600 font-pixel text-sm mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-pixel">{value}</span>
        <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
      <p className="text-gray-500 text-xs mt-1">{period}</p>
    </div>
  );
} 