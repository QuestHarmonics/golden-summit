import { create } from 'zustand';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Family, FamilyMember } from '../types/Family';

interface FamilyState {
  currentFamily: Family | null;
  loading: boolean;
  error: string | null;
}

interface FamilyActions {
  fetchFamily: (userId: string) => Promise<void>;
  createFamily: (name: string, createdBy: string) => Promise<void>;
  updateFamily: (familyId: string, updates: Partial<Family>) => Promise<void>;
  addMember: (familyId: string, member: Omit<FamilyMember, 'id'>) => Promise<void>;
  updateMember: (familyId: string, memberId: string, updates: Partial<FamilyMember>) => Promise<void>;
  removeMember: (familyId: string, memberId: string) => Promise<void>;
  clearError: () => void;
}

export const useFamilyStore = create<FamilyState & FamilyActions>((set, get) => ({
  currentFamily: null,
  loading: false,
  error: null,

  fetchFamily: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // First, try to find a family where the user is a member
      const familiesRef = collection(db, 'families');
      const q = query(
        familiesRef,
        where('members', 'array-contains', { userId })
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const familyDoc = querySnapshot.docs[0];
        set({
          currentFamily: { id: familyDoc.id, ...familyDoc.data() } as Family,
          loading: false
        });
      } else {
        set({
          currentFamily: null,
          loading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch family',
        loading: false
      });
    }
  },

  createFamily: async (name: string, createdBy: string) => {
    set({ loading: true, error: null });
    try {
      const newFamily: Omit<Family, 'id'> = {
        name,
        createdBy,
        createdAt: Timestamp.now(),
        level: 1,
        xp: 0,
        gold: 0,
        members: [{
          id: createdBy,
          name: 'Parent',
          role: 'parent',
          level: 1,
          xp: 0,
          userId: createdBy
        }]
      };

      const familyRef = doc(collection(db, 'families'));
      await setDoc(familyRef, newFamily);

      set({
        currentFamily: { id: familyRef.id, ...newFamily } as Family,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create family',
        loading: false
      });
    }
  },

  updateFamily: async (familyId: string, updates: Partial<Family>) => {
    set({ loading: true, error: null });
    try {
      const familyRef = doc(db, 'families', familyId);
      await updateDoc(familyRef, updates);

      const { currentFamily } = get();
      if (currentFamily) {
        set({
          currentFamily: { ...currentFamily, ...updates },
          loading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update family',
        loading: false
      });
    }
  },

  addMember: async (familyId: string, member: Omit<FamilyMember, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const { currentFamily } = get();
      if (!currentFamily) throw new Error('No family found');

      const newMember: FamilyMember = {
        ...member,
        id: member.userId
      };

      const updatedMembers = [...currentFamily.members, newMember];
      await get().updateFamily(familyId, { members: updatedMembers });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add member',
        loading: false
      });
    }
  },

  updateMember: async (familyId: string, memberId: string, updates: Partial<FamilyMember>) => {
    set({ loading: true, error: null });
    try {
      const { currentFamily } = get();
      if (!currentFamily) throw new Error('No family found');

      const updatedMembers = currentFamily.members.map(member =>
        member.id === memberId ? { ...member, ...updates } : member
      );

      await get().updateFamily(familyId, { members: updatedMembers });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update member',
        loading: false
      });
    }
  },

  removeMember: async (familyId: string, memberId: string) => {
    set({ loading: true, error: null });
    try {
      const { currentFamily } = get();
      if (!currentFamily) throw new Error('No family found');

      const updatedMembers = currentFamily.members.filter(member => member.id !== memberId);
      await get().updateFamily(familyId, { members: updatedMembers });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to remove member',
        loading: false
      });
    }
  },

  clearError: () => set({ error: null })
})); 