import { create } from 'zustand';
import { Skill, Achievement } from '../types/progress';

interface ProgressStore {
  skills: Skill[];
  achievements: Achievement[];
  addSkill: (skill: Skill) => void;
  updateSkillExperience: (skillId: string, experience: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

export const useProgressStore = create<ProgressStore>((set) => ({
  skills: [],
  achievements: [],
  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
  updateSkillExperience: (skillId, experience) =>
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === skillId ? { ...s, experience } : s
      ),
    })),
  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, isUnlocked: true, unlockedAt: new Date() }
          : a
      ),
    })),
})); 