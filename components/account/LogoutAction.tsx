"use client";

import React from "react";
import { useLogout } from "@/hooks/auth/use-auth";

/**
 * Signs the user out of this device. The revocation and local cleanup both live
 * in `useLogout` so there is one logout path in the app.
 */
const LogoutAction = () => {
  const handleLogout = useLogout();

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
