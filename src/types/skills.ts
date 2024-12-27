export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  experience: number;
  maxExperience: number;
  category: string;
  icon?: string;
  prerequisites: string[];
  children: string[];
  unlocked: boolean;
  position?: {
    x: number;
    y: number;
  };
}

export interface SkillConnection {
  source: string;
  target: string;
}

export interface SkillTreeData {
  nodes: SkillNode[];
  connections: SkillConnection[];
} 