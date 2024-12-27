import { TaskCategory } from '../tasks';

export type MentorshipType = 
  | 'guidance'    // General advice
  | 'technical'   // Specific how-to
  | 'planning'    // Project planning
  | 'diagnostic'  // Problem solving
  | 'review';     // Review work done

interface MentorshipSession {
  id: string;
  type: MentorshipType;
  taskId: string;
  xpCost: number;
  tokensUsed: number;
  conversation: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  outcomes: {
    insights: string[];
    nextSteps: string[];
    warnings: string[];
  };
}

export interface MentorshipConfig {
  baseXpCost: Record<MentorshipType, number>;
  tokenMultiplier: number; // XP cost per token
  dailyLimit: number;
  specializations: Record<TaskCategory, string[]>;
} 