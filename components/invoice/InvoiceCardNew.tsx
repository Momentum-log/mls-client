/**
 * Invoice Card Component
 *
 * Displays a compact inline invoice card for shipment details view.
 * Shows invoice number, status badge, total amount, and quick action buttons.
 *
 * @module components/invoice/InvoiceCard
 */

"use client";

import React from "react";
import { Invoice, PdfGenerationStatus } from "@/types/invoice";
import {
  formatAmount,
  formatInvoiceDate,
  isInvoicePaid,
} from "@/utils/invoice-helpers";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { InvoiceActions } from "./InvoiceActionsNew";
import { Card } from "@/components/ui/card";

/**
 * Props for InvoiceCard component
 */
interface InvoiceCardProps {
  /** Invoice data */
  invoice: Invoice;
  /** PDF generation status (READY or PENDING) */
  pdfGenerationStatus?: PdfGenerationStatus | string;
  /** Initial PDF download URL */
  pdfDownloadUrl?: string | null;
  /** Callback when entire card is clicked (opens full invoice) */
  onCardClick?: () => void;
  /** Callback when "Update Invoice Now" is clicked */
  onUpdate?: (invoiceId: string, shipmentId: string) => void;
  /** Callback when "Email Invoice" is clicked */
  onEmail?: (invoiceId: string, recipientEmail?: string) => void;
  /** Related shipment ID (for Update flow) */
  shipmentId?: string;
  /** Optional CSS classes */
  className?: string;
}

/**
 * InvoiceCard Component
 *
 * Compact invoice display for shipment details:
 * - Invoice number and status badge
 * - Total amount and tax breakdown
 * - Quick action buttons (Download, Email, Update, Pay)
 * - Clickable to open full invoice modal
 */
export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  pdfGenerationStatus = PdfGenerationStatus.PENDING,
  pdfDownloadUrl,
  onCardClick,
  onUpdate,
  onEmail,
  shipmentId,
  className = "",
}) => {
  const paid = isInvoicePaid(invoice.status);

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onCardClick) {
          onCardClick();
        }
      }}
    >
      {/* Header: Invoice Number + Status + Total */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-mono font-bold text-foreground">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatInvoiceDate(invoice.createdAt, false)}
          </p>
        </div>

        <InvoiceStatusBadge status={invoice.status} className="ml-2" />
      </div>

      {/* Amount and Tax */}
      <div className="mb-3 bg-muted/50 rounded p-2">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-muted-foreground">Total:</span>
          <span className="text-lg font-bold text-foreground font-mono">
            {formatAmount(invoice.totalGrossAmount)}
          </span>
        </div>
        <div className="flex justify-between items-baseline mt-1">
          <span className="text-xs text-muted-foreground">
            Tax ({invoice.totalVATAmount > 0 ? "23%" : "0%"}):
          </span>
          <span className="text-xs text-muted-foreground">
            {formatAmount(invoice.totalVATAmount, false)}
          </span>
        </div>
      </div>

      {/* Quick Actions - Stop propagation to prevent card click */}
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InvoiceActions
          invoice={invoice}
          pdfGenerationStatus={pdfGenerationStatus}
          pdfDownloadUrl={pdfDownloadUrl}
          onUpdate={onUpdate}
          onEmail={onEmail}
          shipmentId={shipmentId}
          className="p-0"
        />
      </div>

      {/* Paid Status Note */}
      {paid && (
        <div className="mt-3 pt-3 border-t border-muted text-xs text-green-600 flex items-center gap-1">
          <span>✓</span>
          <span>
            Payment received on{" "}
            {formatInvoiceDate(invoice.paidAt || invoice.updatedAt, false)}
          </span>
        </div>
      )}
    </Card>
  );
};

export default InvoiceCard;
