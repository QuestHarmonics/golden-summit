import { create } from 'zustand';
import { Entity } from '../../types/core';

export interface StoreState<T extends Entity> {
  items: T[];
  isLoading: boolean;
  error: string | null;
}

export interface StoreMethods<T extends Entity> {
  add: (item: Omit<T, keyof Entity>) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  setError: (error: string | null) => void;
}

export type BaseStore<T extends Entity> = StoreState<T> & StoreMethods<T>;

export const createBaseStore = <T extends Entity>(storeName: string) => {
  return create<BaseStore<T>>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,

    add: (item) => {
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      } as T;

      set(state => ({
        items: [...state.items, newItem]
      }));
    },

    update: (id, updates) => {
      set(state => ({
        items: state.items.map(item =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date() }
            : item
        )
      }));
    },

    remove: (id) => {
      set(state => ({
        items: state.items.filter(item => item.id !== id)
      }));
    },

    setError: (error) => set({ error })
  }));
}; 