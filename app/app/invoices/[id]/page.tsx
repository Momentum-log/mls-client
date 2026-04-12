/**
 * Invoice Detail Page
 *
 * Dedicated page that displays the full receipt-style invoice UI.
 * Reached after shipment creation or by clicking "View Full Invoice"
 * from the shipment details drawer.
 *
 * Features:
 * - Receipt-style invoice layout (InvoiceReceiptView)
 * - Expiration countdown timer
 * - Pay Now, Download PDF, Send via Email actions
 * - Update Shipment modal for PENDING/EXPIRED invoices
 *
 * @module app/app/invoices/[id]/page
 */

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PdfGenerationStatus } from "@/types/invoice";
import { InvoiceReceiptView } from "@/components/invoice/InvoiceReceiptView";
import { UpdateShipmentModal } from "@/components/invoice/UpdateShipmentModal";
import { useToast } from "@/hooks/use-toast";
import { FiArrowLeft, FiInfo } from "react-icons/fi";
import Button from "@/components/ui/button";
import { useGetInvoice } from "@/hooks/invoices/use-invoices-api";

/**
 * InvoiceDetailPage Component
 *
 * Fetches invoice data using React Query and displays the receipt-style UI
 * with all CTAs (Pay, Download, Email) and the Update Shipment modal.
 */
export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const invoiceId = params?.id as string;

  // Fetch invoice using React Query hook
  const {
    data: invoiceResponse,
    isPending: isGettingInvoice,
    error: gettingInvoiceError,
    isError: isGetInvoiceError,
  } = useGetInvoice(invoiceId);

  // Extract invoice from response
  const invoice = invoiceResponse?.data?.details;

  const handleUpdateSuccess = () => {
    addToast({
      title: "Shipment Updated",
      message: "Your shipment details have been updated successfully.",
      type: "success",
    });
  };

  const [shipmentData, setShipmentData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  /**
   * Handle successful update from the UpdateShipmentModal
   */

  // Loading skeleton
  if (isGettingInvoice) {
    return (
      <div className="container mx-auto py-12 max-w-3xl px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
          <div className="h-16 w-full bg-gray-100 rounded-2xl" />
          <div className="h-96 w-full bg-gray-100 rounded-3xl" />
          <div className="h-14 w-full bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (isGetInvoiceError || gettingInvoiceError) {
    return (
      <div className="container mx-auto py-20 max-w-lg px-4 text-center">
        <div className="bg-red-50 border border-red-100 p-10 rounded-3xl">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiInfo className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-red-900 mb-2">
            Invoice Not Found
          </h3>
          <p className="text-red-700 font-medium mb-6">
            {gettingInvoiceError?.message ||
              "We could not find the invoice you requested."}
          </p>
          <Button
            onClick={() => router.push("/app/invoices")}
            variant="primary"
            className="rounded-2xl"
          >
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  // Get shipmentId from localStorage or from the invoice context
  const shipmentId = localStorage.getItem("lastShipmentId") || "";

  // Derive PDF status from invoice data (no state needed)
  const pdfGenerationStatus = invoice?.paymentLink
    ? PdfGenerationStatus.READY
    : PdfGenerationStatus.PENDING;

  const pdfDownloadUrl = invoice?.paymentLink || null;

  return (
    <div className="container mx-auto py-12 max-w-3xl px-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold">Back</span>
      </button>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Invoice
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Review your invoice and proceed to payment.
        </p>
      </div>

      {/* Receipt View */}
      <InvoiceReceiptView
        invoice={invoice}
        pdfGenerationStatus={pdfGenerationStatus}
        pdfDownloadUrl={pdfDownloadUrl as string | null}
        shipmentId={shipmentId}
        onUpdateShipment={
          shipmentData ? () => setShowUpdateModal(true) : undefined
        }
      />

      {/* Update Shipment Modal */}
      {shipmentData && shipmentId && (
        <UpdateShipmentModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          shipment={shipmentData}
          shipmentId={shipmentId}
          invoiceId={invoiceId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
