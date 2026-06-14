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
    // Wait for auth and profile to load
    if (authLoading || profileLoading) return;

    // If the user is logged in, but hasn't completed profiling, force them to onboarding
    if (user && profile && !profile.hasCompletedProfiling && pathname !== '/onboarding') {
      router.push('/onboarding');
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
