"use client";

import { useEffect } from "react";
import { getOrSetGuestId } from "@/utils/auth-helper";

export default function GuestIDInitializer() {
  useEffect(() => {
    // Initialize guest ID on mount
    getOrSetGuestId();
  }, []);

  return null; // This component renders nothing
}
