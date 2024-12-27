import { useEffect, useState } from 'react';
import './XPParticle.css';

interface XPParticleProps {
  value: number;
  x: number;
  y: number;
}

export const XPParticle = ({ value, x, y }: XPParticleProps) => {
  const [position, setPosition] = useState({ x, y });
  
  useEffect(() => {
    const animation = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (Math.random() * 2 - 1),
        y: prev.y - 1
      }));
    }, 16);

    setTimeout(() => clearInterval(animation), 1000);
    
    return () => clearInterval(animation);
  }, []);

  return (
    <div 
      className="xp-particle"
      style={{ 
        left: position.x,
        top: position.y
      }}
    >
      +{value}XP
    </div>
  );
}; 