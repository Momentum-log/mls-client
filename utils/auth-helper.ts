import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const GUEST_ID_COOKIE_NAME = "mls_guest_id";

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
