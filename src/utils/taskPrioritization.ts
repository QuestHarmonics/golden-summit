import { RoadmapItem } from '../data/roadmap/projectRoadmap';

interface TaskPriority {
  item: RoadmapItem;
  score: number;
  reasons: string[];
}

export function prioritizeTasks(tasks: RoadmapItem[]): TaskPriority[] {
  return tasks.map(task => {
    let score = 0;
    const reasons: string[] = [];

    // Priority level base score
    score += (4 - task.priority) * 10;
    reasons.push(`Priority ${task.priority} task: ${(4 - task.priority) * 10} points`);

    // Dependencies impact
    if (task.dependencies.length === 0) {
      score += 15;
      reasons.push('No dependencies: +15 points');
    }

    // Time impact
    if (task.estimatedHours < 6) {
      score += 10;
      reasons.push('Quick win (< 6 hours): +10 points');
    }

    // Core system bonus
    if (task.id.includes('core') || task.id.includes('auth')) {
      score += 20;
      reasons.push('Core system: +20 points');
    }

    // User-facing feature bonus
    if (task.id.includes('ui') || task.id.includes('user')) {
      score += 15;
      reasons.push('User-facing feature: +15 points');
    }

    return {
      item: task,
      score,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
} 