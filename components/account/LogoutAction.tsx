"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { logout as apiLogout } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Logout action component.
 * Handles both backend revocation and local state clearing.
 */
const LogoutAction = () => {
  const { logout, refreshToken } = useAuthStore();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
      logout();
      addToast({
        title: "Success",
        message: "Logged out successfully",
        type: "success",
      });
      router.push("/login");
    } catch (error) {
      // Still logout locally even if backend fails
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full p-4 text-center text-sm font-bold text-red-600 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors mt-4"
    >
      Sign Out of Account
    </button>
  );
};

export default LogoutAction;
