import { create } from 'zustand';
import { generateResponse } from '../services/ai/openai';

interface AIStore {
  isLoading: boolean;
  generateQuest: (theme: string) => Promise<string>;
  getAdvice: (topic: string) => Promise<string>;
  analyzeProgress: () => Promise<string>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  isLoading: false,

  generateQuest: async (theme: string) => {
    set({ isLoading: true });
    try {
      const response = await generateResponse(
        `Generate a quest based on the theme: ${theme}`,
        { theme },
        'You are a quest master in a gamified life management app. Generate an engaging quest that is specific, measurable, and achievable.'
      );
      return response.content;
    } finally {
      set({ isLoading: false });
    }
  },

  getAdvice: async (topic: string) => {
    set({ isLoading: true });
    try {
      const response = await generateResponse(
        `Provide advice about: ${topic}`,
        { topic },
        'You are a wise advisor in a gamified life management app. Provide concise, actionable advice.'
      );
      return response.content;
    } finally {
      set({ isLoading: false });
    }
  },

  analyzeProgress: async () => {
    set({ isLoading: true });
    try {
      const response = await generateResponse(
        'Analyze the user\'s current progress and provide insights',
        {},
        'You are an analytics advisor in a gamified life management app. Analyze progress and provide actionable insights.'
      );
      return response.content;
    } finally {
      set({ isLoading: false });
    }
  }
})); 