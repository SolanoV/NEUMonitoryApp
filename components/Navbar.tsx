// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "./ThemeToggle"; 

export default function Navbar() {
  const { user, role, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-neu-primary dark:bg-gray-900 text-neu-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / App Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider">
              NEU MOA Portal
            </Link>
          </div>

          {/* Smart Navigation Links */}
          {!loading && user && (
            <div className="hidden md:flex space-x-8">
              {role === "student" && (
                <Link href="/student" className="hover:text-neu-accent transition">Student Dashboard</Link>
              )}
              {role === "faculty" && (
                <Link href="/faculty" className="hover:text-neu-accent transition">Faculty Dashboard</Link>
              )}
              {role === "admin" && (
                <Link href="/admin" className="hover:text-neu-accent transition">Admin Dashboard</Link>
              )}
            </div>
          )}

          {/* Smart User Actions */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <span className="text-sm text-neu-light animate-pulse">Loading...</span>
            ) : user ? (
              <div className="flex items-center gap-4">
                
                {/* 1. Added the Name above the Email */}
                <div className="hidden sm:flex flex-col text-right mr-2">
                  <span className="text-sm font-bold leading-tight">
                    {/* Access Google display name from Supabase metadata */}
                    {user.user_metadata?.full_name || "NEU User"}
                  </span>
                  <span className="text-xs opacity-80">
                    {user.email}
                  </span>
                </div>

                {/* 2. Inserted the Theme Toggle */}
                <ThemeToggle />

                <button 
                  onClick={handleLogout}
                  className="bg-transparent border border-neu-light text-neu-white px-4 py-1.5 rounded-md font-medium hover:bg-neu-light hover:text-neu-primary transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-neu-white text-neu-primary px-4 py-2 rounded-md font-semibold hover:bg-neu-light hover:text-neu-black transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}