/**
 * Verification types and interfaces for account verification modal and validation logic.
 *
 * @module types/verification
 */

/**
 * Represents the verification status of a user account.
 */
export interface VerificationStatus {
  /** Whether the user's email has been verified */
  emailVerified: boolean;
  /** Whether the user has a complete address on file */
  addressComplete: boolean;
  /** Whether all verification requirements are met */
  isFullyVerified: boolean;
}

/**
 * Props for the Account Verification Modal component.
 */
export interface AccountVerificationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal (typically disabled for non-dismissible modal) */
  onClose?: () => void;
  /** Callback when the user clicks the CTA button (typically routes to account page) */
  onVerify?: () => void;
  /** Callback for email verification CTA */
  onVerifyEmail?: () => void;
  /** Callback for address update CTA */
  onUpdateAddress?: () => void;
  /** Whether email verification is currently required */
  requiresEmailVerification?: boolean;
  /** Whether address completion is currently required */
  requiresAddressUpdate?: boolean;
  /** Custom message to display (optional) */
  message?: string;
  /** Whether the modal is currently processing (disable CTA while processing) */
  isLoading?: boolean;
}

/**
 * Verification error details for display in validation messages.
 */
export interface VerificationError {
  /** Type of verification error */
  type: "EMAIL_NOT_VERIFIED" | "ADDRESS_INCOMPLETE" | "BOTH";
  /** User-friendly error message */
  message: string;
  /** Specific field that needs action */
  field?: "email" | "address" | "both";
}
