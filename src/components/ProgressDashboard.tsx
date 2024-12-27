import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { MetricEntry, MetricCategory } from '../types/metrics';
import { LineChart, BarChart, RadarChart } from './charts/index';

export const ProgressDashboard = () => {
  const { metrics = [] } = useGameStore();

  // Calculate daily totals
  const dailyTotals = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      const date = metric.timestamp.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { xp: 0, entries: 0 };
      acc[date].xp += calculateXP(metric);
      acc[date].entries += 1;
      return acc;
    }, {} as Record<string, { xp: number; entries: number }>);
  }, [metrics]);

  // Calculate category distribution
  const categoryStats = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.category]) acc[metric.category] = 0;
      acc[metric.category] += metric.value;
      return acc;
    }, {} as Record<MetricCategory, number>);
  }, [metrics]);

  // Calculate mood and energy trends
  const wellnessData = useMemo(() => {
    return metrics.map(metric => ({
      date: metric.timestamp,
      mood: metric.mood || 5,
      energy: metric.energy || 5
    }));
  }, [metrics]);

  return (
    <div className="progress-dashboard">
      <h2>Progress Overview</h2>

      <div className="chart-grid">
        {/* XP Over Time */}
        <div className="chart-card">
          <h3>Daily XP</h3>
          <LineChart
            data={Object.entries(dailyTotals).map(([date, data]) => ({
              x: date,
              y: data.xp
            }))}
          />
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <h3>Focus Areas</h3>
          <BarChart
            data={Object.entries(categoryStats).map(([category, value]) => ({
              x: category,
              y: value
            }))}
          />
        </div>

        {/* Wellness Radar */}
        <div className="chart-card">
          <h3>Wellness Trends</h3>
          <RadarChart
            data={[
              {
                label: 'Current',
                values: {
                  mood: wellnessData[wellnessData.length - 1]?.mood || 5,
                  energy: wellnessData[wellnessData.length - 1]?.energy || 5
                }
              },
              {
                label: 'Average',
                values: {
                  mood: average(wellnessData.map(d => d.mood)),
                  energy: average(wellnessData.map(d => d.energy))
                }
              }
            ]}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul>
          {metrics.slice(-5).reverse().map(metric => (
            <li key={metric.id} className="activity-item">
              <span className="category">{metric.category}</span>
              <span className="value">+{metric.value}</span>
              <span className="xp">+{calculateXP(metric)} XP</span>
              {metric.notes && <p className="notes">{metric.notes}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helper functions
function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function calculateXP(metric: MetricEntry): number {
  const baseXP = metric.value * 10;
  const bonusXP = (metric.mood || 5) + (metric.energy || 5);
  return Math.round(baseXP + bonusXP);
} 