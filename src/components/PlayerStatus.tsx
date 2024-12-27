import { useGameStore } from '../store/gameStore';
import { XPBar } from '../components/ui/GameUI';

export function PlayerStatus() {
  const { xp, level, health, maxHealth, coins, dailyStreak } = useGameStore();
  
  return (
    <div className="player-status pixel-border">
      <div className="status-row">
        <span className="level">Lvl {level}</span>
        <XPBar current={xp} max={100 * Math.pow(1.1, level)} />
      </div>
      
      <div className="status-row">
        <span className="health">HP {health}/{maxHealth}</span>
        <div className="status-bar">
          <div 
            className="status-bar-fill health-bar"
            style={{ width: `${(health / maxHealth) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="status-info">
        <div className="coins">🪙 {coins}</div>
        <div className="streak">🔥 {dailyStreak} days</div>
      </div>
    </div>
  );
} 