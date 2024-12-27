interface DocumentationSystem {
  journals: {
    daily: JournalEntry[];
    project: ProjectLog[];
    skill: SkillLog[];
  };
  media: {
    photos: MediaAsset[];
    videos: MediaAsset[];
    audio: MediaAsset[];
  };
  progress: {
    milestones: Milestone[];
    achievements: Achievement[];
    statistics: Statistics;
  };
} 