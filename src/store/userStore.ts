import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/core';
import { createBaseStore } from './core/createBaseStore';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  // ... other user state
} 