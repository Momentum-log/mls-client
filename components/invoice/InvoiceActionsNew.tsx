/**
 * Invoice Actions Component
 *
 * Provides action buttons for invoice management:
 * - Download PDF (with PDF generation status checking)
 * - Email invoice
 * - Update invoice (conditional, shown only for PENDING/EXPIRED)
 * - Pay now (conditional, shown only for PENDING/EXPIRED)
 *
 * @module components/invoice/InvoiceActions
 */

"use client";

import React, { useState, useCallback } from "react";
import { Invoice, InvoiceStatus, PdfGenerationStatus } from "@/types/invoice";
import { usePdfStatus } from "@/hooks/invoices/usePdfStatus";
import {
  canUpdateInvoice,
  canPayInvoice,
  formatExpirationTime,
} from "@/utils/invoice-helpers";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

/**
 * Props for InvoiceActions component
 */
interface InvoiceActionsProps {
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
  /** Optional shipment ID (for Update flow) */
  shipmentId?: string;
  /** Optional CSS classes */
  className?: string;
}

/**
 * InvoiceActions Component
 *
 * Renders action buttons for invoice management with smart visibility:
 * - Download: Always available (shows loading if PDF pending)
 * - Email: Always available (secondary styling)
 * - Update: Only for PENDING/EXPIRED invoices
 * - Pay: Only for PENDING/EXPIRED invoices (prominent CTA)
 */
export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  pdfGenerationStatus = PdfGenerationStatus.PENDING,
  pdfDownloadUrl,
  onUpdate,
  onEmail,
  shipmentId,
  className = "",
}) => {
  const { toast } = useToast();
  const [emailLoading, setEmailLoading] = useState(false);

  // Use PDF status hook for checking PDF availability
  const {
    pdfUrl,
    isReady,
    isLoading,
    error: pdfError,
    retry: retryPdf,
  } = usePdfStatus(
    invoice.invoiceId,
    pdfGenerationStatus as PdfGenerationStatus,
    pdfDownloadUrl,
  );

  const canUpdate = canUpdateInvoice(invoice.status);
  const canPay = canPayInvoice(invoice.status);
  const isPaid = invoice.status === InvoiceStatus.PAID;

  /**
   * Handle download button click
   */
  const handleDownload = useCallback(async () => {
    if (pdfUrl) {
      // Open PDF in new tab or download
      window.open(pdfUrl, "_blank");
      toast({
        title: "Download Started",
        message: "Your invoice PDF is being downloaded.",
      });
    } else if (pdfError) {
      // Show error
      toast({
        title: "Download Error",
        message:
          pdfError.message || "Could not download PDF. Please try again.",
        type: "error",
      });
    }
  }, [pdfUrl, pdfError, toast]);

  /**
   * Handle email button click
   */
  const handleEmail = useCallback(async () => {
    if (!onEmail) {
      // Fallback: use internal email function
      setEmailLoading(true);
      try {
        const response = await fetch(
          `/api/invoices/${invoice.invoiceId}/email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAccessToken()}`,
            },
            body: JSON.stringify({
              recipientEmail: invoice.customerEmail,
            }),
          },
        );

        if (response.status === 200 || response.status === 202) {
          toast({
            title: "Invoice Sent",
            message:
              response.status === 202
                ? "Invoice will be sent when PDF is ready."
                : "Invoice sent to " + invoice.customerEmail,
          });
        } else {
          throw new Error("Failed to send invoice");
        }
      } catch (err) {
        toast({
          title: "Error",
          message:
            err instanceof Error ? err.message : "Failed to send invoice",
          type: "error",
        });
      } finally {
        setEmailLoading(false);
      }
    } else {
      onEmail(invoice.invoiceId, invoice.customerEmail);
    }
  }, [invoice, onEmail, toast]);

  /**
   * Handle update button click
   */
  const handleUpdate = useCallback(() => {
    if (onUpdate && shipmentId) {
      onUpdate(invoice.invoiceId, shipmentId);
    } else {
      toast({
        title: "Error",
        message: "Cannot update invoice: missing shipment ID",
        type: "error",
      });
    }
  }, [invoice.invoiceId, shipmentId, onUpdate, toast]);

  /**
   * Handle pay button click
   */
  const handlePay = useCallback(() => {
    if (invoice.paymentLinks && invoice.paymentLinks.length > 0) {
      const activeLink = invoice.paymentLinks.find(
        (link) => link.status === "active",
      );
      if (activeLink) {
        window.open(activeLink.paymentLinkUrl, "_blank");
        return;
      }
    }

    // Fallback to direct payment link
    if (invoice.paymentLinks?.[0]?.paymentLinkUrl) {
      window.open(invoice.paymentLinks[0].paymentLinkUrl, "_blank");
    }
  }, [invoice.paymentLinks]);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Download Invoice Button */}
      <Button
        variant="default"
        size="sm"
        onClick={handleDownload}
        disabled={isLoading || (pdfError !== null && !isReady)}
        className="min-w-max"
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {pdfError && !isReady
          ? "❌ PDF Error"
          : isLoading
            ? "Generating..."
            : "📄 Download"}
      </Button>

      {/* Retry PDF Button (if error) */}
      {pdfError && !isReady && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => retryPdf()}
          className="min-w-max"
        >
          Retry
        </Button>
      )}

      {/* Email Invoice Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleEmail}
        disabled={emailLoading}
        className="min-w-max"
      >
        {emailLoading && <Spinner className="mr-2 h-4 w-4" />}
        📧 Email
      </Button>

      {/* Expiration Timer (if not paid) */}
      {!isPaid && invoice.paymentLinks?.[0] && (
        <div className="flex items-center text-xs text-muted-foreground">
          <span>
            ⏱️ {formatExpirationTime(invoice.paymentLinks[0].expiresAt)}
          </span>
        </div>
      )}

      {/* Update Invoice Button (conditional) */}
      {canUpdate && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUpdate}
          className="min-w-max"
          title="Update invoice with new rates"
        >
          🔄 Update Now
        </Button>
      )}

      {/* Pay Now Button (prominent CTA) */}
      {canPay && (
        <Button
          variant="default"
          size="sm"
          onClick={handlePay}
          className="min-w-max font-semibold"
        >
          💳 Pay Now
        </Button>
      )}

      {/* Paid Status (no actions) */}
      {isPaid && (
        <div className="flex items-center text-xs text-green-600">
          <span>✓ Paid</span>
        </div>
      )}
    </div>
  );
};

/**
 * Get access token from auth context or local storage
 * @internal
 */
function getAccessToken(): string {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) return token;
  }
  return "";
}

export default InvoiceActions;
