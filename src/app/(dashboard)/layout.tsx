'use client';

import { useUser, useDoc } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const { data: profile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth and profile data to load before making access decisions
    if (authLoading || profileLoading) return;

    // 1. Authenticated Check
    if (!user) {
      console.log("SECURE NODE: No session detected. Redirecting to Login.");
      router.push('/login');
      return;
    }

    // 2. Profiling Check
    // If profiling is incomplete, force the user to the onboarding flow
    // Onboarding is in the (auth) group, so it's outside this layout's scope
    if (profile && profile.hasCompletedProfiling === false) {
      console.log("SECURE NODE: Profile incomplete. Redirecting to Onboarding.");
      router.push('/onboarding');
    }
  }, [user, profile, authLoading, profileLoading, router]);

  // Loading State: Prevent UI flicker or sidebar flashing before auth is confirmed
  if (authLoading || profileLoading || !user || profile?.hasCompletedProfiling === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
          <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Synchronizing Node Access</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[280px] flex-1 min-w-0 flex flex-col relative shadow-[-15px_0_30px_-5px_rgba(0,0,0,0.25)]">
        <div className="flex-1 p-8 pb-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
