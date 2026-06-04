
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useDoc } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  
  const { data: profile, loading: profileLoading } = useDoc(
    user ? `users/${user.uid}` : null
  );

  useEffect(() => {
    // Wait for auth and profile to load if user exists
    if (authLoading) return;
    
    if (!user) {
      // In a real app, you'd go to /login here. 
      // For this prototype, we'll default to the dashboard which shows public/mock data
      // but the profiling gate will trigger once they are logged in.
      router.push("/dashboard");
      return;
    }

    if (profileLoading) return;

    // Redirection Gate: Mandatory Profiling
    if (!profile || !profile.hasCompletedProfiling) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-headline font-bold tracking-[0.3em] uppercase text-primary">Aivaz Core</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Establishing Heritage Sync</p>
        </div>
      </div>
    </div>
  );
}
