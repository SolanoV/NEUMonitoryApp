// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  // Grab the user, their role, and the loading state from our Context
  const { user, role, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="bg-neu-primary text-neu-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / App Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider">
              NEU MOA Portal
            </Link>
          </div>

          {/* Smart Navigation Links (Only show when fully loaded and logged in) */}
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
              // Show a tiny loading text while Firebase figures out who is logged in
              <span className="text-sm text-neu-light animate-pulse">Loading...</span>
            ) : user ? (
              // If logged in, show their email and a Logout button
              <div className="flex items-center gap-4">
                <span className="text-sm hidden sm:block opacity-90">{user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-transparent border border-neu-light text-neu-white px-4 py-1.5 rounded-md font-medium hover:bg-neu-light hover:text-neu-primary transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              // If completely logged out, show the Login button
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