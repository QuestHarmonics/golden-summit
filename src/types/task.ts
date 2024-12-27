export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  relatedSkills: string[];
  xpReward: number;
  tags: string[];
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  skills?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
} 