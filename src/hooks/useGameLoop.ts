import { useEffect, useRef, useCallback } from 'react';

interface GameLoopProps {
  onTick?: (deltaTime: number) => void;
  fps?: number;
  enabled?: boolean;
}

export const useGameLoop = ({ 
  onTick = () => {}, 
  fps = 60, 
  enabled = true 
}: GameLoopProps = {}) => {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const isRunning = useRef(enabled);

  const tick = useCallback((timestamp: number) => {
    if (!isRunning.current) return;

    if (lastTimeRef.current === undefined) {
      lastTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    if (deltaTime >= (1000 / fps)) {
      onTick(deltaTime);
      lastTimeRef.current = timestamp;
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [fps, onTick]);

  useEffect(() => {
    isRunning.current = enabled;
    if (enabled) {
      frameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      isRunning.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, tick]);
}; 