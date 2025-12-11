"use client";

import { ToastContainer } from "@/components/ui/toast";
import { useEffect, useState } from "react";

// This provider ensures toasts are rendered at the root level, handling mounting
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {children}
      {isMounted && <ToastContainer />}
    </>
  );
};
