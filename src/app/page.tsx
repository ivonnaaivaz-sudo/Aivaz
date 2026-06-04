
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
    if (authLoading || (user && profileLoading)) return;

    if (!user) {
      router.push("/dashboard"); 
      return;
    }

    if (profile && !profile.hasCompletedProfiling) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  }, [user, profile, authLoading, profileLoading, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-headline tracking-widest uppercase opacity-50">Initializing Aivaz Core</p>
      </div>
    </div>
  );
}
