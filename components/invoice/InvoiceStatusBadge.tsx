/**
 * Invoice Status Badge Component
 *
 * Small reusable badge showing invoice status with color-coded styling.
 *
 * @module components/invoice/InvoiceStatusBadge
 */

import React from "react";
import { InvoiceStatus } from "@/types/invoice";
import { getInvoiceStatusLabel } from "@/utils/invoice-helper";
import { cn } from "@/utils/cn";

/**
 * Props for InvoiceStatusBadge component
 */
interface InvoiceStatusBadgeProps {
  /** Invoice status to display */
  status: InvoiceStatus | string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom label (overrides default label) */
  label?: string;
  /** Whether to show as small badge or normal (default: false) */
  small?: boolean;
}

/**
 * Badge component for displaying invoice status
 *
 * Shows status with color-coded background:
 * - PENDING: Yellow/Warning
 * - EXPIRED: Gray/Muted
 * - PAID: Green/Success
 *
 * @example
 * ```tsx
 * <InvoiceStatusBadge status={InvoiceStatus.PENDING} />
 * <InvoiceStatusBadge status={InvoiceStatus.PAID} small />
 * ```
 */
export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  status,
  className,
  label,
  small = false,
}) => {
  const displayLabel = label || getInvoiceStatusLabel(status);

  // Map status colors to CSS classes
  const getStatusClass = () => {
    switch (status) {
      case InvoiceStatus.PENDING:
        return "bg-brand-yellow/15 text-foreground border border-brand-yellow/40";
      case InvoiceStatus.EXPIRED:
        return "bg-accent-light/25 text-accent-dark border border-accent-light";
      case InvoiceStatus.PAID:
        return "bg-brand-blue/15 text-brand-blue border border-brand-blue/35";
      default:
        return "bg-accent-light/20 text-foreground border border-accent-light";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        small ? "px-2 py-1 text-xs" : "px-3 py-1 text-sm",
        getStatusClass(),
        className,
      )}
      role="status"
      aria-label={`Invoice status: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
};

InvoiceStatusBadge.displayName = "InvoiceStatusBadge";
