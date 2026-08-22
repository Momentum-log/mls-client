"use client";

import React, { useState, useEffect } from "react";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth-helper";
import { cn } from "@/utils/cn";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isInitializing = React.useRef(false);
  // Snapshotted on mount so the refresh can tell a cold start (no cached
  // profile — a failure means log in again) from a warm one.
  const hasCachedUser = React.useRef(Boolean(user));

  // Refreshed on every app open, not only when the store is empty. The auth
  // store is persisted, so a returning user would otherwise be served a cached
  // profile forever — and `accountType` decides which customs declaration they
  // are shown, which an admin can change between sessions.
  useEffect(() => {
    const initAuth = async () => {
      if (isInitializing.current) return;

      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        router.push("/login");
        return;
      }

      // A cached user paints immediately; the refresh below happens behind it.
      if (hasCachedUser.current) {
        setIsLoading(false);
      }

      isInitializing.current = true;
      try {
        const { getCurrentUser } = await import("@/api/auth");
        const response = await getCurrentUser();
        updateUser(response.data.user);
      } catch (error: unknown) {
        // If it's a network error, the server might be down
        if (error instanceof Error && error.message === "Network Error") {
          console.error(
            "Backend API is unreachable. Please ensure the server is running on port 8000.",
          );
        } else if (!hasCachedUser.current) {
          console.error("Auth check failed", error);
          router.push("/login");
        } else {
          // A failed refresh behind a cached profile is not worth throwing the
          // user out over; the next call that needs a live token will 401.
          console.error("Auth refresh failed", error);
        }
      } finally {
        isInitializing.current = false;
      }

      setIsLoading(false);
    };

    initAuth();
    // Runs once per mount. `user` is deliberately not a dependency — it is
    // written by this effect, and depending on it would re-fire the fetch.
  }, [router, updateUser]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Desktop Sidebar & Mobile Sidebar Overlay */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white md:translate-x-0 md:static md:inset-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarNav
          onClose={() => setIsMobileMenuOpen(false)}
          className="h-full"
        />
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 transition-all duration-300 shadow-inner">
        <div className="px-2 py-8 md:p-8">{children}</div>
      </main>
    </div>
  );
}
