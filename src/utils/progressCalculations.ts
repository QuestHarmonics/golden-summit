export function calculateTaskXP(quality: number, type: TaskType): number {
  const baseXP = {
    'daily': 50,
    'weekly': 200,
    'project': 500,
    'milestone': 1000
  }[type] || 50;

  // Quality multiplier (0.5 to 1.5)
  const qualityMultiplier = 0.5 + (quality / 100);
  
  return Math.round(baseXP * qualityMultiplier);
}

export function calculateNextMilestone(skill: Skill): Milestone {
  const currentLevel = skill.level;
  return MILESTONES.find(m => m.level > currentLevel) || MILESTONES[MILESTONES.length - 1];
}

export function generateSkillXpRequirement(level: number): number {
  // Base XP for level 1 is 100
  const baseXP = 100;
  
  // Each level requires 1.5x more XP than the previous
  const scalingFactor = 1.5;
  
  // Calculate required XP for this level
  return Math.round(baseXP * Math.pow(scalingFactor, level - 1));
}

export function calculateLevelProgress(currentXP: number, requiredXP: number): number {
  return Math.min(1, currentXP / requiredXP);
}

export function estimateTimeToLevel(
  currentXP: number, 
  requiredXP: number, 
  xpPerHour: number
): number {
  const remainingXP = requiredXP - currentXP;
  return remainingXP / xpPerHour;
}

export function calculateFarmingProgress(
  activities: AgricultureActivity[],
  weather: WeatherCondition,
  moonPhase: MoonPhase,
  skills: Record<string, number>
): number {
  let progressMultiplier = 1;

  // Check optimal conditions
  activities.forEach(activity => {
    if (activity.optimalConditions.weather.includes(weather)) {
      progressMultiplier *= 1.2;
    }
    if (activity.optimalConditions.moonPhase?.includes(moonPhase)) {
      progressMultiplier *= 1.15;
    }
  });

  // Apply skill bonuses
  Object.entries(skills).forEach(([skill, level]) => {
    progressMultiplier *= (1 + (level * 0.05));
  });

  return progressMultiplier;
}

export function calculateHarvestYield(
  crop: CropSystem,
  weather: WeatherCondition,
  skills: Record<string, number>,
  maintenance: Record<string, Date>
): Record<CostTier, number> {
  // Calculate base yield
  const baseYield = crop.harvest.yieldsPerPlant;
  
  // Apply modifiers based on weather, skills, and maintenance
  const weatherModifier = getWeatherModifier(weather, crop);
  const skillModifier = getSkillModifier(skills);
  const maintenanceModifier = getMaintenanceModifier(maintenance, crop);

  return {
    LOW: baseYield.LOW * weatherModifier * skillModifier * maintenanceModifier,
    MID: baseYield.MID * weatherModifier * skillModifier * maintenanceModifier,
    HIGH: baseYield.HIGH * weatherModifier * skillModifier * maintenanceModifier
  };
} 