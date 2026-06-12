
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessengerPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to Wardroom which is the new unified communication hub
    router.replace("/wardroom");
  }, [router]);

  return null;
}
