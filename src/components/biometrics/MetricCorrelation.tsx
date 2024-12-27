interface MetricCorrelationProps {
  metrics: Array<{
    id: string;
    label: string;
    value: number; // correlation coefficient (-1 to 1)
  }>;
}

export function MetricCorrelation({ metrics }: MetricCorrelationProps) {
  const getCorrelationColor = (value: number) => {
    const strength = Math.abs(value);
    if (strength > 0.7) return 'bg-green-500';
    if (strength > 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {metric.label}
              </div>
              <div className="mt-1 flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getCorrelationColor(metric.value)} h-2 rounded-full`}
                    style={{
                      width: `${Math.abs(metric.value) * 100}%`,
                      marginLeft: metric.value < 0 ? 'auto' : undefined
                    }}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-500">
                  {(metric.value >= 0 ? '+' : '') + metric.value.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 