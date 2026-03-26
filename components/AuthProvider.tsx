// components/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
    const handleUserSession = async (supabaseUser: User | null) => {
      if (supabaseUser) {
        
        // --- SECURITY CHECK ---
        if (!supabaseUser.email?.endsWith("@neu.edu.ph")) {
          console.error("Access Denied: Not an institutional email.");
          await supabase.auth.signOut();
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(supabaseUser);
        
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("role, is_blocked") // <-- Added is_blocked to the fetch
            .eq("id", supabaseUser.id)
            .single();

          if (userData) {
            // --- NEW: Check if they are blocked ---
            if (userData.is_blocked) {
              console.error("Access Denied: User account is blocked.");
              alert("Your account has been blocked by an administrator.");
              await supabase.auth.signOut();
              setUser(null);
              setRole(null);
              setLoading(false);
              return;
            }

            setRole(userData.role);
          } else {
            setRole("student");
          }
        } catch (dbError) {
          console.error("Error fetching user data from Supabase:", dbError);
          setRole("student");
        }

      } else {
        // User is logged out
        setUser(null);
        setRole(null);
      }
      
      setLoading(false);
    };

    // 1. Check the active session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user ?? null);
    });

    // 2. Listen for login/logout state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);