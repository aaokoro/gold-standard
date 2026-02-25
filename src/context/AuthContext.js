import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

const AGGIE_SUFFIX = '@aggies.ncat.edu';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(
          firebaseUser
            ? { email: firebaseUser.email, uid: firebaseUser.uid }
            : null
        );
        setLoading(false);
      });
    } catch (e) {
      console.error('Auth init', e);
      setLoading(false);
    }
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isFirebaseConfigured()) {
      const trimmed = (email || '').trim().toLowerCase();
      if (!trimmed.endsWith(AGGIE_SUFFIX)) return { error: 'Use your @aggies.ncat.edu email.' };
      setUser({ email: trimmed, uid: 'demo' });
      return { error: null };
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { error: null };
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        return { error: 'No account found. Create one with the same email and password.' };
      }
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        return { error: 'Wrong password.' };
      }
      return { error: e.message || 'Sign in failed.' };
    }
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (!isFirebaseConfigured()) return signIn(email, password);
    try {
      await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { error: null };
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        return { error: 'This email is already registered. Sign in instead.' };
      }
      return { error: e.message || 'Sign up failed.' };
    }
  }, [signIn]);

  const signOut = useCallback(async () => {
    try {
      if (isFirebaseConfigured()) await firebaseSignOut(auth);
    } catch (e) {
      console.error('SignOut', e);
    }
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isDemoMode: !isFirebaseConfigured(),
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
