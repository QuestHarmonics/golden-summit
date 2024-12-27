export type MetricCategory = 
  | 'creativity'    // Music, art, writing
  | 'productivity'  // Work, projects
  | 'wellness'      // Health, meditation
  | 'learning'      // Studies, skills
  | 'homestead'     // Ranch, garden
  | 'social'        // Family, co-op
  | 'maintenance';  // Daily tasks

export interface MetricEntry {
  id: string;
  category: MetricCategory;
  timestamp: Date;
  value: number;
  notes?: string;
  mood?: number;
  energy?: number;
  tags?: string[];
}

export interface DailyLog {
  date: Date;
  metrics: MetricEntry[];
  summary: {
    totalXP: number;
    questsCompleted: number;
    skillsProgressed: string[];
    achievements: string[];
  };
  reflection?: {
    highlights: string[];
    challenges: string[];
    insights: string[];
    nextSteps: string[];
  };
} 