import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useAuthStore } from '../store/authStore';

export const useAuthStateListener = () => {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          lastLoginAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString()
        };
        useAuthStore.setState({ user, isLoading: false });
      } else {
        // User is signed out
        useAuthStore.setState({ user: null, isLoading: false });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}; 