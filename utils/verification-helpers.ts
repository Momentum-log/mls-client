/**
 * Verification utility functions for account verification checks and validation.
 *
 * @module utils/verification-helpers
 */

import { User, UserAddress } from "@/types/auth";
import { VerificationStatus, VerificationError } from "@/types/verification";

/**
 * Checks if a user's email is verified.
 *
 * @param user - The user object to check
 * @returns True if email is verified, false otherwise
 */
export const isEmailVerified = (user: User | null): boolean => {
  if (!user) return false;
  return user.is_verified === true;
};

/**
 * Checks if a user has a complete address on file.
 *
 * @param user - The user object to check
 * @returns True if user has a non-empty address, false otherwise
 */
export const hasCompleteAddress = (user: User | null): boolean => {
  if (!user || !user.address) return false;

  const addr = user.address as UserAddress;

  const street = String(addr.street || "").trim();
  const city = String(addr.city || "").trim();
  const postalCode = String(addr.postalCode || addr.zip || "").trim();
  const country = String(addr.country || "").trim();

  return Boolean(street && city && postalCode && country);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hasApprovedAddress = (_user: User | null): boolean => {
  return true;
};

/**
 * Gets the complete verification status of a user.
 *
 * @param user - The user object to check
 * @returns VerificationStatus object with all verification states
 */
export const getVerificationStatus = (
  user: User | null,
): VerificationStatus => {
  const emailVerified = isEmailVerified(user);
  const addressComplete = true;

  return {
    emailVerified,
    addressComplete,
    isFullyVerified: emailVerified,
  };
};

/**
 * Determines if a user needs verification before proceeding with shipment creation.
 *
 * @param user - The user object to check
 * @returns True if user needs verification, false if fully verified
 */
export const needsVerification = (user: User | null): boolean => {
  const status = getVerificationStatus(user);
  return !status.isFullyVerified;
};

/**
 * Generates a detailed verification error object based on user's verification status.
 *
 * @param user - The user object to check
 * @returns VerificationError object with error type and message
 */
export const getVerificationError = (
  user: User | null,
): VerificationError | null => {
  const status = getVerificationStatus(user);

  if (!status.emailVerified) {
    return {
      type: "EMAIL_NOT_VERIFIED",
      field: "email",
      message: "Please verify your email address to create a shipment.",
    };
  }

  return null;
};

/**
 * Formats a user's address into a single string for display.
 *
 * @param user - The user object containing the address
 * @returns Formatted address string (e.g., "123 Main St, New York, NY 10001, USA")
 */
export const formatUserAddress = (user: User | null): string => {
  if (!user || !user.address) return "";

  const addr = user.address as UserAddress;
  const parts = [
    addr.street,
    addr.city,
    addr.state,
    addr.postalCode,
    addr.country,
  ].filter(Boolean);

  return parts.join(", ");
};

/**
 * Extracts user display name and address for invoice population.
 *
 * @param user - The user object
 * @returns Object with user name and address
 */
export const extractUserInfoForInvoice = (user: User | null) => {
  return {
    name: user?.name || "",
    address: (user?.address as UserAddress | null) || null,
  };
};
