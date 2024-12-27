import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const PassiveXPDisplay = () => {
  const { addXP, level } = useGameStore();
  const [lastTick, setLastTick] = useState(Date.now());
  const [accumulatedXP, setAccumulatedXP] = useState(0);
  
  // Calculate passive XP rate based on level
  const xpPerSecond = (level * 0.5) / 60; // Convert per minute to per second
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const secondsPassed = (now - lastTick) / 1000;
      const newXP = accumulatedXP + (xpPerSecond * secondsPassed);
      
      // Only add XP when we accumulate at least 1
      if (newXP >= 1) {
        const xpToAdd = Math.floor(newXP);
        addXP(xpToAdd);
        setAccumulatedXP(newXP - xpToAdd); // Keep the remainder
      } else {
        setAccumulatedXP(newXP);
      }
      
      setLastTick(now);
    }, 1000); // Update every second
    
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