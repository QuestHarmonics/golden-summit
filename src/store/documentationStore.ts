import { create } from 'zustand';
import { JournalEntry, Attachment } from '../types/documentation';

interface DocumentationStore {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => void;
  addAttachment: (entryId: string, attachment: Attachment) => void;
  removeAttachment: (entryId: string, attachmentId: string) => void;
}

export const useDocumentationStore = create<DocumentationStore>((set) => ({
  journalEntries: [],
  addJournalEntry: (entry) =>
    set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
  updateJournalEntry: (entryId, updates) =>
    set((state) => ({
      journalEntries: state.journalEntries.map((e) =>
        e.id === entryId ? { ...e, ...updates } : e
      ),
    })),
  addAttachment: (entryId, attachment) =>
    set((state) => ({
      journalEntries: state.journalEntries.map((e) =>
        e.id === entryId
          ? { ...e, attachments: [...e.attachments, attachment] }
          : e
      ),
    })),
  removeAttachment: (entryId, attachmentId) =>
    set((state) => ({
      journalEntries: state.journalEntries.map((e) =>
        e.id === entryId
          ? {
              ...e,
              attachments: e.attachments.filter((a) => a.id !== attachmentId),
            }
          : e
      ),
    })),
})); 