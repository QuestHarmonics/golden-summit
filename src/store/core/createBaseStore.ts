import { StateCreator } from 'zustand';
import { BaseState, BaseActions, BaseEntity } from '../../types/core/store';

export function createBaseStore<T extends BaseEntity>(
  set: StateCreator<BaseState<T> & BaseActions<T>>
): BaseState<T> & BaseActions<T> {
  return {
    items: {},
    archivedItems: {},
    loading: false,
    error: null,
    selectedId: null,
    showArchived: false,

    add: (item) => {
      const id = crypto.randomUUID();
      const now = new Date();
      set((state) => ({
        items: {
          ...state.items,
          [id]: {
            ...item,
            id,
            createdAt: now,
            updatedAt: now,
            isArchived: false
          } as T
        }
      }));
    },

    update: (id, updates) => {
      set((state) => {
        const items = state.items[id] ? state.items : state.archivedItems;
        return {
          [items === state.items ? 'items' : 'archivedItems']: {
            ...items,
            [id]: {
              ...items[id],
              ...updates,
              updatedAt: new Date()
            }
          }
        };
      });
    },

    remove: (id) => {
      set((state) => {
        const { [id]: removed, ...remainingItems } = state.items;
        const { [id]: removedArchived, ...remainingArchived } = state.archivedItems;
        return {
          items: remainingItems,
          archivedItems: remainingArchived
        };
      });
    },

    archive: (id) => {
      set((state) => {
        const item = state.items[id];
        if (!item) return state;

        const { [id]: removed, ...remainingItems } = state.items;
        return {
          items: remainingItems,
          archivedItems: {
            ...state.archivedItems,
            [id]: {
              ...item,
              isArchived: true,
              archivedAt: new Date(),
              updatedAt: new Date()
            }
          }
        };
      });
    },

    unarchive: (id) => {
      set((state) => {
        const item = state.archivedItems[id];
        if (!item) return state;

        const { [id]: removed, ...remainingArchived } = state.archivedItems;
        return {
          archivedItems: remainingArchived,
          items: {
            ...state.items,
            [id]: {
              ...item,
              isArchived: false,
              archivedAt: undefined,
              updatedAt: new Date()
            }
          }
        };
      });
    },

    toggleArchiveView: () => {
      set((state) => ({
        showArchived: !state.showArchived
      }));
    },

    select: (id) => {
      set({ selectedId: id });
    },

    setError: (error) => {
      set({ error });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    getActive: () => {
      const state = get();
      return Object.values(state.items);
    },

    getArchived: () => {
      const state = get();
      return Object.values(state.archivedItems);
    }
  };
} 