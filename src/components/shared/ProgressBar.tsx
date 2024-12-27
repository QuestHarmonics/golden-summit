interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ 
  value, 
  max, 
  className = '', 
  color = 'blue' 
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className={`h-2 bg-gray-200 rounded ${className}`}>
      <div
        className={`h-2 bg-${color}-500 rounded transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
} 