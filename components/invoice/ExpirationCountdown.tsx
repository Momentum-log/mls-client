/**
 * Expiration Countdown Component
 *
 * Displays a live countdown timer for payment link expiration.
 * Supports three visual states:
 * - Active (>24h): Calm blue banner
 * - Expiring Soon (<24h): Amber/warning banner
 * - Expired: Red banner with "Update Shipment" prompt
 *
 * @module components/invoice/ExpirationCountdown
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiClock, FiAlertTriangle, FiXCircle } from "react-icons/fi";

/**
 * Props for ExpirationCountdown component
 */
interface ExpirationCountdownProps {
  /** ISO-8601 timestamp when the payment link expires */
  expiresAt: string;
  /** Layout variant: "banner" for full-width top bar, "inline" for compact */
  variant?: "banner" | "inline";
  /** Optional callback when "Update Shipment" is clicked (shown when expired) */
  onUpdateShipment?: () => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * Calculates time remaining from now to target date
 *
 * @param expiresAt - ISO-8601 expiration timestamp
 * @returns Object with hours, minutes, seconds, and total milliseconds remaining
 */
const calculateTimeLeft = (
  expiresAt: string,
): {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} => {
  const diff = new Date(expiresAt).getTime() - Date.now();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    totalMs: diff,
  };
};

/**
 * ExpirationCountdown Component
 *
 * Live countdown that updates every second. Three visual states:
 * - Active (>24h): Blue styling, calm tone
 * - Expiring Soon (<24h): Amber/yellow, urgent
 * - Expired (0): Red, "expired" message + optional Update CTA
 *
 * @example
 * ```tsx
 * <ExpirationCountdown
 *   expiresAt="2026-04-12T13:26:44.416Z"
 *   variant="banner"
 *   onUpdateShipment={() => setShowUpdateModal(true)}
 * />
 * ```
 */
export const ExpirationCountdown: React.FC<ExpirationCountdownProps> = ({
  expiresAt,
  variant = "banner",
  onUpdateShipment,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isExpired = timeLeft.totalMs <= 0;
  const isExpiringSoon =
    !isExpired && timeLeft.totalMs < 24 * 60 * 60 * 1000; // < 24h

  /**
   * Pads a number with leading zeros for display
   */
  const pad = useCallback(
    (n: number): string => String(n).padStart(2, "0"),
    [],
  );

  /**
   * Renders the formatted time string
   */
  const renderTimeString = () => {
    if (isExpired) return null;

    return (
      <span className="font-mono font-bold tabular-nums">
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m{" "}
        {pad(timeLeft.seconds)}s
      </span>
    );
  };

  // ── Inline Variant (compact, near Pay button) ──
  if (variant === "inline") {
    if (isExpired) {
      return (
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold text-red-600 ${className}`}
        >
          <FiXCircle className="w-3.5 h-3.5" />
          Payment link expired
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          isExpiringSoon ? "text-yellow-700" : "text-gray-500"
        } ${className}`}
      >
        <FiClock className="w-3.5 h-3.5" />
        Expires in {renderTimeString()}
      </span>
    );
  }

  // ── Banner Variant (full-width top bar) ──
  if (isExpired) {
    return (
      <div
        className={`w-full p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <FiXCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-900">
              Payment link has expired
            </p>
            <p className="text-xs text-red-700 font-medium">
              Update your shipment to get a new payment link.
            </p>
          </div>
        </div>
        {onUpdateShipment && (
          <button
            onClick={onUpdateShipment}
            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shrink-0"
          >
            Update Shipment
          </button>
        )}
      </div>
    );
  }

  if (isExpiringSoon) {
    return (
      <div
        className={`w-full p-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center gap-3 ${className}`}
      >
        <div className="p-2 bg-yellow-100 rounded-xl">
          <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-yellow-900">
            Payment link expiring soon
          </p>
          <p className="text-xs text-yellow-700 font-medium">
            Time remaining: {renderTimeString()}
          </p>
        </div>
      </div>
    );
  }

  // Active (>24h)
  return (
    <div
      className={`w-full p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center gap-3 ${className}`}
    >
      <div className="p-2 bg-brand-blue/10 rounded-xl">
        <FiClock className="w-5 h-5 text-brand-blue" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-brand-blue">
          Payment link active
        </p>
        <p className="text-xs text-gray-600 font-medium">
          Expires in {renderTimeString()}
        </p>
      </div>
    </div>
  );
};

ExpirationCountdown.displayName = "ExpirationCountdown";
