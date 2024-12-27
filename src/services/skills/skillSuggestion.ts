import { interests } from '../../data/interests';
import { defaultSkills } from '../../data/skills';
import type { CustomSkill } from '../../types/user/preferences';

export interface SkillSuggestion {
  skill: string;
  relevance: number;
  description: string;
  benefits: string[];
  relatedInterests: string[];
}

export function generateSkillSuggestions(
  aboutMe: string,
  selectedInterests: string[]
): SkillSuggestion[] {
  const suggestions: SkillSuggestion[] = [];
  
  // Map interests to related skills
  selectedInterests.forEach(interest => {
    const relatedSkills = interests[interest]?.relatedSkills || [];
    relatedSkills.forEach(skill => {
      const existingSuggestion = suggestions.find(s => s.skill === skill);
      if (existingSuggestion) {
        existingSuggestion.relevance += 1;
      } else {
        suggestions.push({
          skill,
          relevance: 1,
          description: defaultSkills[skill]?.description || '',
          benefits: defaultSkills[skill]?.benefits || [],
          relatedInterests: [interest]
        });
      }
    });
  });

  // Sort by relevance
  return suggestions.sort((a, b) => b.relevance - a.relevance);
} 