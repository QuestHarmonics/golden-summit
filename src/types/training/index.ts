export interface Training {
  type: 'strength' | 'mobility' | 'cardio' | 'skills';
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    rpe?: number;
    notes?: string;
  }[];
  energy: 1 | 2 | 3 | 4 | 5;
  recovery: 1 | 2 | 3 | 4 | 5;
  notes: string;
}

export interface TrainingStore {
  sessions: Training[];
  addSession: (session: Training) => void;
  getStats: (period: 'week' | 'month') => any;
} 