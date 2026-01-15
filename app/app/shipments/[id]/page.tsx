"use client";

import React from "react";
import { FiBox, FiTruck, FiMapPin } from "react-icons/fi";
import { useParams } from "next/navigation";
import CopyButton from "@/components/ui/copy-button";
import { formatStatus } from "@/utils/shipment-helper";
import {
  useGetShipmentHistory,
  useTrackShipment,
} from "@/hooks/shipments/use-shipments";
import { TrackingEvent } from "@/types/shipping";
import { transformShipmentData } from "@/utils/tracking-helpers";

export default function ShipmentDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  // Use cached history for static details
  const { data: shipments, isLoading: isHistoryLoading } =
    useGetShipmentHistory();

  // Use cached/live tracking query
  const { data: tracking } = useTrackShipment(id);

  // Transform data if available
  const rawShipment = shipments?.find(
    (s) => s.id === id || s.customTrackingNumber === id
  );
  const shipmentDetails = rawShipment
    ? transformShipmentData(rawShipment)
    : null;

  // Transform tracking data
  const transformedTracking = tracking ? transformShipmentData(tracking) : null;

  if (isHistoryLoading)
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen pt-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 w-full max-w-2xl bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );

  if (!shipmentDetails && !isHistoryLoading) {
    return (
      <div className="p-8 text-center text-red-500 bg-gray-50 min-h-screen pt-20">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-red-100">
          <h3 className="font-bold text-red-600 mb-2">Shipment Not Found</h3>
          <p>This shipment could not be found in your history.</p>
        </div>
      </div>
    );
  }

  // Use the most relevant status available (live tracking prefers over DB status)
  // Use the most relevant status available (live tracking prefers over DB status)
  const currentStatus =
    transformedTracking?.status || shipmentDetails?.shipmentStatus || "Unknown";
  // Merge events if needed, but primarily use tracking events
  const trackingEvents = transformedTracking?.trackingEvents || [];

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono text-gray-500">
            {id}
          </span>
          <CopyButton text={id} tooltipText="Copy shipment ID" />
        </div>
        <p className="text-gray-500">
          View comprehensive shipment data and tracking history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Tracking & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-brand-blue/10 text-brand-blue rounded-2xl">
                <FiTruck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Current Status
                </p>
                <h2 className="text-3xl font-black text-brand-blue leading-none">
                  {formatStatus(currentStatus)}
                </h2>
              </div>
            </div>

            {/* Full Timeline */}
            <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              {trackingEvents.length > 0 ? (
                // Sort descending (Newest first) and map all
                [...trackingEvents]
                  .sort(
                    (a: TrackingEvent, b: TrackingEvent) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((event: TrackingEvent, index: number) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                          index === 0
                            ? "bg-brand-blue scale-125"
                            : "bg-gray-300"
                        }`}
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1 sm:gap-4">
                        <div>
                          <p
                            className={`font-bold ${
                              index === 0
                                ? "text-gray-900 text-lg"
                                : "text-gray-600"
                            }`}
                          >
                            {event.statusDescription || event.status}
                          </p>
                          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                            <FiMapPin className="w-3.5 h-3.5 shrink-0" />{" "}
                            {event.location || "Location pending"}
                          </p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right pt-1 sm:pt-0">
                          <p className="text-sm font-bold text-gray-900">
                            {new Date(event.timestamp).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short" }
                            )}
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {new Date(event.timestamp).toLocaleTimeString(
                              "en-GB",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-gray-400 italic">
                  No tracking updates available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shipment Details (Static) */}
        <div className="space-y-6">
          {shipmentDetails && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                <FiBox className="text-brand-blue" /> Package Details
              </h3>

              <div className="space-y-4">
                {/* Service Info */}
                <div className="pb-4 border-b border-gray-50">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Service
                  </p>
                  <p className="font-medium text-gray-900">
                    {shipmentDetails.className ||
                      shipmentDetails.serviceName ||
                      "Standard Shipping"}
                  </p>
                </div>

                {/* Dimensions & Weight */}
                {(shipmentDetails.package || shipmentDetails.weight) && (
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Weight
                      </p>
                      <div className="font-medium text-gray-900">
                        {(() => {
                          const w = shipmentDetails.weight;
                          if (typeof w === "number") return `${w} kg`;
                          if (
                            typeof w === "object" &&
                            w !== null &&
                            "value" in w
                          )
                            return `${w.value} ${w.units}`;
                          return shipmentDetails.package?.weight?.value
                            ? `${shipmentDetails.package.weight.value} ${shipmentDetails.package.weight.units}`
                            : "-";
                        })()}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Dimensions
                      </p>
                      <p className="font-medium text-gray-900">
                        {shipmentDetails.package?.dimensions
                          ? `${shipmentDetails.package.dimensions.length}x${shipmentDetails.package.dimensions.width}x${shipmentDetails.package.dimensions.height} ${shipmentDetails.package.dimensions.units}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Origin & Dest */}
                <div className="space-y-4 pt-2">
                  <div className="relative pl-6 border-l-2 border-gray-100">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white box-content"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      From
                    </p>
                    <p className="font-medium text-gray-900 text-sm">
                      {shipmentDetails.pickupAddress?.city || "Origin City"},{" "}
                      {shipmentDetails.pickupAddress?.countryCode || "Country"}
                    </p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-gray-100">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-brand-blue border-2 border-white box-content"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      To
                    </p>
                    <p className="font-medium text-gray-900 text-sm">
                      {shipmentDetails.dropoffAddress?.city ||
                        "Destination City"}
                      ,{" "}
                      {shipmentDetails.dropoffAddress?.countryCode || "Country"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions / Help Mockup */}
          <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
            <h4 className="font-bold text-brand-blue mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-4">
              If you have issues with your shipment, please contact support with
              your Tracking ID.
            </p>
            <button className="text-sm font-bold text-brand-blue hover:underline">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
