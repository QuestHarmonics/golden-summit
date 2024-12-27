import { BiometricCategory } from '../../types/biometrics';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/react/solid';

interface MetricCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  category: BiometricCategory;
  trend: 'up' | 'down' | 'neutral';
  change: number;
}

export function MetricCard({
  title,
  value,
  maxValue = 100,
  unit,
  category,
  trend,
  change
}: MetricCardProps) {
  const percentage = maxValue ? (value / maxValue) * 100 : value;
  
  const trendColor = trend === 'up' 
    ? 'text-green-500' 
    : trend === 'down' 
    ? 'text-red-500' 
    : 'text-gray-500';

  const TrendIcon = trend === 'up' 
    ? TrendingUpIcon 
    : trend === 'down' 
    ? TrendingDownIcon 
    : MinusIcon;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">
              {value}
              {unit && <span className="text-sm ml-1">{unit}</span>}
            </p>
            {maxValue && (
              <p className="text-sm text-gray-500 ml-2">/ {maxValue}</p>
            )}
          </div>
        </div>
        <div className={`${trendColor} flex items-center`}>
          <TrendIcon className="w-5 h-5" />
          <span className="text-sm ml-1">
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 