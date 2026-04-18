/**
 * Custom hook for managing account verification state and logic.
 *
 * Provides verification status, validation checks, and error handling
 * for account verification modal and shipment form validation.
 *
 * @module hooks/shipments/useVerification
 */

import { useMemo, useCallback, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  getVerificationStatus,
  needsVerification,
  getVerificationError,
} from "@/utils/verification-helpers";
import { hasVerificationStatusChanged } from "@/utils/form-submission-validation";
import { VerificationStatus, VerificationError } from "@/types/verification";

/**
 * Hook for managing user account verification state and validation.
 *
 * @returns Object containing verification status, checks, and utilities
 *
 * @example
 * ```tsx
 * const { status, needsVerification, error } = useVerification();
 *
 * if (needsVerification) {
 *   return <AccountVerificationModal />;
 * }
 * ```
 */
export const useVerification = () => {
  const { user } = useAuth();
  const [previousUser, setPreviousUser] = useState(user);

  /**
   * Get the current verification status
   */
  const status: VerificationStatus = useMemo(
    () => getVerificationStatus(user),
    [user],
  );

  /**
   * Check if user needs verification
   */
  const isVerificationRequired: boolean = useMemo(
    () => needsVerification(user),
    [user],
  );

  /**
   * Get verification error (if any)
   */
  const error: VerificationError | null = useMemo(
    () => getVerificationError(user),
    [user],
  );

  /**
   * Check if verification status has changed (e.g., user completed verification)
   */
  const verificationStatusChanged: boolean = useMemo(
    () => hasVerificationStatusChanged(previousUser, user),
    [previousUser, user],
  );

  /**
   * Callback to check if user can proceed with shipment creation
   */
  const canProceed = useCallback((): boolean => {
    return status.isFullyVerified;
  }, [status]);

  /**
   * Callback to trigger verification flow (navigates user to account page)
   */
  const triggerVerification = useCallback((): void => {
    if (typeof window !== "undefined") {
      window.location.href =
        "/app/account?openVerifyEmail=1&next=/app/shipments/new";
    }
  }, []);

  /**
   * Update previous user when user changes (to track status changes)
   */
  useEffect(() => {
    setPreviousUser(user);
  }, [user]);

  return {
    /** Current user from auth context */
    user,
    /** Verification status object with individual checks */
    status,
    /** Whether verification is required to proceed */
    isVerificationRequired,
    /** Error details if verification is incomplete (null if fully verified) */
    error,
    /** Check if user can proceed with shipment creation */
    canProceed,
    /** Trigger verification flow (navigate to account page) */
    triggerVerification,
    /** Whether verification status has changed since last check */
    verificationStatusChanged,
  };
};
