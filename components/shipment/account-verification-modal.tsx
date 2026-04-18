/**
 * Account Verification Modal Component
 *
 * Non-dismissible modal that prompts users to verify their email and complete
 * their address before proceeding with shipment creation.
 *
 * Features:
 * - No close button (non-dismissible)
 * - Click outside (overlay) does not close the modal
 * - Primary CTA routes to account settings page
 * - Responsive design for mobile and desktop
 * - Uses design system styling (CSS variables)
 *
 * @module components/shipment/account-verification-modal
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import Button from "@/components/ui/button";
import { AccountVerificationModalProps } from "@/types/verification";

/**
 * AccountVerificationModal Component
 *
 * Displays a non-dismissible modal prompting users to verify their email
 * and complete their address information before creating a shipment.
 *
 * @example
 * ```tsx
 * <AccountVerificationModal
 *   isOpen={true}
 *   onClose={() => {}} // This is essentially a no-op for non-dismissible modal
 *   onVerify={() => router.push("/app/account")}
 *   message="Email verification and account address update required"
 * />
 * ```
 */
export const AccountVerificationModal: React.FC<
  AccountVerificationModalProps
> = ({
  isOpen,
  onVerify,
  onVerifyEmail,
  onUpdateAddress,
  requiresEmailVerification = true,
  requiresAddressUpdate = true,
  message,
  isLoading = false,
}) => {
  // Prevent closing via escape key or overlay click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Allow overlay click to do nothing (non-dismissible)
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent closing with Escape key
    if (e.key === "Escape") {
      e.preventDefault();
    }
  };

  const resolvedMessage = React.useMemo(() => {
    if (message) return message;

    if (requiresEmailVerification && requiresAddressUpdate) {
      return "To create a shipment, verify your email and complete your account address.";
    }

    if (requiresEmailVerification) {
      return "To create a shipment, verify your email address first.";
    }

    if (requiresAddressUpdate) {
      return "To create a shipment, complete your account address first.";
    }

    return "Account verification is required before creating a shipment.";
  }, [message, requiresEmailVerification, requiresAddressUpdate]);

  const handleVerifyEmail = () => {
    if (onVerifyEmail) {
      onVerifyEmail();
      return;
    }

    if (onVerify) {
      onVerify();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Click does not close (non-dismissible) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/35 backdrop-blur-md z-999"
            onKeyDown={handleKeyDown}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-1000 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
          >
            {/* Close Button */}
            {/* Intentionally left blank for non-dismissible behavior */}

            {/* Modal Content */}
            <motion.div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Header with Icon */}
              <div className="bg-brand-blue/10 px-6 py-8 border-b border-gray-200 flex flex-col items-center">
                <div className="bg-brand-blue/15 p-3 rounded-full mb-4">
                  <FiLock className="w-8 h-8 text-brand-blue" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Account Verification Required
                </h2>
              </div>

              {/* Body Content */}
              <div className="px-6 py-8 space-y-6">
                {/* Message or Custom Message */}
                <p className="text-gray-700 text-center leading-relaxed">
                  {resolvedMessage}
                </p>

                {/* Verification Checklist */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {requiresEmailVerification && (
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        Verify your email address via OTP
                      </p>
                    </div>
                  )}
                  {requiresAddressUpdate && (
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        Add a valid address to your account.
                      </p>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 text-center">
                  This is a required step to ensure secure and accurate
                  shipments.
                </p>
              </div>

              {/* Footer with CTA */}
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 space-y-3">
                {requiresEmailVerification && (
                  <Button
                    onClick={handleVerifyEmail}
                    disabled={isLoading}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Verify Email"}
                  </Button>
                )}

                {requiresAddressUpdate && (
                  <Button
                    onClick={onUpdateAddress || onVerify}
                    disabled={isLoading}
                    variant={requiresEmailVerification ? "outline" : "primary"}
                    className="w-full font-semibold py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Address
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your shipment form will be available after verification.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AccountVerificationModal;
