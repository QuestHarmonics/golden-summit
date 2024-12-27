interface LineChartProps {
  data: { x: string; y: number }[];
}

export const LineChart = ({ data }: LineChartProps) => {
  return (
    <div className="line-chart">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}; 