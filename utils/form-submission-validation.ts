/**
 * Form submission validation for account verification checks.
 *
 * Provides utilities for validating user account status before allowing
 * form submission or shipment creation.
 *
 * @module utils/form-submission-validation
 */

import { User } from "@/types/auth";
import {
  getVerificationStatus,
  needsVerification,
  getVerificationError,
} from "@/utils/verification-helpers";
import { VerificationError } from "@/types/verification";

/**
 * Validates if a user can submit a shipment creation form.
 *
 * Performs all necessary verification checks and returns a detailed
 * error object if validation fails.
 *
 * @param user - The user object to validate
 * @returns Object with validation result and error details (if any)
 *
 * @example
 * ```tsx
 * const validation = validateFormSubmission(user);
 * if (!validation.isValid) {
 *   showVerificationModal(validation.error?.message);
 *   return;
 * }
 * // Proceed with form submission
 * ```
 */
export const validateFormSubmission = (
  user: User | null,
): {
  isValid: boolean;
  error: VerificationError | null;
} => {
  if (!user) {
    return {
      isValid: false,
      error: {
        type: "BOTH",
        field: "both",
        message: "You must be logged in to create a shipment.",
      },
    };
  }

  const error = getVerificationError(user);

  return {
    isValid: error === null,
    error,
  };
};

/**
 * Checks if a form submission should be blocked due to verification requirements.
 *
 * @param user - The user object to check
 * @returns True if form submission should be blocked, false otherwise
 */
export const shouldBlockFormSubmission = (user: User | null): boolean => {
  return needsVerification(user);
};

/**
 * Gets a user-friendly message for form submission blocking.
 *
 * @param user - The user object
 * @returns Descriptive message explaining why submission is blocked
 */
export const getFormSubmissionBlockMessage = (user: User | null): string => {
  const error = getVerificationError(user);

  if (!error) return "";

  return error.message;
};

/**
 * Checks if verification should be re-checked (e.g., after user returns from account page).
 *
 * This is useful when a user completes verification and may return to the form.
 * A simple comparison can determine if they've updated their verification status.
 *
 * @param previousUser - The previous user state
 * @param currentUser - The current user state
 * @returns True if verification status may have changed
 */
export const hasVerificationStatusChanged = (
  previousUser: User | null,
  currentUser: User | null,
): boolean => {
  if (!previousUser || !currentUser) return true;

  const prevStatus = getVerificationStatus(previousUser);
  const currentStatus = getVerificationStatus(currentUser);

  return (
    prevStatus.emailVerified !== currentStatus.emailVerified ||
    prevStatus.addressComplete !== currentStatus.addressComplete
  );
};
