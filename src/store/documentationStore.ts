import { create } from 'zustand';
import { JournalEntry } from '../types/documentation';

interface DocumentationStore {
  journalEntries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
}

export const useDocumentationStore = create<DocumentationStore>((set) => ({
  journalEntries: [],
  addEntry: (entry) =>
    set((state) => ({
      journalEntries: [...state.journalEntries, entry]
    })),
  updateEntry: (id, entry) =>
    set((state) => ({
      journalEntries: state.journalEntries.map((e) =>
        e.id === id ? { ...e, ...entry } : e
      )
    })),
  deleteEntry: (id) =>
    set((state) => ({
      journalEntries: state.journalEntries.filter((e) => e.id !== id)
    }))
})); 