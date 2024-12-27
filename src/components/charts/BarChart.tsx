interface BarChartProps {
  data: { x: string; y: number }[];
}

export const BarChart = ({ data }: BarChartProps) => {
  return (
    <div className="bar-chart">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}; 