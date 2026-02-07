"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { sendVerificationCode } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import VerifyEmailModal from "./VerifyEmailModal";
import VerifyPhoneModal from "./VerifyPhoneModal";
import { useAuthStore } from "@/store/auth-store";
import { useSendPhoneOTP } from "@/hooks/auth/use-auth";

/**
 * A persistent banner for unverified accounts.
 */
const VerificationBanner = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const { mutateAsync: sendPhoneOTP, isPending: isSendingPhone } =
    useSendPhoneOTP();

  // Only show banner if email is not verified (phone verification is optional)
  if (!user || user.is_verified) return null;

  const handleVerifyEmail = async () => {
    setIsSendingEmail(true);
    try {
      await sendVerificationCode();
      addToast({
        title: "Code Sent",
        message: "A verification code has been sent to your email.",
        type: "success",
      });
      setIsEmailModalOpen(true);
    } catch (error: any) {
      addToast({
        title: "Error",
        message:
          error.response?.data?.error || "Failed to send verification code",
        type: "error",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await sendPhoneOTP({});
      addToast({
        title: "Code Sent",
        message: "A verification code has been sent to your phone.",
        type: "success",
      });
      setIsPhoneModalOpen(true);
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.message || "Failed to send code",
        type: "error",
      });
    }
  };

  const handleResendCode = async () => {
    try {
      await sendVerificationCode();
      addToast({
        title: "Success",
        message: "Verification code sent to your email!",
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        message: "Failed to send verification code",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-yellow flex items-center justify-center text-brand-blue shadow-inner shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">
              Email Verification Required
            </h4>
            <p className="text-gray-600 text-xs">
              Verify your email to create shipments and access all features.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            variant="primary"
            size="sm"
            className="w-full sm:w-32 py-2.5"
            onClick={handleVerifyEmail}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? "Sending..." : "Verify Email"}
          </Button>
        </div>
      </div>

      <VerifyEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
      <VerifyPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </>
  );
};

export default VerificationBanner;
