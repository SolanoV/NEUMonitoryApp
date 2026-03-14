"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase login/logout events
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Check if the user already exists in our Firestore database
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // User exists, grab their role
          setRole(userSnap.data().role);
        } else {
          // First time logging in! Create their profile as a 'student'
          await setDoc(userRef, {
            email: firebaseUser.email,
            role: "student", // Default role
            isBlocked: false,
            createdAt: serverTimestamp()
          });
          setRole("student");
        }
      } else {
        // User logged out
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily use this context in any component
export const useAuth = () => useContext(AuthContext);