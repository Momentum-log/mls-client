import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    // Check auth on mount if not already checked or if token exists?
    // Actually store starts with isLoading: true.
    // We should trigger checkAuth once.
    // But be careful of infinite loops or double checks.
    // simpler: caller decides or we do it in a top level provider.
    // For now, let's just return the store values and helper.
  }, []);

  return store;
};
