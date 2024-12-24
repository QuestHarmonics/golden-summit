import { User } from '../types/shared';
import { Quest, QuestProgress } from '../types/quest';
import { Skill, Achievement } from '../types/progress';
import { Task, Habit } from '../types/timeManagement';
import { Location, MapMarker } from '../types/map';
import { Resource, DailyStat } from '../types/resources';
import { JournalEntry } from '../types/documentation';

export interface Store {
  user: User | null;
  quests: Quest[];
  questProgress: QuestProgress[];
  skills: Skill[];
  achievements: Achievement[];
  tasks: Task[];
  habits: Habit[];
  locations: Location[];
  mapMarkers: MapMarker[];
  resources: Resource[];
  dailyStats: DailyStat[];
  journalEntries: JournalEntry[];
}

export type GameCategory = 
  | 'QUEST' 
  | 'TASK' 
  | 'SKILL' 
  | 'ACHIEVEMENT' 
  | 'HOMESTEAD' 
  | 'NUTRITION';

export type ProgressCategory = 
  | 'PHYSICAL'
  | 'MENTAL'
  | 'SOCIAL'
  | 'HOMESTEAD'
  | 'NUTRITION';

export interface GameProgress {
  level: number;
  xp: number;
  xpRequired: number;
}

export interface ResourceProgress {
  current: number;
  max: number;
  regeneration: number;
} 