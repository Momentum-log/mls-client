/**
 * Invoice Preview Component
 *
 * Shows invoice summary in shipment checkout flow with line items, tax breakdown,
 * and payment link information.
 *
 * @module components/invoice/InvoicePreview
 */

import React from "react";
import { Invoice } from "@/types/invoice";
import {
  formatInvoiceNumber,
  formatInvoiceAmount,
  isPaymentLinkExpired,
  getHoursUntilExpiration,
} from "@/utils/invoice-helper";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { cn } from "@/utils/cn";

/**
 * Props for InvoicePreview component
 */
interface InvoicePreviewProps {
  /** Invoice data to display */
  invoice: Invoice;
  /** Callback when "View Details" button clicked */
  onViewDetails?: () => void;
  /** Whether to show payment link regeneration prompt */
  showPaymentLinkWarning?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Compact invoice preview component for checkout flow
 *
 * Displays:
 * - Invoice number and status
 * - Line items summary
 * - Tax breakdown
 * - Total gross amount
 * - Payment link expiration
 *
 * @example
 * ```tsx
 * <InvoicePreview
 *   invoice={invoiceData}
 *   onViewDetails={() => openModal()}
 * />
 * ```
 */
export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onViewDetails,
  showPaymentLinkWarning = false,
  className,
}) => {
  const paymentLink = invoice.paymentLinks?.[0];
  const isExpired = paymentLink
    ? isPaymentLinkExpired(paymentLink.expiresAt)
    : false;
  const hoursUntilExpiration = paymentLink
    ? getHoursUntilExpiration(paymentLink.expiresAt)
    : 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
      role="region"
      aria-label="Invoice Preview"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {formatInvoiceNumber(invoice.invoiceNumber)}
          </h3>
          <p className="text-sm text-gray-500">Invoice Preview</p>
        </div>
        <InvoiceStatusBadge status={invoice.status} small />
      </div>

      {/* Line Items */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Items</h4>
        <div className="space-y-2">
          {invoice.lineItems.map((item, idx) => (
            <div
              key={item.lineItemId}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-600">
                {item.serviceName} x {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                {formatInvoiceAmount(item.grossValue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Breakdown */}
      {invoice.totalVATAmount > 0 && (
        <div className="mb-4 border-t border-gray-200 pt-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600">Net Amount</span>
            <span className="text-gray-900">
              {formatInvoiceAmount(invoice.totalNetAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">VAT (23%)</span>
            <span className="text-gray-900">
              {formatInvoiceAmount(invoice.totalVATAmount)}
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="mb-4 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatInvoiceAmount(invoice.totalGrossAmount)}
          </span>
        </div>
      </div>

      {/* Payment Link Status */}
      {paymentLink && (
        <div
          className={cn(
            "mb-4 rounded-md p-3 text-sm",
            isExpired
              ? "bg-red-50 text-red-800"
              : hoursUntilExpiration < 24
                ? "bg-yellow-50 text-yellow-800"
                : "bg-blue-50 text-blue-800",
          )}
        >
          {isExpired ? (
            <>
              <p className="font-medium">Payment link has expired</p>
              <p className="text-xs">
                Please regenerate to proceed with payment.
              </p>
            </>
          ) : hoursUntilExpiration < 24 ? (
            <>
              <p className="font-medium">Payment link expires soon</p>
              <p className="text-xs">
                Expires in {hoursUntilExpiration} hour(s)
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Ready for payment</p>
              <p className="text-xs">Expires in {hoursUntilExpiration} hours</p>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="View invoice details"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

InvoicePreview.displayName = "InvoicePreview";
