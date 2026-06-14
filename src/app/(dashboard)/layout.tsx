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
  const { data: profile, loading: profileLoading } = useDoc(user ? `users/${user.uid}` : null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // DIAGNOSTIC LOGS
    console.log("--- Dashboard Access Protection Sync ---");
    console.log("Auth State:", { email: user?.email, loading: authLoading });
    console.log("Profile State:", { 
      exists: !!profile, 
      completed: profile?.hasCompletedProfiling, 
      loading: profileLoading 
    });
    console.log("Current Path:", pathname);

    if (authLoading || profileLoading) return;

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

      {/* TEMPORARY DIAGNOSTIC OVERLAY */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(0,0,0,0.9)', 
        color: '#00ff00', 
        zIndex: 9999, 
        fontSize: '10px', 
        padding: '8px', 
        fontFamily: 'monospace',
        maxHeight: '100px',
        overflow: 'auto',
        borderTop: '1px solid #333'
      }}>
        <strong>DEBUG PROFILE:</strong> {JSON.stringify(profile)}
      </div>
    </div>
  );
}
