"use client";

import React from "react";
import { useAuthStore } from "@/store/auth-store";
import VerifyPhoneModal from "@/components/account/VerifyPhoneModal";

/**
 * Global provider to handle verification modals triggered by state or API interceptors.
 */
export const VerificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isPhoneVerificationModalOpen, setIsPhoneVerificationModalOpen } =
    useAuthStore();

  return (
    <>
      {children}
      <VerifyPhoneModal
        isOpen={isPhoneVerificationModalOpen}
        onClose={() => setIsPhoneVerificationModalOpen(false)}
      />
    </>
  );
};
