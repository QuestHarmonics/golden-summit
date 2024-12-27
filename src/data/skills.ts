import { Skill } from '../types/progress';

export const initialSkills: Skill[] = [
  {
    id: 'physical',
    name: 'Physical',
    level: 1,
    xp: 0,
    maxXp: 1000,
    baseXpRate: 5, // 5 XP per hour passively
    multiplier: 1
  },
  {
    id: 'mental',
    name: 'Mental',
    level: 1,
    xp: 0,
    maxXp: 1000,
    baseXpRate: 5,
    multiplier: 1
  },
  // ... other skills
];

export function initializeSkills(): Skill[] {
  return initialSkills.map(skill => ({
    ...skill,
    lastUpdate: new Date()
  }));
} 