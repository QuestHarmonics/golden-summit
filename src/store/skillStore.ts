import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skill, SubSkill } from '../types/skills';
import { LifePath } from '../types/core';
import { generateSkillXpRequirement } from '../utils/progressCalculations';

interface SkillStore {
  skills: Skill[];
  
  // Skill Management
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  gainExperience: (skillId: string, amount: number) => void;
  unlockSubskill: (skillId: string, subskillId: string) => void;
  
  // Queries
  getSkill: (id: string) => Skill | undefined;
  getSkillProgress: (id: string) => {
    level: number;
    experience: number;
    nextLevelXp: number;
  };
  getPathProgress: (path: LifePath) => {
    level: number;
    totalXp: number;
    skills: number;
  };
}

export const useSkillStore = create<SkillStore>()(
  persist(
    (set, get) => ({
      skills: [],

      addSkill: (skillData) => {
        const skill: Skill = {
          id: `skill-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          level: 1,
          experience: 0,
          nextLevelXp: generateSkillXpRequirement(1),
          subskills: [],
          ...skillData
        };

        set(state => ({
          skills: [...state.skills, skill]
        }));
      },

      gainExperience: (skillId, amount) => {
        set(state => {
          const skills = [...state.skills];
          const skillIndex = skills.findIndex(s => s.id === skillId);
          if (skillIndex === -1) return state;

          const skill = skills[skillIndex];
          let { experience, level, nextLevelXp } = skill;
          experience += amount;

          // Level up if enough XP
          while (experience >= nextLevelXp) {
            level++;
            experience -= nextLevelXp;
            nextLevelXp = generateSkillXpRequirement(level);
          }

          skills[skillIndex] = {
            ...skill,
            level,
            experience,
            nextLevelXp,
            updatedAt: new Date()
          };

          return { skills };
        });
      },

      unlockSubskill: (skillId, subskillId) => {
        set(state => {
          const skills = [...state.skills];
          const skillIndex = skills.findIndex(s => s.id === skillId);
          if (skillIndex === -1) return state;

          const skill = skills[skillIndex];
          const subskill = skill.subskills.find(s => s.id === subskillId);
          if (!subskill) return state;

          skill.subskills = skill.subskills.map(s => 
            s.id === subskillId 
              ? { ...s, level: 1, updatedAt: new Date() }
              : s
          );

          skills[skillIndex] = {
            ...skill,
            updatedAt: new Date()
          };

          return { skills };
        });
      },

      getSkill: (id) => {
        return get().skills.find(s => s.id === id);
      },

      getSkillProgress: (id) => {
        const skill = get().getSkill(id);
        if (!skill) return { level: 0, experience: 0, nextLevelXp: 100 };
        return {
          level: skill.level,
          experience: skill.experience,
          nextLevelXp: skill.nextLevelXp
        };
      },

      getPathProgress: (path) => {
        const pathSkills = get().skills.filter(s => s.path === path);
        return {
          level: Math.floor(pathSkills.reduce((sum, s) => sum + s.level, 0) / pathSkills.length),
          totalXp: pathSkills.reduce((sum, s) => sum + s.experience + (s.level - 1) * s.nextLevelXp, 0),
          skills: pathSkills.length
        };
      }
    }),
    {
      name: 'skill-storage'
    }
  )
); 