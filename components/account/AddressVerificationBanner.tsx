"use client";

import React, { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useAuthStore } from "@/store/auth-store";

/**
 * A persistent banner for accounts without an approved/pending address.
 * Prompts user to submit address verification to enable shipments.
 */
const AddressVerificationBanner = () => {
  const { user } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const isPending = user?.addressRequestStatus === "PENDING";

  // Hide only when dismissed or already approved.
  if (isDismissed || user?.addressVerifiedAt) {
    return null;
  }

  return (
    <div className="bg-brand-yellow/15 border border-brand-yellow/30 rounded-2xl p-4 flex items-start gap-4">
      <div className="shrink-0 mt-0.5">
        <FiAlertCircle className="w-5 h-5 text-brand-yellow" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900">
          {isPending
            ? "Address Verification Pending"
            : "Address Verification Required"}
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          {isPending
            ? "Your address update has been submitted and is awaiting admin review."
            : "You need an approved address to create shipments. Please submit address verification in the section below."}
        </p>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default AddressVerificationBanner;
