// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase automatically detects the '?code=' in the URL and exchanges it for a session.
    // We just listen for that "SIGNED_IN" event to fire, then push the user to the dashboard.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        router.push("/");
      }
    });

    // Fallback safety timeout: if the user is already signed in and the event misses,
    // we route them home after a few seconds so they don't get stuck on this screen.
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neu-primary"></div>
        <div className="animate-pulse text-neu-primary font-semibold text-lg tracking-wide">
          Verifying secure login...
        </div>
      </div>
    </div>
  );
}