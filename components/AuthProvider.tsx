"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for the login state changes directly from Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        
        // --- SECURITY CHECK ---
        // NOTE: If you are currently testing with a personal Gmail, temporarily 
        // change "@neu.edu.ph" to "@gmail.com" below so it lets you in!
        if (!firebaseUser.email?.endsWith("@neu.edu.ph")) {
          console.error("Access Denied: Not an institutional email.");
          await signOut(auth); // Kick them out quietly
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        // Email is valid, lock the user in state
        setUser(firebaseUser);
        
        try {
          // Check if the user already exists in our Firestore database
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // Returning user: Grab their assigned role
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
        } catch (dbError) {
          console.error("Error fetching user data from Firestore:", dbError);
        }

      } else {
        // User is logged out
        setUser(null);
        setRole(null);
      }
      
      // Stop the loading spinner
      setLoading(false);
    });

    // Cleanup the listener when the app closes
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to make it easy to grab auth data anywhere in the app
export const useAuth = () => useContext(AuthContext);