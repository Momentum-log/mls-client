"use client";

import React, { useState, useEffect } from "react";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/auth-helper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        router.push("/login"); // This will now go to /login (marketing)
        setIsLoading(false);
        return;
      }

      if (!user) {
        try {
          // Manually check auth if user is not in store but token exists
          const { default: api } = await import("@/api");
          const response = await api.get("/auth/me");
          updateUser(response.data.user);
        } catch (error) {
          console.error("Auth check failed", error);
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [user, router, updateUser]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 hidden md:block h-full fixed inset-y-0 z-50">
        <SidebarNav />
      </div>
      <main className="md:pl-64 flex-1 h-full overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
