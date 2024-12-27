interface MountainPeak {
  id: string;
  name: string;
  height: number; // represents max level
  currentProgress: number;
  connectedPeaks: string[];
  skills: SkillNode[];
  quests: Quest[];
}

interface SkillNode {
  id: string;
  name: string;
  level: number;
  position: { x: number; y: number };
  connections: string[];
  requirements: Requirement[];
} 