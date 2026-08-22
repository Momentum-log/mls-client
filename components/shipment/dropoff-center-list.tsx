"use client";

import React from "react";
import { useShipmentDropoffCenters } from "@/hooks/shipments/use-fulfillment";
import { extractApiError, parseFulfillmentError } from "@/utils/error-handler";
import { FiMapPin, FiClock, FiLoader, FiAlertCircle } from "react-icons/fi";

interface DropoffCenterListProps {
  shipmentId: string;
  /** Search radius in km, 1-50. */
  radiusKm?: number;
  carrierDisplayName?: string;
}

/**
 * Lists nearby drop-off locations for a paid shipment, nearest first.
 *
 * Presentational and read-only. Labels are not location-locked — the customer
 * may use any compatible location — so this is guidance, not a commitment, and
 * there is nothing to select or persist.
 */
export default function DropoffCenterList({
  shipmentId,
  radiusKm = 25,
  carrierDisplayName = "carrier",
}: DropoffCenterListProps) {
  const {
    data: centers,
    isPending,
    error,
  } = useShipmentDropoffCenters(shipmentId, radiusKm);

  if (isPending) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-2">
        <FiLoader className="w-5 h-5 text-brand-blue animate-spin mx-auto" />
        <p className="text-xs font-medium text-gray-600">
          Searching nearby drop-off points...
        </p>
      </div>
    );
  }

  if (error) {
    const { statusCode, message } = extractApiError(error);
    const parsed = parseFulfillmentError(statusCode, message);

    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-800">
        <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="font-bold">Couldn&apos;t load nearby locations</p>
          <p className="text-amber-700">{parsed.userMessage}</p>
          <p className="text-amber-700 mt-1">
            Your label is still valid — you can drop the parcel at any
            authorised {carrierDisplayName} location.
          </p>
        </div>
      </div>
    );
  }

  if (!centers || centers.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-600 text-center">
        No drop-off points found within {radiusKm} km. You can still drop your
        parcel at any authorised {carrierDisplayName} location.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <FiMapPin className="w-4 h-4 text-brand-blue" />
          Nearby Drop-off Points ({centers.length})
        </h4>
        <span className="text-xs text-gray-500">Sorted by distance</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {centers.map((center, index) => (
          <div
            key={center.id ?? `${center.centerName}-${index}`}
            className="p-3.5 rounded-2xl border bg-white border-gray-200"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-gray-900">
                  {center.centerName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                  {center.distanceKm.toFixed(1)} km away
                </span>
              </div>

              <p className="text-xs text-gray-600">
                {center.address.streetLines?.join(", ")}, {center.address.city}{" "}
                {center.address.postalCode}
              </p>

              {center.operatingHours && (
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-0.5">
                  <FiClock className="w-3 h-3 text-gray-400 shrink-0" />
                  <span>
                    Hours:{" "}
                    {Object.values(center.operatingHours)[0] ||
                      "Standard business hours"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-500 font-medium">
        These are suggestions — your label works at any compatible{" "}
        {carrierDisplayName} location.
      </p>
    </div>
  );
}
