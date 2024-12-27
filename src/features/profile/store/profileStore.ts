import { create } from 'zustand';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { UserProfile } from '../types/Profile';

interface ProfileState {
  currentProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  updateXP: (userId: string, xp: number) => Promise<void>;
  updateGold: (userId: string, gold: number) => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
  currentProfile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (profileDoc.exists()) {
        set({
          currentProfile: profileDoc.data() as UserProfile,
          loading: false
        });
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: UserProfile = {
          userId,
          displayName: '',
          bio: '',
          avatarUrl: '',
          level: 1,
          xp: 0,
          gold: 0,
          stats: {
            questsCompleted: 0,
            questsFailed: 0,
            totalXPEarned: 0,
            totalGoldEarned: 0,
            activeDays: 0,
            currentStreak: 0,
            longestStreak: 0
          },
          achievements: [],
          settings: {
            theme: 'light',
            notifications: true,
            sound: true
          },
          preferences: {
            questDifficulty: 'all',
            questTypes: ['personal', 'family'],
            dailyGoal: 3
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };

        await setDoc(doc(db, 'profiles', userId), defaultProfile);
        set({
          currentProfile: defaultProfile,
          loading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch profile',
        loading: false
      });
    }
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    set({ loading: true, error: null });
    try {
      const profileRef = doc(db, 'profiles', userId);
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      // Update local state
      const { currentProfile } = get();
      if (currentProfile) {
        set({
          currentProfile: {
            ...currentProfile,
            ...updates,
            updatedAt: Timestamp.now()
          },
          loading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update profile',
        loading: false
      });
    }
  },

  updateXP: async (userId: string, xp: number) => {
    const { currentProfile } = get();
    if (!currentProfile) return;

    const newXP = currentProfile.xp + xp;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await get().updateProfile(userId, {
      xp: newXP,
      level: newLevel,
      stats: {
        ...currentProfile.stats,
        totalXPEarned: currentProfile.stats.totalXPEarned + xp
      }
    });
  },

  updateGold: async (userId: string, gold: number) => {
    const { currentProfile } = get();
    if (!currentProfile) return;

    await get().updateProfile(userId, {
      gold: currentProfile.gold + gold,
      stats: {
        ...currentProfile.stats,
        totalGoldEarned: currentProfile.stats.totalGoldEarned + gold
      }
    });
  },

  clearError: () => set({ error: null })
})); 