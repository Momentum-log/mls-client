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

  useEffect(() => {
    const initAuth = async () => {
      if (isInitializing.current) return;

      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        router.push("/login");
        return;
      }

      if (!user) {
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
          } else {
            console.error("Auth check failed", error);
            router.push("/login");
          }
        } finally {
          isInitializing.current = false;
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [user, router, updateUser]);

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
