/**
 * Invoice Summary Component
 *
 * Displays comprehensive invoice details in a modal or full page view.
 * Shows buyer/seller info, line items, totals, payment status, and actions.
 *
 * @module components/invoice/InvoiceSummary
 */

"use client";

import React from "react";
import { Invoice, PdfGenerationStatus, InvoiceLineItem } from "@/types/invoice";
import {
  formatAmount,
  formatInvoiceDate,
  buildAddressString,
  isInvoicePaid,
  formatTaxRate,
} from "@/utils/invoice-helpers";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { InvoiceActions } from "./InvoiceActionsNew";
import { Card } from "@/components/ui/card";

/**
 * Props for InvoiceSummary component
 */
interface InvoiceSummaryProps {
  /** Invoice data */
  invoice: Invoice;
  /** PDF generation status (READY or PENDING) */
  pdfGenerationStatus?: PdfGenerationStatus | string;
  /** Initial PDF download URL */
  pdfDownloadUrl?: string | null;
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
 * InvoiceSummary Component
 *
 * Full invoice details display:
 * - Invoice header (number, status, dates)
 * - Buyer and seller information
 * - Line items table with pricing
 * - Tax breakdown
 * - Total amounts
 * - Payment information
 * - Action buttons
 */
export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  invoice,
  pdfGenerationStatus = PdfGenerationStatus.PENDING,
  pdfDownloadUrl,
  onUpdate,
  onEmail,
  shipmentId,
  className = "",
}) => {
  const paid = isInvoicePaid(invoice.status);

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
      {/* Header Section */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Issued: {formatInvoiceDate(invoice.createdAt, false)}
            </p>
          </div>
          <div className="text-right">
            <InvoiceStatusBadge status={invoice.status} className="mb-2" />
            {paid && invoice.paidAt && (
              <p className="text-xs text-green-600 mt-2">
                Paid: {formatInvoiceDate(invoice.paidAt, false)}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Buyer & Seller Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buyer */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">Bill To (Buyer)</h3>
          <div className="text-sm space-y-1 text-foreground">
            <p className="font-medium">{invoice.buyerName}</p>
            <p>{buyerAddress}</p>
            {invoice.buyerNIP && (
              <p className="text-xs text-muted-foreground">
                VAT ID: {invoice.buyerNIP}
              </p>
            )}
          </div>
        </Card>

        {/* Seller */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-2">From (Seller)</h3>
          <div className="text-sm space-y-1 text-foreground">
            <p className="font-medium">{invoice.sellerCompanyName}</p>
            <p>{sellerAddress}</p>
            <p className="text-xs text-muted-foreground">
              NIP: {invoice.sellerNIP}
            </p>
          </div>
        </Card>
      </div>

      {/* Line Items Section */}
      <Card className="p-6 overflow-x-auto">
        <h3 className="font-semibold text-sm mb-4">Invoice Items</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-muted">
              <th className="text-left py-2 px-2 font-semibold">Description</th>
              <th className="text-center py-2 px-2 font-semibold">Qty</th>
              <th className="text-right py-2 px-2 font-semibold">
                Unit Price (Net)
              </th>
              <th className="text-right py-2 px-2 font-semibold">VAT %</th>
              <th className="text-right py-2 px-2 font-semibold">
                Amount (Gross)
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.lineItemId} className="border-b border-muted/50">
                <td className="py-3 px-2 text-foreground">
                  {item.serviceName}
                </td>
                <td className="text-center py-3 px-2 text-foreground">
                  {item.quantity} {item.unitOfMeasure}
                </td>
                <td className="text-right py-3 px-2 text-foreground font-mono">
                  {formatAmount(item.unitNetPrice, false)}
                </td>
                <td className="text-right py-3 px-2 text-foreground">
                  {formatTaxRate(item.taxRate)}
                </td>
                <td className="text-right py-3 px-2 text-foreground font-semibold font-mono">
                  {formatAmount(item.grossValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Totals Section */}
      <Card className="p-6 bg-muted/50">
        <div className="space-y-2 text-sm max-w-xs ms-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal (Net):</span>
            <span className="font-mono font-semibold">
              {formatAmount(invoice.totalNetAmount, false)} PLN
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (23%):</span>
            <span className="font-mono font-semibold">
              {formatAmount(invoice.totalVATAmount, false)} PLN
            </span>
          </div>

          <div className="flex justify-between text-base font-bold border-t border-muted pt-2 mt-2">
            <span className="text-foreground">Total Due:</span>
            <span className="font-mono text-lg text-foreground">
              {formatAmount(invoice.totalGrossAmount)} PLN
            </span>
          </div>
        </div>
      </Card>

      {/* Payment Information */}
      {!paid && invoice.paymentLinks && invoice.paymentLinks.length > 0 && (
        <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950">
          <h3 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
            Payment Information
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>
              Payment Link Expires:{" "}
              <span className="font-mono font-semibold">
                {formatInvoiceDate(invoice.paymentLinks[0].expiresAt)}
              </span>
            </p>
            <p className="text-xs">
              Please complete payment before the expiration date to avoid the
              link becoming invalid.
            </p>
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-4">
        <InvoiceActions
          invoice={invoice}
          pdfGenerationStatus={pdfGenerationStatus}
          pdfDownloadUrl={pdfDownloadUrl}
          onUpdate={onUpdate}
          onEmail={onEmail}
          shipmentId={shipmentId}
          className="justify-start"
        />
      </Card>
    </div>
  );
};

export default InvoiceSummary;
