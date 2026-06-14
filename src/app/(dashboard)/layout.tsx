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
    if (authLoading || profileLoading) return;

    if (!user) {
      router.push('/signup');
      return;
    }

    if (profile && profile.hasCompletedProfiling === false) {
      router.push('/onboarding');
    }
  }, [user, profile, authLoading, profileLoading, router]);

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