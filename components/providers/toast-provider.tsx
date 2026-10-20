"use client";

import { ToastContainer } from "@/components/ui/toast";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

// This provider ensures toasts are rendered at the root level, handling mounting
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  // False during server render and hydration, true on the client after.
  const isMounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return (
    <>
      {children}
      {isMounted && <ToastContainer />}
    </>
  );
};
