import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const GUEST_ID_COOKIE_NAME = "mls_guest_id";
export const ACCESS_TOKEN_COOKIE_NAME = "mls_access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "mls_refresh_token";
export const SESSION_INFO_COOKIE_NAME = "mls_session";

/**
 * Retrieves the existing guest ID from cookies or generates a new one if it doesn't exist.
 * The guest ID format is: mls_guest_[uuid]
 */
export const getOrSetGuestId = (): string => {
  let guestId = Cookies.get(GUEST_ID_COOKIE_NAME);

  if (!guestId) {
    guestId = `mls_guest_${uuidv4()}`;
    Cookies.set(GUEST_ID_COOKIE_NAME, guestId, {
      expires: 365, // Expires in 1 year
      path: "/",
      sameSite: "Strict",
      secure: window.location.protocol === "https:",
    });
  }

  return guestId;
};

/**
 * Manually sets the guest ID if needed (e.g. recovering from a different storage)
 */
export const setGuestId = (id: string) => {
  Cookies.set(GUEST_ID_COOKIE_NAME, id, {
    expires: 365,
    path: "/",
    sameSite: "Strict",
    secure: window.location.protocol === "https:",
  });
};

/**
 * Gets the current Guest ID without setting a new one if missing (returns undefined)
 */
export const getGuestIdOnly = (): string | undefined => {
  return Cookies.get(GUEST_ID_COOKIE_NAME);
};

// --- Token Management ---

import {
  encryptData,
  decryptData,
  getPersistencePreference,
} from "./secure-storage";
import { SessionInfo } from "@/types/auth";

export const getAccessToken = () => {
  const val = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  return val ? decryptData(val) : undefined;
};

export const getRefreshToken = () => {
  const val = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  return val ? decryptData(val) : undefined;
};

/**
 * Cookie attributes shared by every credential cookie we write.
 *
 * If "local" (Remember Me), cookies expire in 7 days — matching the refresh
 * token's own lifetime. If "session", `expires` is omitted so the cookie dies
 * with the browser session.
 */
const cookieOptions = (): Cookies.CookieAttributes => {
  const options: Cookies.CookieAttributes = {
    sameSite: "Strict",
    secure: window.location.protocol === "https:",
  };

  if (getPersistencePreference() === "local") {
    options.expires = 7;
  }

  return options;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  const options = cookieOptions();
  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, encryptData(accessToken), options);
  Cookies.set(REFRESH_TOKEN_COOKIE_NAME, encryptData(refreshToken), options);
};

/**
 * Stores the session metadata returned by login and refresh. Display only —
 * see {@link SessionInfo.deviceLabel}.
 */
export const setSessionInfo = (session: SessionInfo) => {
  Cookies.set(
    SESSION_INFO_COOKIE_NAME,
    encryptData(JSON.stringify(session)),
    cookieOptions(),
  );
};

export const getSessionInfo = (): SessionInfo | null => {
  const val = Cookies.get(SESSION_INFO_COOKIE_NAME);
  if (!val) return null;

  try {
    const decoded = decryptData(val);
    return decoded ? (JSON.parse(decoded) as SessionInfo) : null;
  } catch {
    // A malformed cookie is not worth throwing over; the store holds a copy.
    return null;
  }
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
  Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  Cookies.remove(SESSION_INFO_COOKIE_NAME);
};
