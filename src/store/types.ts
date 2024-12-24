import { User } from '../types/shared';
import { Quest } from '../types/quest';
import { Skill, Achievement } from '../types/progress';
import { Task, Habit } from '../types/timeManagement';
import { Region } from '../types/map';
import { EnergyLog, DailyStats } from '../types/resources';
import { JournalEntry } from '../types/documentation';

export interface AppState {
  user: User | null;
  quests: Quest[];
  skills: Skill[];
  achievements: Achievement[];
  tasks: Task[];
  habits: Habit[];
  regions: Region[];
  energyLogs: EnergyLog[];
  dailyStats: DailyStats[];
  journalEntries: JournalEntry[];
} 