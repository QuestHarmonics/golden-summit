interface GeometricPattern {
  baseShape: 'circle' | 'triangle' | 'square' | 'hexagon';
  complexity: number; // increases with progress
  connections: Connection[];
  animations: AnimationConfig[];
  progressTriggers: ProgressTrigger[];
} 