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
    // Wait for all data to load before making decisions
    if (authLoading || profileLoading) return;

    // 1. AUTH GATE: If no user is logged in, redirect to the login page
    if (!user) {
      console.log("SHIELD: No session detected. Redirecting to /login.");
      router.push('/login');
      return;
    }

    // 2. DISCOVERY GATE: If user exists but hasn't finished profiling, force onboarding
    // We exclude the onboarding path itself to prevent recursive loops
    const hasFinishedProfiling = profile?.hasCompletedProfiling === true;
    const isNotOnboarding = pathname !== '/onboarding';

    if (!hasFinishedProfiling && isNotOnboarding) {
      console.log("SHIELD: Profile incomplete. Redirecting to /onboarding.");
      router.push('/onboarding');
    }
  }, [user, profile, authLoading, profileLoading, pathname, router]);

  // Prevent UI flicker: Don't show the dashboard UI until we know the user is allowed to see it
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Synchronizing Node Access</p>
      </div>
    );
  }

  // If the gate is active and redirecting, we shouldn't render the dashboard frame
  const isAuthorized = user && (profile?.hasCompletedProfiling === true || pathname === '/onboarding');
  if (!isAuthorized && pathname !== '/onboarding') return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar only visible when authorized and not in the minimalist onboarding view */}
      {pathname !== '/onboarding' && <Sidebar />}
      
      <main className={pathname === '/onboarding' ? "flex-1" : "ml-[280px] flex-1 min-w-0 flex flex-col relative shadow-[-15px_0_30px_-5px_rgba(0,0,0,0.25)]"}>
        <div className="flex-1 p-8 pb-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}