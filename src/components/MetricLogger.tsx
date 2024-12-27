import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { MetricCategory, MetricEntry } from '../types/metrics';

export const MetricLogger = () => {
  const { addMetric, addXP } = useGameStore();
  const [entry, setEntry] = useState<Partial<MetricEntry>>({
    category: 'creativity',
    value: 0,
    mood: 5,
    energy: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: MetricEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...entry,
      category: entry.category as MetricCategory,
      value: entry.value || 0
    };

    // Add to store and grant XP
    addMetric(newEntry);
    addXP(calculateXP(newEntry));
  };

  return (
    <form onSubmit={handleSubmit} className="metric-logger">
      <h3>Log Progress</h3>
      
      <select
        value={entry.category}
        onChange={e => setEntry({ ...entry, category: e.target.value as MetricCategory })}
      >
        <option value="creativity">Creative Work</option>
        <option value="productivity">Projects</option>
        <option value="wellness">Health & Wellness</option>
        <option value="learning">Learning</option>
        <option value="homestead">Homestead</option>
        <option value="social">Social/Community</option>
        <option value="maintenance">Daily Tasks</option>
      </select>

      <div className="input-group">
        <label>
          Value
          <input
            type="number"
            value={entry.value}
            onChange={e => setEntry({ ...entry, value: Number(e.target.value) })}
            min="0"
            step="0.5"
          />
        </label>
      </div>

      <div className="slider-group">
        <label>
          Mood
          <input
            type="range"
            value={entry.mood}
            onChange={e => setEntry({ ...entry, mood: Number(e.target.value) })}
            min="1"
            max="10"
          />
        </label>
        <label>
          Energy
          <input
            type="range"
            value={entry.energy}
            onChange={e => setEntry({ ...entry, energy: Number(e.target.value) })}
            min="1"
            max="10"
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Notes
          <textarea
            value={entry.notes}
            onChange={e => setEntry({ ...entry, notes: e.target.value })}
            placeholder="What did you accomplish?"
          />
        </label>
      </div>

      <button type="submit">Log Progress</button>
    </form>
  );
};

function calculateXP(entry: MetricEntry): number {
  const baseXP = entry.value * 10;
  const bonusXP = (entry.mood || 5) + (entry.energy || 5);
  return Math.round(baseXP + bonusXP);
} 