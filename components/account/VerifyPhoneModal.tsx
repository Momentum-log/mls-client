"use client";

import React, { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useSendPhoneOTP, useVerifyPhoneOTP } from "@/hooks/auth/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { extractApiError } from "@/utils/error-handler";

interface VerifyPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempPhone?: string;
  onVerified?: () => void;
}

/**
 * Modal for confirming account phone verification with OTP.
 */
const VerifyPhoneModal: React.FC<VerifyPhoneModalProps> = ({
  isOpen,
  onClose,
  tempPhone,
  onVerified,
}) => {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const { mutateAsync: sendOTP, isPending: isSending } = useSendPhoneOTP();
  const { mutateAsync: verifyOTP, isPending: isVerifying } =
    useVerifyPhoneOTP();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOTP = useCallback(async () => {
    try {
      await sendOTP(tempPhone ? { phone: tempPhone } : undefined);
      addToast({
        title: "Code Sent",
        message: "A verification code has been sent to your phone.",
        type: "success",
      });
      setCooldown(60);
    } catch (error) {
      addToast({
        title: "Error",
        message: extractApiError(error).message || "Failed to send code",
        type: "error",
      });
    }
  }, [sendOTP, tempPhone, addToast]);

  // Opening the modal for a just-changed number sends its code straight away.
  useEffect(() => {
    if (isOpen && tempPhone) {
      // The send is the external call this effect exists for; its state
      // updates land after the request resolves, not synchronously.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void handleSendOTP();
    }
  }, [isOpen, tempPhone, handleSendOTP]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      addToast({
        title: "Error",
        message: "Please enter a 6-digit code",
        type: "error",
      });
      return;
    }

    try {
      await verifyOTP({ code, phone: tempPhone });
      addToast({
        title: "Success",
        message: "Phone verified successfully!",
        type: "success",
      });

      if (!tempPhone && user) {
        updateUser({ ...user, is_phone_verified: true });
      }

      if (onVerified) onVerified();
      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        message: extractApiError(error).message || "Verification failed",
        type: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Phone Number">
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Enter the 6-digit verification code sent to <br />
            <span className="font-bold text-gray-900">
              {tempPhone || user?.phone}
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="text-center text-2xl tracking-[0.5em] font-black h-16"
            maxLength={6}
            disabled={isVerifying}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={isVerifying || code.length < 6}
          variant="primary"
        >
          {isVerifying ? "Verifying..." : "Confirm Verification"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={isSending || cooldown > 0}
            className="text-[10px] uppercase font-black tracking-widest text-brand-blue disabled:text-gray-400"
          >
            {cooldown > 0
              ? `Resend code in ${cooldown}s`
              : isSending
                ? "Sending..."
                : "Resend code"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VerifyPhoneModal;
