// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in at all? Send to login.
        router.push("/login");
      } else if (role && !allowedRoles.includes(role)) {
        // Logged in, but wrong role? Send them to their actual dashboard.
        router.push(`/${role}`);
      }
    }
  }, [user, role, loading, router, allowedRoles]);

  // Show a loading screen while checking credentials
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-neu-primary font-semibold text-lg">
          Verifying access...
        </div>
      </div>
    );
  }

  // If they don't have access, don't render the page content
  if (!user || (role && !allowedRoles.includes(role))) {
    return null;
  }

  // If they pass the checks, show them the page!
  return <>{children}</>;
}