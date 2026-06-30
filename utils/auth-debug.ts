/**
 * Auth Debug and Address Validation Utilities.
 *
 * @module utils/auth-debug
 */

import { useAuthStore } from "@/store/auth-store";

/**
 * Checks and logs the status of the auth store.
 */
export function debugAuthStore(): void {
  const state = useAuthStore.getState();
  console.group("🔑 MLS Auth Store Debug");
  console.log("Authenticated:", state.isAuthenticated);
  console.log("User:", state.user);
  console.log("Tokens present:", {
    accessToken: !!state.accessToken,
    refreshToken: !!state.refreshToken,
  });
  console.groupEnd();
}

/**
 * Validates whether the user has a verified and complete address.
 *
 * @returns Object with completeness check results
 */
export function validateUserAddressComplete(): {
  isComplete: boolean;
  isVerified: boolean;
  missingFields: string[];
} {
  const { user } = useAuthStore.getState();
  const address = user?.address;
  const missingFields: string[] = [];

  if (!address) {
    return {
      isComplete: false,
      isVerified: false,
      missingFields: ["street", "city", "postalCode", "country"],
    };
  }

  if (!address.street) missingFields.push("street");
  if (!address.city) missingFields.push("city");
  if (!address.postalCode) missingFields.push("postalCode");
  if (!address.country) missingFields.push("country");

  const isVerified =
    user?.addressRequestStatus === "APPROVED" || !!user?.addressVerifiedAt;

  return {
    isComplete: missingFields.length === 0,
    isVerified,
    missingFields,
  };
}
