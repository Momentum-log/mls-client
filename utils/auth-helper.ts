import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const GUEST_ID_COOKIE_NAME = "mls_guest_id";
export const ACCESS_TOKEN_COOKIE_NAME = "mls_access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "mls_refresh_token";

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

export const getAccessToken = () => {
  const val = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  return val ? decryptData(val) : undefined;
};

export const getRefreshToken = () => {
  const val = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  return val ? decryptData(val) : undefined;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  const encAccess = encryptData(accessToken);
  const encRefresh = encryptData(refreshToken);

  const type = getPersistencePreference();
  const options: Cookies.CookieAttributes = {
    sameSite: "Strict",
    secure: window.location.protocol === "https:",
  };

  // If "local" (Remember Me), set cookies to expire in 7 days.
  // If "session", do NOT set expires (browser session only).
  if (type === "local") {
    options.expires = 7;
  }

  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, encAccess, options);
  Cookies.set(REFRESH_TOKEN_COOKIE_NAME, encRefresh, options);
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
  Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
};
