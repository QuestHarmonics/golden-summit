import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import { loginUser, registerUser } from '../services/auth/authService';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginUser(email, password);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await registerUser(email, password);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      logout: () => {
        set({ user: null });
      }
    }),
    {
      name: 'auth-store'
    }
  )
); 