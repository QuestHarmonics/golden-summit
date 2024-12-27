export type NutritionSkillType = 
  | 'PRIMAL_DIGESTION'
  | 'RAW_MASTERY' 
  | 'ORGAN_MASTERY'
  | 'KETONE_ADAPTATION'
  | 'FASTING_MASTERY'
  | 'PROTEIN_SYNTHESIS'
  | 'FAT_ADAPTATION'
  | 'ANCESTRAL_WISDOM';

export interface NutritionSkill {
  id: NutritionSkillType;
  name: string;
  description: string;
  maxLevel: number;
  requirements: {
    level: number;
    prerequisites?: NutritionSkillType[];
    achievements?: string[];
  };
  bonuses: {
    [key: number]: SkillBonus[]; // Bonuses per level
  };
}

export interface SkillBonus {
  type: 'MULTIPLIER' | 'FLAT' | 'UNLOCK';
  target: 'XP' | 'FORCE' | 'RECOVERY' | 'ABILITY';
  value: number;
  description: string;
} 