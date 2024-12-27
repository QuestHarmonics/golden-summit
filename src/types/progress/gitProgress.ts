export interface GitProgress {
  commits: number;
  linesChanged: number;
  filesModified: number;
  contributionStreak: number;
  lastActiveDate: Date;
} 