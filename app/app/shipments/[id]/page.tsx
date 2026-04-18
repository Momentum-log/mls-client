"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useGetShipment } from "@/hooks/shipments/use-shipments";
import { useDuplicateShipment } from "@/hooks/shipments/use-duplicate-shipment";
import { useAuth } from "@/hooks/useAuth";
import { deepTransformData } from "@/utils/data-transform";
import TrackingOverview from "@/components/tracking/TrackingOverview";
import TrackingDetails from "@/components/tracking/TrackingDetails";
import TrackingTimelineView from "@/components/tracking/TrackingTimelineView";
import { TrackingResponse } from "@/types/shipping";
import { InvoiceDrawer, UpdateShipmentModal } from "@/components/invoice";
import { CreateShipmentResponse } from "@/types/invoice";
import Button from "@/components/ui/button";
import { FiBox, FiInfo, FiCopy, FiDownload, FiFileText } from "react-icons/fi";

/**
 * ShipmentDetailsPage Component
 * Displays comprehensive shipment data and tracking history for a specific ID.
 * Integrates live tracking data and physical shipment details.
 */
export default function ShipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Fetch shipment and tracking data
  const { data: rawData, isLoading, error } = useGetShipment(id);
  const { duplicateShipment } = useDuplicateShipment();
  const { user } = useAuth();

  // Invoice drawer & update modal state
  const [isInvoiceDrawerOpen, setIsInvoiceDrawerOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  /**
   * Handles successful update from the UpdateShipmentModal.
   * Stores new IDs and could trigger a page refresh.
   */
  const handleUpdateSuccess = useCallback(
    (data: CreateShipmentResponse) => {
      if (data?.shipmentId) {
        localStorage.setItem("lastShipmentId", data.shipmentId);
      }
      // Redirect to the updated invoice page
      if (data?.invoice?.id) {
        router.push(`/app/invoices/${data.invoice.id}`);
      }
    },
    [router],
  );

  // Transform and map data
  const { shipment, trackingResponse } = useMemo(() => {
    if (!rawData) return { shipment: null, trackingResponse: null };

    // Apply branding transformation (FedEx -> MLS)
    const cleanedData = deepTransformData(rawData);

    // FIX: Ensure label URL points to FedEx (replace mls.com with fedex.com if present)
    if (cleanedData.labelUrl) {
      cleanedData.labelUrl = cleanedData.labelUrl.replace(
        "mls.com",
        "fedex.com",
      );
    }

    // If shipment failed or cancelled, do not show tracking data
    if (
      cleanedData.shipmentStatus === "FAILED" ||
      cleanedData.shipmentStatus === "CANCELLED" ||
      cleanedData.shipmentStatus === "CREATED"
    ) {
      return {
        shipment: cleanedData,
        trackingResponse: null,
      };
    }

    // Reconstruct TrackingResponse for the sub-components if tracking data exists
    const trackingData = cleanedData.tracking;
    const tr: TrackingResponse | null = trackingData
      ? {
          trackingNumber:
            trackingData.trackingNumber ||
            cleanedData.customTrackingNumber ||
            cleanedData.carrierTrackingNumber ||
            "",
          carrier: cleanedData.carrier?.name || "MLS",
          status: trackingData.status || cleanedData.shipmentStatus,
          timeline: trackingData.timeline || [],
          shipment: cleanedData,
        }
      : null;

    return {
      shipment: cleanedData,
      trackingResponse: tr,
    };
  }, [rawData]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 max-w-5xl px-4">
        <div className="space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-100 rounded mb-4"></div>
          <div className="h-32 w-full bg-gray-100 rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-100 rounded-2xl"></div>
            </div>
            <div className="h-64 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="container mx-auto py-20 max-w-lg px-4 text-center">
        <div className="bg-red-50 border border-red-100 p-10 rounded-3xl">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiInfo className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-red-900 mb-2">
            Shipment Not Found
          </h3>
          <p className="text-red-700 font-medium">
            {error instanceof Error
              ? error.message
              : "We couldn't retrieve the details for this shipment ID. Please verify the ID and try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-6xl px-4">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Shipment Journey
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Complete delivery path and package specifications.
          </p>
        </div>

        <div className="flex gap-3">
          {shipment.labelUrl && (
            <a
              href={shipment.labelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="shrink-0 bg-white">
                <FiDownload className="mr-2" /> Download Label
              </Button>
            </a>
          )}
          <Button
            onClick={() => shipment && duplicateShipment(shipment)}
            className="shrink-0"
          >
            <FiCopy className="mr-2" /> Ship Again
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content: Tracking & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col gap-8">
              {/* Status Banner for Failed/Cancelled */}
              {/* Status Banner for Failed/Cancelled/Created */}
              {(shipment.shipmentStatus === "FAILED" ||
                shipment.shipmentStatus === "CANCELLED" ||
                shipment.shipmentStatus === "CREATED") && (
                <div
                  className={`border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 ${
                    shipment.shipmentStatus === "CREATED"
                      ? "bg-blue-50 border-blue-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shrink-0 ${
                      shipment.shipmentStatus === "CREATED"
                        ? "bg-blue-100 text-brand-blue"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <FiInfo className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg mb-1 ${
                        shipment.shipmentStatus === "CREATED"
                          ? "text-brand-blue"
                          : "text-red-900"
                      }`}
                    >
                      {shipment.shipmentStatus === "CREATED"
                        ? "Payment Pending"
                        : `Shipment Status: ${shipment.shipmentStatus}`}
                    </h3>
                    <p
                      className={`text-sm font-medium ${
                        shipment.shipmentStatus === "CREATED"
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {shipment.shipmentStatus === "CREATED"
                        ? "This shipment was created but is unpaid. Use the invoice section to continue payment and renewal actions."
                        : "Tracking information is unavailable for this shipment. Please contact support if you believe this is an error."}
                    </p>
                  </div>
                </div>
              )}

              {trackingResponse && (
                <TrackingOverview trackingResponse={trackingResponse} />
              )}

              <TrackingDetails shipment={shipment} />
            </div>
          </div>

          {trackingResponse && (
            <TrackingTimelineView
              trackingResponse={trackingResponse}
              showFull
            />
          )}
        </div>

        {/* Sidebar: Package Details & Help */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-3 text-xl">
              <FiBox className="text-brand-blue" /> Physical Details
            </h3>

            <div className="space-y-6">
              {/* Service Info */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
                  Service Type
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">
                    {shipment.serviceName ||
                      shipment.serviceType ||
                      "Standard Logistics"}
                  </p>
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
                    Weight
                  </p>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-bold text-gray-900">
                      {shipment.weight?.value} {shipment.weight?.units}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
                    Dimensions
                  </p>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-bold text-gray-900">
                      {shipment.dimensions
                        ? `${shipment.dimensions.length}x${shipment.dimensions.width}x${shipment.dimensions.height}`
                        : "-"}
                      <span className="text-[10px] ml-1 opacity-50">
                        {shipment.dimensions?.units}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">
                  Shipment Created
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="font-bold text-gray-900">
                    {new Date(shipment.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Section */}
          {rawData?.invoice && (
            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() => setIsInvoiceDrawerOpen(true)}
            >
              <FiFileText className="mr-2" />
              View Invoice
            </Button>
          )}

          <div className="bg-brand-blue/5 p-8 rounded-3xl border border-brand-blue/10">
            <h4 className="font-black text-brand-blue mb-2 text-lg">
              Support Center
            </h4>
            <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
              Have questions about this shipment? Our team is available 24/7 to
              assist you.
            </p>
            <button className="w-full py-3 bg-white border-2 border-brand-blue/10 text-brand-blue rounded-2xl font-bold text-sm hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      {/* Invoice Drawer */}
      {rawData?.invoice && (
        <InvoiceDrawer
          isOpen={isInvoiceDrawerOpen}
          onClose={() => setIsInvoiceDrawerOpen(false)}
          invoice={deepTransformData(rawData.invoice)}
          shipmentId={shipment?.id}
          onUpdateShipment={() => {
            setIsInvoiceDrawerOpen(false);
            setIsUpdateModalOpen(true);
          }}
          recipientName={user?.name}
          recipientAddress={user?.address}
          itemQuantity={rawData?.packages?.length || 0}
          serviceDescription={
            rawData?.serviceName
              ? `Logistics Service - ${rawData.serviceName}`
              : "Logistics Service"
          }
        />
      )}

      {/* Update Shipment Modal */}
      {rawData?.invoice && shipment && (
        <UpdateShipmentModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          shipment={rawData}
          shipmentId={shipment.id}
          invoiceId={rawData.invoice.invoiceId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
