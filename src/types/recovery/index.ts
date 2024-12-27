export interface RecoveryActivity {
  type: 'sauna' | 'coldPlunge' | 'meditation' | 'breathwork';
  duration: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  notes: string;
  benefits: string[];
}

export interface RecoveryStore {
  activities: RecoveryActivity[];
  addActivity: (activity: RecoveryActivity) => void;
  getStats: () => any;
} 