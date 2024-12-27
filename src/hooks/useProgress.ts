import { useCallback } from 'react';
import { Progressive } from '../types/core';
import { useToast } from './useToast';

export function useProgress() {
  const toast = useToast();

  const calculateLevel = useCallback((xp: number, baseXp: number = 1000): number => {
    return Math.floor(Math.log2(xp / baseXp + 1)) + 1;
  }, []);

  const calculateXpForLevel = useCallback((level: number, baseXp: number = 1000): number => {
    return baseXp * (Math.pow(2, level - 1) - 1);
  }, []);

  const addXp = useCallback((
    current: Progressive,
    xpGain: number,
    onLevelUp?: (newLevel: number) => void
  ): Progressive => {
    const newXp = current.xp + (xpGain * current.multiplier);
    const newLevel = calculateLevel(newXp);
    
    if (newLevel > current.level) {
      toast({
        title: 'Level Up!',
        description: `Congratulations! You've reached level ${newLevel}!`,
        variant: 'success'
      });
      onLevelUp?.(newLevel);
    }

    return {
      ...current,
      xp: newXp,
      level: newLevel,
      maxXp: calculateXpForLevel(newLevel + 1)
    };
  }, [calculateLevel, calculateXpForLevel, toast]);

  return {
    calculateLevel,
    calculateXpForLevel,
    addXp
  };
} 