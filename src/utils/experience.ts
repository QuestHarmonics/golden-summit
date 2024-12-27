export function calculateExpForLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function calculateLevelFromExp(exp: number): number {
  return Math.floor(Math.sqrt(exp / 100));
}

export function calculateProgressToNextLevel(exp: number): number {
  const currentLevel = calculateLevelFromExp(exp);
  const currentLevelExp = calculateExpForLevel(currentLevel);
  const nextLevelExp = calculateExpForLevel(currentLevel + 1);
  
  return ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
} 