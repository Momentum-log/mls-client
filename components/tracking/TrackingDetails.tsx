import React from "react";
import { FiMapPin, FiPackage } from "react-icons/fi";
import { Shipment } from "@/types/shipping";
import { formatTrackingDate } from "@/utils/format-tracking";

interface TrackingDetailsProps {
  shipment: Shipment;
}

/**
 * TrackingDetails Component
 * Displays the physical details of the shipment including drop-off address and content.
 */
const TrackingDetails: React.FC<TrackingDetailsProps> = ({ shipment }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
      {/* Pickup Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-bold">
          <FiMapPin className="text-brand-blue/60" />
          <h3>Pickup Information</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          {shipment.pickupAddress ? (
            <>
              <p className="font-bold text-gray-900 mb-1">
                {shipment.pickupAddress.contact?.personName || "Sender"}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {shipment.pickupAddress.streetLines?.[0]}
                <br />
                {shipment.pickupAddress.city},{" "}
                {shipment.pickupAddress.stateOrProvinceCode}{" "}
                {shipment.pickupAddress.postalCode}
                <br />
                {shipment.pickupAddress.countryCode}
              </p>
            </>
          ) : (
            <p className="text-gray-400 italic">Pickup details unavailable</p>
          )}
        </div>
      </div>

      {/* Drop-off Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-bold">
          <FiMapPin className="text-brand-blue" />
          <h3>Drop-off Information</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          {shipment.dropoffAddress ? (
            <>
              <p className="font-bold text-gray-900 mb-1">
                {shipment.dropoffAddress.contact?.personName || "Recipient"}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {shipment.dropoffAddress.streetLines?.[0]}
                <br />
                {shipment.dropoffAddress.city},{" "}
                {shipment.dropoffAddress.stateOrProvinceCode}{" "}
                {shipment.dropoffAddress.postalCode}
                <br />
                {shipment.dropoffAddress.countryCode}
              </p>
            </>
          ) : (
            <p className="text-gray-400 italic">Address details unavailable</p>
          )}
        </div>
      </div>

      {/* Package Content */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 font-bold">
          <FiPackage className="text-brand-blue" />
          <h3>Shipment Content</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="font-medium text-gray-900 text-lg">
            {shipment.customs?.categoryOfItem || "Package"}
          </p>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide font-bold">
            Created: {formatTrackingDate(shipment.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackingDetails;
