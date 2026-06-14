'use client';

import { useUser, useDoc } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  // Fetch profile separately since useUser only handles Auth state
  const { data: profile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // DIAGNOSTIC LOGS: Use these to verify state in the browser console (F12)
    console.log("--- Dashboard Access Protection Sync ---");
    console.log("Auth State:", { email: user?.email, loading: authLoading });
    console.log("Profile State:", { 
      exists: !!profile, 
      completed: profile?.hasCompletedProfiling, 
      loading: profileLoading 
    });
    console.log("Current Path:", pathname);

    // Wait for all data to load before making redirection decisions
    if (authLoading || profileLoading) {
      console.log("Aivaz Protection: Data still loading...");
      return;
    }

    // Protection Gate Logic:
    // If the user is logged in but hasn't finished DNA profiling, force them to onboarding.
    const needsProfiling = user && (!profile || !profile.hasCompletedProfiling);
    const isNotOnboarding = pathname !== '/onboarding';

    if (needsProfiling && isNotOnboarding) {
      console.log("ACTION: Redirecting to /onboarding (Incomplete Profile)");
      router.push('/onboarding');
    } else {
      console.log("ACTION: Access permitted.");
    }
  }, [user, profile, authLoading, profileLoading, pathname, router]);

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
