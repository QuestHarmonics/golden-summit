import { useBiometricsStore } from '../../store/biometricsStore';
import { BiometricCategory } from '../../types/biometrics';
import { MetricCard } from './MetricCard';
import { MetricChart } from './MetricChart';
import { MetricCorrelation } from './MetricCorrelation';

export function BiometricsDashboard() {
  const { 
    sleepMetrics,
    cognitiveMetrics,
    physicalMetrics,
    bloodMetrics,
    environmentalMetrics,
    nutritionMetrics,
    getReadingsByDateRange,
    getCorrelations
  } = useBiometricsStore();

  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentReadings = getReadingsByDateRange(lastWeek, new Date());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sleep Overview */}
        <MetricCard
          title="Sleep Quality"
          value={sleepMetrics[0]?.sleepScore || 0}
          maxValue={100}
          category="SLEEP"
          trend="up"
          change={5}
        />
        
        {/* HRV Trends */}
        <MetricCard
          title="HRV"
          value={physicalMetrics[0]?.hrv || 0}
          unit="ms"
          category="PHYSICAL"
          trend="neutral"
          change={0}
        />
        
        {/* Cognitive Performance */}
        <MetricCard
          title="Focus Score"
          value={cognitiveMetrics[0]?.focusDuration || 0}
          maxValue={100}
          category="COGNITION"
          trend="down"
          change={-2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Metrics Chart */}
        <MetricChart
          title="Sleep Stages"
          data={sleepMetrics.slice(-7)}
          metrics={[
            { key: 'deepSleep', label: 'Deep Sleep' },
            { key: 'remSleep', label: 'REM' },
            { key: 'lightSleep', label: 'Light Sleep' }
          ]}
          type="stacked-bar"
        />

        {/* HRV & Recovery */}
        <MetricChart
          title="Recovery Metrics"
          data={physicalMetrics.slice(-7)}
          metrics={[
            { key: 'hrv', label: 'HRV' },
            { key: 'recovery', label: 'Recovery Score' }
          ]}
          type="line"
        />
      </div>

      {/* Correlation Analysis */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Metric Correlations</h3>
        <MetricCorrelation
          metrics={[
            { id: 'sleep-hrv', label: 'Sleep & HRV', value: 0.75 },
            { id: 'sleep-focus', label: 'Sleep & Focus', value: 0.82 },
            { id: 'exercise-sleep', label: 'Exercise & Sleep', value: 0.68 }
          ]}
        />
      </div>
    </div>
  );
} 