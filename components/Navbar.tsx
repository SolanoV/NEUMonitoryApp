// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "./ThemeToggle"; 
import UserProfileModal, { UserProfileData } from "./UserProfileModal"; // <-- Import the new modal

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // <-- New State

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Convert current Google Auth user into the format the Modal expects
  const currentUserProfileData: UserProfileData | null = user ? {
    id: user.id,
    email: user.email || "",
    role: role || "student",
    is_blocked: false, // You wouldn't be logged in if you were blocked!
    created_at: user.created_at,
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
  } : null;

  return (
    <>
      <nav className="bg-neu-primary dark:bg-gray-900 text-neu-white shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo / App Name */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="relative w-10 h-10 drop-shadow-[0_0_6px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_0_10px_theme(colors.neu.primary)] transition-all">
                  <Image src="/logo.svg" alt="NEU Logo" fill className="object-contain" priority />
                </div>
                <span className="text-xl font-bold tracking-wider hidden sm:block">NEU MOA Portal</span>
              </Link>
            </div>

            {/* Smart User Actions */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <span className="text-sm text-neu-light animate-pulse">Loading...</span>
              ) : user ? (
                <div className="flex items-center gap-4">
                  
                  {/* Dashboard & Profiles Buttons */}
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <Link href={`/${role}`} className="bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 border border-white/20 dark:border-gray-600 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
                      Dashboard
                    </Link>
                    {role === "admin" && (
                      <Link href="/profiles" className="bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 border border-white/20 dark:border-gray-600 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-sm">
                        User Profiles
                      </Link>
                    )}
                  </div>

                  <ThemeToggle />

                  {/* User Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 hover:bg-white/10 dark:hover:bg-gray-800 py-1.5 px-2 rounded-md transition-colors border border-transparent hover:border-white/20 dark:hover:border-gray-700 focus:outline-none"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-white/50 flex-shrink-0">
                        {user.user_metadata?.avatar_url ? (
                          <Image src={user.user_metadata.avatar_url} alt="User Avatar" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neu-primary dark:text-white font-bold text-sm">
                            {user.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="hidden md:flex flex-col text-left">
                        <span className="text-sm font-bold leading-tight">{user.user_metadata?.full_name || "NEU User"}</span>
                        <span className="text-xs opacity-80">{user.email}</span>
                      </div>

                      <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl py-1 border border-gray-200 dark:border-gray-700 z-50">
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setIsProfileModalOpen(true); // <-- Open the overlay instead of routing
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            Profile
                          </button>
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false);
                              handleLogout();
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  <Link href="/login" className="bg-neu-white text-neu-primary px-4 py-2 rounded-md font-semibold hover:bg-neu-light hover:text-neu-black transition">Login</Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Render the Modal attached to the Navbar */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentUserProfileData}
        currentUserId={user?.id || ""}
        currentUserRole={role}
        // Notice we DO NOT pass onUpdateRole or onToggleBlock here, 
        // so the admin controls won't render when viewing their own profile!
      />
    </>
  );
}