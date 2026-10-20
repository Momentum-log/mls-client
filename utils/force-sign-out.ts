import { useAuthStore } from "@/store/auth-store";

const AUTH_ROUTES = ["/login", "/register", "/auth/forgot-password"];

/**
 * Guards against a burst of concurrent 401s producing a burst of navigations.
 * Module-level rather than per-call because the whole point is to collapse
 * failures that arrive on separate requests.
 */
let isSigningOut = false;

/**
 * Clears local credentials and sends the user to sign in, carrying enough
 * context for the login page to explain what happened.
 *
 * Uses `window.location` rather than the Next router on purpose: this is called
 * from the axios module, outside React, where no router instance exists. The
 * full reload is also welcome — it drops any in-flight requests still holding
 * dead tokens.
 *
 * @param reason The `reason` from the server's 401, or a client-side marker
 *   such as `REFRESH_FAILED`.
 * @param details The server's human-readable explanation, if it sent one.
 */
export const forceSignOut = (reason?: string, details?: string) => {
  useAuthStore.getState().logout();

  if (typeof window === "undefined" || isSigningOut) return;

  const { pathname, search } = window.location;

  // Already on an auth page: the tokens are cleared, which is the whole job.
  // Redirecting would only stomp on a form the user is part-way through.
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) return;

  isSigningOut = true;

  const params = new URLSearchParams({ redirect: `${pathname}${search}` });
  if (reason) params.set("reason", reason);
  if (details) params.set("details", details);

  window.location.href = `/login?${params.toString()}`;
};
