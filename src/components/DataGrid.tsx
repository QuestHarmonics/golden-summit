import { useGameStore } from '../store/gameStore';

export const DataGrid = () => {
  const { metrics = [] } = useGameStore();

  return (
    <div className="data-grid">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Value</th>
            <th>Mood</th>
            <th>Energy</th>
            <th>XP</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => (
            <tr key={metric.id}>
              <td>{metric.timestamp.toLocaleDateString()}</td>
              <td>{metric.category}</td>
              <td>{metric.value}</td>
              <td>{metric.mood || '-'}</td>
              <td>{metric.energy || '-'}</td>
              <td>{calculateXP(metric)}</td>
              <td>{metric.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function calculateXP(metric: { value: number; mood?: number; energy?: number }): number {
  const baseXP = metric.value * 10;
  const bonusXP = (metric.mood || 5) + (metric.energy || 5);
  return Math.round(baseXP + bonusXP);
} 