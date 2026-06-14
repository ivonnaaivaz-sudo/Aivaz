"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useDoc } from "@/firebase";
import { Loader2 } from "lucide-react";

/**
 * Root Redirector
 * This page serves as the entry point and directs the user to the 
 * appropriate node based on their authentication and profiling status.
 */
export default function Home() {
  const { user, loading: authLoading } = useUser();
  const { data: profile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    
    if (!user) {
      // No session found, send to registration node
      router.push("/signup");
      return;
    }

    if (!profile || profile.hasCompletedProfiling === false) {
      // Session found but human profiling incomplete
      router.push("/onboarding");
    } else {
      // Authorized entry to legacy dashboard
      router.push("/dashboard");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background antialiased">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-headline font-bold tracking-[0.3em] uppercase text-primary">Aivaz Core</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 font-bold">Establishing Heritage Sync</p>
        </div>
      </div>
    </div>
  );
}