// components/UserProfileModal.tsx
"use client";

import React from "react";
import Image from "next/image";

export interface UserProfileData {
  id: string;
  email: string;
  role: string;
  is_blocked: boolean;
  created_at: string;
  full_name?: string;
  avatar_url?: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData | null;
  currentUserId: string;
  currentUserRole: string | null;
  onUpdateRole?: (userId: string, newRole: string) => void;
  onToggleBlock?: (userId: string, currentStatus: boolean) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  currentUserId,
  currentUserRole,
  onUpdateRole,
  onToggleBlock
}: UserProfileModalProps) {
  if (!isOpen || !profile) return null;

  const isSelf = currentUserId === profile.id;
  const isAdmin = currentUserRole === "admin";
  const canManage = isAdmin && onUpdateRole && onToggleBlock;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* Header Background */}
        <div className="h-24 bg-gradient-to-r from-neu-primary to-neu-secondary relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/80 hover:text-white transition text-2xl font-bold leading-none">&times;</button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar pulled up with negative margin to fix the overlap */}
          <div className="-mt-12 mb-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center shadow-sm">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <span className="text-3xl font-bold text-gray-500 dark:text-gray-300">
                  {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center flex-wrap gap-2">
              {profile.full_name || "Unknown User"}
              {isSelf && <span className="text-xs align-middle bg-neu-light dark:bg-gray-700 text-neu-primary dark:text-gray-200 px-2 py-1 rounded-full border border-neu-primary/20">You</span>}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{profile.email}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Role</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase">{profile.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Joined</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</span>
              <span className={`text-sm font-bold ${profile.is_blocked ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                {profile.is_blocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>

          {/* Admin Controls Section */}
          {canManage && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Admin Controls</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Update Role</label>
                  <select 
                    value={profile.role}
                    onChange={(e) => onUpdateRole(profile.id, e.target.value)}
                    disabled={isSelf}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-md p-2 focus:ring-neu-primary outline-none disabled:opacity-50"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <button
                  onClick={() => onToggleBlock(profile.id, profile.is_blocked)}
                  disabled={isSelf}
                  className={`w-full py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50 ${
                    profile.is_blocked 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50" 
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                  }`}
                >
                  {profile.is_blocked ? "Unblock User Access" : "Block User Access"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}