"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to Bridge which now houses all account management
    router.replace("/bridge");
  }, [router]);

  return null;
}