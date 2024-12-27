import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendEmailVerification,
  Unsubscribe
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastActivity: number | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateLastActivity: () => Promise<void>;
  checkSessionTimeout: () => boolean;
  initialize: () => Unsubscribe;
  clearError: () => void;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  currentUser: null,
  loading: true,
  error: null,
  isInitialized: false,
  lastActivity: null,

  initialize: () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const lastActivity = userDoc.data()?.lastActivity || Date.now();
        set({
          currentUser: user,
          loading: false,
          isInitialized: true,
          lastActivity
        });
      } else {
        set({
          currentUser: null,
          loading: false,
          isInitialized: true,
          lastActivity: null
        });
      }
    });
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const now = Date.now();
      await setDoc(doc(db, 'users', userCredential.user.uid), { lastActivity: now }, { merge: true });
      set({
        currentUser: userCredential.user,
        loading: false,
        lastActivity: now
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in',
        loading: false
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      const now = Date.now();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        lastActivity: now,
        createdAt: now
      });
      set({
        currentUser: userCredential.user,
        loading: false,
        lastActivity: now
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create account',
        loading: false
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      set({
        currentUser: null,
        loading: false,
        lastActivity: null
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        loading: false
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send password reset email',
        loading: false
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const now = Date.now();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        lastActivity: now
      }, { merge: true });
      set({
        currentUser: userCredential.user,
        loading: false,
        lastActivity: now
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in with Google',
        loading: false
      });
      throw error;
    }
  },

  sendVerificationEmail: async () => {
    const { currentUser } = get();
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await sendEmailVerification(currentUser);
  },

  updateLastActivity: async () => {
    const { currentUser } = get();
    if (currentUser) {
      const now = Date.now();
      await setDoc(doc(db, 'users', currentUser.uid), { lastActivity: now }, { merge: true });
      set({ lastActivity: now });
    }
  },

  checkSessionTimeout: () => {
    const { lastActivity } = get();
    if (!lastActivity) return true;
    return Date.now() - lastActivity > SESSION_TIMEOUT;
  },

  clearError: () => set({ error: null })
})); 