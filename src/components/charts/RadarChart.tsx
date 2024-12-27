interface RadarChartProps {
  data: {
    label: string;
    values: Record<string, number>;
  }[];
}

export const RadarChart = ({ data }: RadarChartProps) => {
  return (
    <div className="radar-chart">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}; 