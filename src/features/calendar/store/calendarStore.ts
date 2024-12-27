import { create } from 'zustand';
import { auth, db } from '../../../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { CalendarEvent, RecurrenceType } from '../types/Calendar';

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

interface CalendarActions {
  fetchEvents: (familyId: string) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCalendarStore = create<CalendarState & CalendarActions>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (familyId: string) => {
    set({ loading: true, error: null });
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, where('familyId', '==', familyId));
      const querySnapshot = await getDocs(q);
      
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CalendarEvent[];

      set({ events, loading: false });
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false
      });
    }
  },

  createEvent: async (event) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      set({ error: 'User not authenticated' });
      return;
    }

    set({ loading: true, error: null });
    try {
      const eventsRef = collection(db, 'events');
      await addDoc(eventsRef, {
        ...event,
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Refresh events
      if (event.familyId) {
        await get().fetchEvents(event.familyId);
      }
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false
      });
    }
  },

  updateEvent: async (eventId, updates) => {
    set({ loading: true, error: null });
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update local state
      set(state => ({
        events: state.events.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        ),
        loading: false
      }));
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false
      });
    }
  },

  deleteEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);

      // Update local state
      set(state => ({
        events: state.events.filter(event => event.id !== eventId),
        loading: false
      }));
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false
      });
    }
  },

  setError: (error: string | null) => set({ error })
})); 