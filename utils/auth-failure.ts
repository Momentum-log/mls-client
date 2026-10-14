import { AuthErrorBody, AuthFailureReason } from "@/types/auth";

/**
 * What the client should do about an authentication failure.
 *
 * - `REFRESH` — the access token merely aged out. Refresh once, retry once.
 * - `SIGN_OUT` — the session itself is gone. Refreshing fails identically and
 *   only delays the inevitable.
 * - `NONE` — not an authentication failure; let the caller handle it.
 */
export type AuthAction = "REFRESH" | "SIGN_OUT" | "NONE";

interface AuthErrorShape {
  response?: {
    status?: number;
    data?: Partial<AuthErrorBody>;
  };
}

const asAuthError = (error: unknown): AuthErrorShape | null =>
  typeof error === "object" && error !== null
    ? (error as AuthErrorShape)
    : null;

/**
 * The `reason` the server sent, if any. `undefined` covers both a plain JWT
 * expiry (which carries no reason at all) and a non-auth error.
 */
export const getAuthFailureReason = (
  error: unknown,
): AuthFailureReason | undefined => asAuthError(error)?.response?.data?.reason;

/**
 * The human-readable explanation the server attached, for showing on the login
 * page after a forced sign-out ("You changed your password", etc.).
 */
export const getAuthFailureDetails = (error: unknown): string | undefined => {
  const data = asAuthError(error)?.response?.data;
  return data?.details ?? undefined;
};

/**
 * The single place the 401 contract from `docs/user-session-guide.md` is
 * encoded. Every call site asks this rather than re-deriving the rules.
 *
 * @remarks An unrecognised `reason` is treated as `SIGN_OUT` deliberately.
 * Refreshing on a reason we do not understand burns the refresh token, and
 * presenting a retired one outside the server's 60-second grace window is read
 * as a stolen token and ends the session outright. Signing out is the safe
 * failure; guessing "refresh" is not.
 */
export const classifyAuthError = (error: unknown): AuthAction => {
  const status = asAuthError(error)?.response?.status;
  const reason = getAuthFailureReason(error);

  // The only 403 that is an authentication decision. Everything else at 403 —
  // the "Verification Required" phone gate, for instance — is the caller's.
  if (status === 403) {
    return reason === "USER_RESTRICTED" ? "SIGN_OUT" : "NONE";
  }

  if (status !== 401) return "NONE";

  // No reason at all is a plain access-token expiry, the ordinary case.
  if (!reason) return "REFRESH";

  return reason === "TOKEN_UPGRADE_REQUIRED" ? "REFRESH" : "SIGN_OUT";
};
