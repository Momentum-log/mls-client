"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { sendVerificationCode } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import VerifyEmailModal from "./VerifyEmailModal";

/**
 * A persistent banner for unverified accounts.
 */
const VerificationBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { addToast } = useToast();

  const handleVerifyNow = async () => {
    setIsSending(true);
    try {
      await sendVerificationCode();
      addToast({
        title: "Code Sent",
        message: "A verification code has been sent to your email.",
        type: "success",
      });
      setIsModalOpen(true);
    } catch (error: any) {
      addToast({
        title: "Error",
        message:
          error.response?.data?.error || "Failed to send verification code",
        type: "error",
      });
    } finally {
      setIsSending(false);
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
              Account Unverified
            </h4>
            <p className="text-gray-600 text-xs">
              Verify your email to access all features.
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 md:flex-none py-2 px-4 whitespace-nowrap"
            onClick={handleVerifyNow}
            disabled={isSending}
          >
            {isSending ? "Sending Code..." : "Verify Now"}
          </Button>
          <button
            type="button"
            onClick={handleResendCode}
            className="text-xs font-bold text-brand-blue hover:underline px-2 transition-all"
          >
            Resend Code
          </button>
        </div>
      </div>

      <VerifyEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default VerificationBanner;
