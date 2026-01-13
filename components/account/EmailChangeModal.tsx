"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { initiateEmailChange, confirmEmailChange } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for changing account email address.
 * Two-step flow: Request change -> Confirm with code.
 */
const EmailChangeModal: React.FC<EmailChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToast();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsLoading(true);
    try {
      await initiateEmailChange(newEmail);
      addToast({
        title: "Success",
        message: "Verification code sent to " + newEmail,
        type: "success",
      });
      setStep("confirm");
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.error || "Failed to initiate change",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    try {
      await confirmEmailChange(code);
      addToast({
        title: "Success",
        message: "Email updated successfully!",
        type: "success",
      });
      if (user) {
        updateUser({ ...user, email: newEmail });
      }
      onClose();
    } catch (error: any) {
      addToast({
        title: "Error",
        message: error.response?.data?.error || "Invalid code",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Email Address">
      {step === "request" ? (
        <form onSubmit={handleRequest} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Enter your new email address. We'll send a code to verify it.
            </p>
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new.email@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isLoading || !newEmail}
            variant="primary"
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Enter the 6-digit code sent to <br />
              <span className="font-bold text-gray-900">{newEmail}</span>
            </p>
          </div>

          <div className="space-y-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              className="text-center text-2xl tracking-[0.5em] font-black h-16 uppercase"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={isLoading || code.length < 1}
            variant="primary"
          >
            {isLoading ? "Updating..." : "Confirm New Email"}
          </Button>

          <button
            type="button"
            onClick={() => setStep("request")}
            className="w-full text-xs font-bold text-brand-blue hover:underline"
          >
            Use a different email address
          </button>
        </form>
      )}
    </Modal>
  );
};

export default EmailChangeModal;
