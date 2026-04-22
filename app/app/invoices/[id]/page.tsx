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
// import { PdfGenerationStatus } from "@/types/invoice";
import { InvoiceReceiptView } from "@/components/invoice/InvoiceReceiptView";
import { UpdateShipmentModal } from "@/components/invoice/UpdateShipmentModal";
import { useToast } from "@/hooks/use-toast";
import { FiArrowLeft, FiRefreshCw, FiTruck } from "react-icons/fi";
import Button from "@/components/ui/button";
import { useGetInvoice } from "@/hooks/invoices/use-invoices-api";
import { FaCircleInfo } from "react-icons/fa6";
import { useAuthStore } from "@/store/auth-store";

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
  const { user } = useAuthStore();
  const invoiceId = params?.id as string;

  // Fetch invoice using React Query hook
  const {
    data: invoiceResponse,
    isPending: isGettingInvoice,
    error: gettingInvoiceError,
    isError: isGetInvoiceError,
  } = useGetInvoice(invoiceId);

  // Extract invoice and shipment from response
  const invoice = invoiceResponse?.data?.details;
  const shipment = invoiceResponse?.data?.shipment;

  const pickupLabel = shipment
    ? [shipment.pickupAddress?.streetLines?.[0], shipment.pickupAddress?.city]
        .filter(Boolean)
        .join(", ")
    : "";
  const dropoffLabel = shipment
    ? [shipment.dropoffAddress?.streetLines?.[0], shipment.dropoffAddress?.city]
        .filter(Boolean)
        .join(", ")
    : "";
  const serviceDescription = shipment
    ? `MLS Logistics from ${pickupLabel || "pickup"} to ${dropoffLabel || "destination"}`
    : "Logistics";
  const itemQuantity = shipment?.packages?.length || 1;

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Check if invoice is expired
  const isInvoiceExpired = invoice?.isExpired ?? false;

  const handleUpdateSuccess = () => {
    addToast({
      title: "Shipment Updated",
      message: "Your shipment details have been updated successfully.",
      type: "success",
    });
  };

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
            <FaCircleInfo className="w-10 h-10" />
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

  // // Derive PDF status from invoice data (no state needed)
  // const pdfGenerationStatus = invoice?.paymentLink
  //   ? PdfGenerationStatus.READY
  //   : PdfGenerationStatus.PENDING;

  // const pdfDownloadUrl = invoice?.paymentLink || null;

  return (
    <div className="container mx-auto py-12 max-w-4xl px-4">
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

      {/* Shipment Info Card (if shipment exists) */}
      {shipment && (
        <div className="bg-linear-to-br from-brand-blue/5 to-brand-blue/10 border border-brand-blue/20 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-blue/10 rounded-xl shrink-0">
                <FiTruck className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Shipment Details
                </p>
                <h3 className="font-bold text-gray-900 mb-2">
                  {shipment.serviceName || shipment.serviceType || "Shipment"}
                </h3>
                {shipment.customTrackingNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Tracking:</span>{" "}
                    <span className="font-mono text-brand-blue">
                      {shipment.customTrackingNumber}
                    </span>
                  </p>
                )}
              </div>
            </div>
            {isInvoiceExpired && (
              <Button
                onClick={() => setShowUpdateModal(true)}
                variant="primary"
                className="shrink-0 h-12 rounded-xl font-bold flex items-center gap-2 cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4" />
                Update Shipment
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Receipt View */}
      <InvoiceReceiptView
        invoice={invoice}
        // pdfGenerationStatus={pdfGenerationStatus}
        // pdfDownloadUrl={pdfDownloadUrl as string | null}
        shipmentId={shipment?.id}
        recipientName={user?.name}
        recipientAddress={user?.address ?? null}
        itemQuantity={itemQuantity}
        serviceDescription={serviceDescription}
      />

      {/* Update Shipment Modal */}
      {shipment && (
        <UpdateShipmentModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          shipment={shipment}
          shipmentId={shipment.id}
          invoiceId={invoiceId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
