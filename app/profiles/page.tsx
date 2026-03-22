// app/profiles/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import UserProfileModal, { UserProfileData } from "@/components/UserProfileModal";

export default function ProfilesPage() {
  const { user: currentUser, role: currentUserRole } = useAuth();
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase.from("users").update({ is_blocked: !currentStatus }).eq("id", userId);
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u));
      if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, is_blocked: !currentStatus });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 transition-colors duration-300 max-w-6xl mx-auto py-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">User Profiles</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage system access, assign roles, and block unauthorized users.</p>
        </div>

        {loading ? (
          <div className="animate-pulse text-neu-primary font-semibold">Loading users...</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr 
                      key={u.id} 
                      onClick={() => setSelectedUser(u)}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          {u.avatar_url ? (
                            <Image src={u.avatar_url} alt="Avatar" fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                              {u.full_name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {u.full_name || "Unknown User"}
                            {u.id === currentUser?.id && <span className="ml-2 text-xs bg-neu-light text-neu-primary px-2 py-0.5 rounded-full">You</span>}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 uppercase font-semibold text-xs">{u.role}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.is_blocked ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}>
                          {u.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Reusable Modal */}
        <UserProfileModal 
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          profile={selectedUser}
          currentUserId={currentUser?.id || ""}
          currentUserRole={currentUserRole}
          onUpdateRole={handleRoleChange}
          onToggleBlock={toggleBlockStatus}
        />

      </div>
    </ProtectedRoute>
  );
}