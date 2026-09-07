"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  isConfigured,
  getAuthInstance,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@/lib/firebase";
import { AuthContext } from "@/hooks/useAuth";
import { ensureUserDoc } from "@/lib/firestore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    const auth = getAuthInstance();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await ensureUserDoc(u);
        } catch {
          // Keep auth UX working even if Firestore writes are restricted.
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getAuthInstance(), email, password);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
    await updateProfile(cred.user, { displayName: name });
    await ensureUserDoc(cred.user);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const cred = await signInWithPopup(getAuthInstance(), googleProvider);
    await ensureUserDoc(cred.user);
  }, []);

  const logout = useCallback(async () => {
    await signOut(getAuthInstance());
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
