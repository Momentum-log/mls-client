/**
 * Invoice Receipt Component
 *
 * Displays post-payment confirmation for a paid invoice.
 * Used in success pages or payment confirmation modals.
 *
 * @module components/invoice/InvoiceReceipt
 */

"use client";

import React from "react";
import { Invoice } from "@/types/invoice";
import {
  formatAmount,
  formatInvoiceDate,
  buildAddressString,
} from "@/utils/invoice-helpers";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Props for InvoiceReceipt component
 */
interface InvoiceReceiptProps {
  /** Invoice data (should be paid) */
  invoice: Invoice;
  /** Optional transaction/confirmation ID */
  transactionId?: string;
  /** Optional payment method (e.g., "Credit Card", "PayU") */
  paymentMethod?: string;
  /** Callback for download button */
  onDownload?: () => void;
  /** Callback for email button */
  onEmail?: () => void;
  /** Callback for view details button */
  onViewDetails?: () => void;
  /** Optional CSS classes */
  className?: string;
}

/**
 * InvoiceReceipt Component
 *
 * Compact post-payment confirmation showing:
 * - Success status indicator
 * - Invoice number and amount
 * - Payment date and transaction ID
 * - Buyer/seller summary
 * - Quick action buttons
 */
export const InvoiceReceipt: React.FC<InvoiceReceiptProps> = ({
  invoice,
  transactionId,
  paymentMethod,
  onDownload,
  onEmail,
  onViewDetails,
  className = "",
}) => {
  const buyerAddress = buildAddressString(
    invoice.buyerStreet,
    invoice.buyerBuildingNumber,
    invoice.buyerCity,
    invoice.buyerPostalCode,
    invoice.buyerApartmentNumber,
  );

  const sellerAddress = buildAddressString(
    invoice.sellerStreet,
    invoice.sellerBuildingNumber,
    invoice.sellerCity,
    invoice.sellerPostalCode,
    invoice.sellerApartmentNumber,
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Success Header */}
      <Card className="p-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
            Payment Received
          </h2>
          <p className="text-sm text-green-700 dark:text-green-300">
            Thank you! Your payment has been successfully processed.
          </p>
        </div>
      </Card>

      {/* Invoice Summary */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
            <p className="text-lg font-bold font-mono mb-4">
              {invoice.invoiceNumber}
            </p>

            <p className="text-xs text-muted-foreground mb-1">Issued Date</p>
            <p className="text-sm font-medium mb-4">
              {formatInvoiceDate(invoice.createdAt, false)}
            </p>
          </div>

          <div className="text-right md:text-right">
            <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-foreground mb-4">
              {formatAmount(invoice.totalGrossAmount)}
            </p>

            <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
            <div className="flex justify-end">
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="p-4 space-y-3">
        <h3 className="font-semibold text-sm">Payment Details</h3>

        <div className="space-y-2 text-sm py-2 border-y border-muted">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Date:</span>
            <span className="font-medium">
              {invoice.paidAt
                ? formatInvoiceDate(invoice.paidAt, false)
                : "N/A"}
            </span>
          </div>

          {transactionId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-mono text-xs">{transactionId}</span>
            </div>
          )}

          {paymentMethod && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount (Net):</span>
            <span className="font-mono">
              {formatAmount(invoice.totalNetAmount, false)} PLN
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (23%):</span>
            <span className="font-mono">
              {formatAmount(invoice.totalVATAmount, false)} PLN
            </span>
          </div>
          <div className="flex justify-between font-bold border-t border-muted pt-1 mt-1">
            <span>Total Paid:</span>
            <span className="font-mono">
              {formatAmount(invoice.totalGrossAmount)} PLN
            </span>
          </div>
        </div>
      </Card>

      {/* Party Information (Compact) */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold mb-2 text-foreground">Bill To</p>
            <div className="space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{invoice.buyerName}</p>
              <p>{buyerAddress}</p>
              {invoice.buyerNIP && (
                <p className="text-xs">VAT ID: {invoice.buyerNIP}</p>
              )}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-2 text-foreground">From</p>
            <div className="space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">
                {invoice.sellerCompanyName}
              </p>
              <p>{sellerAddress}</p>
              <p className="text-xs">NIP: {invoice.sellerNIP}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {onDownload && (
            <Button
              onClick={onDownload}
              variant="default"
              size="sm"
              className="flex-1"
            >
              Download Invoice
            </Button>
          )}

          {onEmail && (
            <Button
              onClick={onEmail}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Email Receipt
            </Button>
          )}

          {onViewDetails && (
            <Button
              onClick={onViewDetails}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              View Full Invoice
            </Button>
          )}
        </div>
      </Card>

      {/* Footer Note */}
      <Card className="p-4 bg-muted/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          A payment confirmation has been sent to your email address. If you
          don't see it, please check your spam folder. For support, contact our
          customer service team.
        </p>
      </Card>
    </div>
  );
};

export default InvoiceReceipt;
