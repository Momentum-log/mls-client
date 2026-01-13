"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { verifyEmail } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for confirming account email verification.
 */
const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      addToast({
        title: "Error",
        message: "Please enter a valid 6-digit code",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(code);
      addToast({
        title: "Success",
        message: "Email verified successfully!",
        type: "success",
      });
      if (user) {
        updateUser({ ...user, is_verified: true });
      }
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.error || "Verification failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Email">
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Enter the 6-digit verification code sent to <br />
            <span className="font-bold text-gray-900">{user?.email}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="6-DIGIT CODE"
            className="text-center text-2xl tracking-[0.5em] font-black h-16 uppercase"
            maxLength={6}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={isLoading || code.length < 6}
          variant="primary"
        >
          {isLoading ? "Verifying..." : "Confirm Verification"}
        </Button>

        <p className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest">
          Check your spam folder if you don't see it
        </p>
      </form>
    </Modal>
  );
};

export default VerifyEmailModal;
