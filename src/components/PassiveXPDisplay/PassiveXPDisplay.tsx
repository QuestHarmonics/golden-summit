import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const PassiveXPDisplay = () => {
  const { addXP, level } = useGameStore();
  const [lastTick, setLastTick] = useState(Date.now());
  const [accumulatedXP, setAccumulatedXP] = useState(0);
  
  const xpPerSecond = (level * 0.5) / 60;
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const secondsPassed = (now - lastTick) / 1000;
      const newXP = accumulatedXP + (xpPerSecond * secondsPassed);
      
      if (newXP >= 1) {
        const xpToAdd = Math.floor(newXP);
        addXP(xpToAdd);
        setAccumulatedXP(newXP - xpToAdd);
      } else {
        setAccumulatedXP(newXP);
      }
      
      setLastTick(now);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [addXP, xpPerSecond, lastTick, accumulatedXP]);

  return (
    <div className="passive-xp">
      <h4>Passive XP</h4>
      <div className="rate">
        +{xpPerSecond.toFixed(2)} XP/sec
        <div className="accumulating">
          Accumulating: {accumulatedXP.toFixed(2)}
        </div>
      </div>
      <div className="info">Based on Level {level}</div>
    </div>
  );
}; 