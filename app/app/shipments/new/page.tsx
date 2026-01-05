"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewShipmentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step
    router.replace("/app/shipments/new/origin");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
    </div>
  );
}
