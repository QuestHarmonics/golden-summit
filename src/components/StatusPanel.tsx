import { useGameStore } from '../store/gameStore';
import { StatusBar } from './ui/GameUI';
import { PassiveXPDisplay } from './PassiveXPDisplay';

export const StatusPanel = () => {
  const { 
    xp, 
    level, 
    health, 
    maxHealth, 
    coins, 
    dailyStreak 
  } = useGameStore();

  return (
    <div className="status-panel pixel-border">
      <div className="status-row">
        <h3>Level {level}</h3>
        <StatusBar 
          current={xp} 
          max={100 * Math.pow(1.1, level)} 
          type="xp" 
        />
      </div>

      <div className="status-row">
        <h3>Health</h3>
        <StatusBar 
          current={health} 
          max={maxHealth} 
          type="health" 
        />
      </div>

      <div className="status-info">
        <div className="coins">
          <span className="icon">🪙</span>
          <span className="value">{coins}</span>
        </div>
        <div className="streak">
          <span className="icon">🔥</span>
          <span className="value">{dailyStreak} days</span>
        </div>
      </div>
      <PassiveXPDisplay />
    </div>
  );
}; 