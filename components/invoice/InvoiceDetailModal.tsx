/**
 * Invoice Detail Modal Component
 *
 * Full-page modal displaying complete invoice details with tabs, action buttons,
 * and payment link management. Shows line items, payment history, and audit trail.
 *
 * @module components/invoice/InvoiceDetailModal
 */

import React, { useState } from "react";
import { Invoice } from "@/types/invoice";
import {
  formatInvoiceNumber,
  formatInvoiceAmount,
  formatDate,
  getFullAddress,
  isPaymentLinkExpired,
  getHoursUntilExpiration,
} from "@/utils/invoice-helper";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { cn } from "@/utils/cn";

/**
 * Props for InvoiceDetailModal component
 */
interface InvoiceDetailModalProps {
  /** Invoice data to display */
  invoice: Invoice;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when download button clicked */
  onDownload?: () => void;
  /** Callback when email button clicked */
  onEmail?: () => void;
  /** Callback when regenerate payment link button clicked */
  onRegeneratePaymentLink?: () => void;
  /** Whether modal is open */
  isOpen?: boolean;
  /** Loading state for download button */
  isDownloading?: boolean;
  /** Loading state for email button */
  isSendingEmail?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

type TabType = "details" | "payments" | "audit";

/**
 * Modal component displaying full invoice details
 *
 * Features:
 * - Three tabs: Details, Payment History, Audit Trail
 * - Line items table with rates and amounts
 * - Customer and vendor information
 * - Action buttons: Download PDF, Send Email, Regenerate Payment Link
 * - Payment link status with expiration countdown
 *
 * @example
 * ```tsx
 * <InvoiceDetailModal
 *   invoice={invoiceData}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onDownload={handleDownload}
 *   onEmail={handleEmail}
 * />
 * ```
 */
export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onDownload,
  onEmail,
  onRegeneratePaymentLink,
  isOpen = true,
  isDownloading = false,
  isSendingEmail = false,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("details");

  if (!isOpen) return null;

  const paymentLink = invoice.paymentLinks?.[0];
  const isExpired = paymentLink
    ? isPaymentLinkExpired(paymentLink.expiresAt)
    : false;
  const hoursUntilExpiration = paymentLink
    ? getHoursUntilExpiration(paymentLink.expiresAt)
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="w-full max-w-3xl rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {formatInvoiceNumber(invoice.invoiceNumber)}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(invoice.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <InvoiceStatusBadge status={invoice.status} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {(["details", "payments", "audit"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "border-b-2 px-1 py-4 text-sm font-medium capitalize transition-colors",
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900",
                  )}
                >
                  {tab === "audit" ? "Audit Trail" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Customer & Vendor Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                      From
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{invoice.sellerCompanyName}</p>
                      <p>
                        {getFullAddress(
                          invoice.sellerStreet,
                          invoice.sellerBuildingNumber,
                          invoice.sellerApartmentNumber,
                          invoice.sellerPostalCode,
                          invoice.sellerCity,
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">
                      Bill To
                    </h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{invoice.buyerName}</p>
                      <p>
                        {getFullAddress(
                          invoice.buyerStreet,
                          invoice.buyerBuildingNumber,
                          invoice.buyerApartmentNumber,
                          invoice.buyerPostalCode,
                          invoice.buyerCity,
                        )}
                      </p>
                      <p>{invoice.customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Line Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-2 text-left text-gray-700">
                            Service
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            Rate
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            VAT%
                          </th>
                          <th className="px-4 py-2 text-right text-gray-700">
                            Gross
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.lineItems.map((item) => (
                          <tr
                            key={item.lineItemId}
                            className="border-b border-gray-100"
                          >
                            <td className="px-4 py-3">{item.serviceName}</td>
                            <td className="px-4 py-3 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {formatInvoiceAmount(item.unitNetPrice)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {item.taxRate}%
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {formatInvoiceAmount(item.grossValue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Net Amount</span>
                    <span className="font-medium text-gray-900">
                      {formatInvoiceAmount(invoice.totalNetAmount)}
                    </span>
                  </div>
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="text-gray-600">VAT (23%)</span>
                    <span className="font-medium text-gray-900">
                      {formatInvoiceAmount(invoice.totalVATAmount)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatInvoiceAmount(invoice.totalGrossAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Link Status */}
                {paymentLink && (
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      isExpired
                        ? "bg-red-50 text-red-800"
                        : hoursUntilExpiration < 24
                          ? "bg-yellow-50 text-yellow-800"
                          : "bg-blue-50 text-blue-800",
                    )}
                  >
                    <p className="font-medium">
                      {isExpired
                        ? "Payment link expired"
                        : hoursUntilExpiration < 24
                          ? "Payment link expires soon"
                          : "Payment link is active"}
                    </p>
                    <p className="text-sm">
                      {isExpired
                        ? "This payment link can no longer be used."
                        : `Expires in ${hoursUntilExpiration} hour(s)`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="space-y-4">
                {invoice.paymentLinks && invoice.paymentLinks.length > 0 ? (
                  <div className="space-y-3">
                    {invoice.paymentLinks.map((link) => (
                      <div
                        key={link.paymentLinkId}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {link.status === "PENDING"
                              ? "Awaiting Payment"
                              : "Payment Confirmed"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {formatDate(link.expiresAt)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium",
                            link.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800",
                          )}
                        >
                          {link.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    No payment records yet
                  </p>
                )}
              </div>
            )}

            {/* Audit Tab */}
            {activeTab === "audit" && (
              <div className="space-y-2">
                <p className="text-center text-sm text-gray-500">
                  No audit history available
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
            {onDownload && (
              <button
                onClick={onDownload}
                disabled={isDownloading}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Download PDF"
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
            )}
            {onEmail && (
              <button
                onClick={onEmail}
                disabled={isSendingEmail}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Send email"
              >
                {isSendingEmail ? "Sending..." : "Send Email"}
              </button>
            )}
            {onRegeneratePaymentLink && isExpired && (
              <button
                onClick={onRegeneratePaymentLink}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Regenerate payment link"
              >
                Regenerate Link
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

InvoiceDetailModal.displayName = "InvoiceDetailModal";
