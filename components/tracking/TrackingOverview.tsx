import React from "react";
import CopyButton from "@/components/ui/copy-button";
import { TrackingResponse } from "@/types/shipping";
import { formatTrackingFull } from "@/utils/format-tracking";

interface TrackingOverviewProps {
  trackingResponse: TrackingResponse;
}

/**
 * TrackingOverview Component
 * Displays the high-level status and tracking number of the shipment.
 */
const TrackingOverview: React.FC<TrackingOverviewProps> = ({
  trackingResponse,
}) => {
  const { shipment: rawShipment, status } = trackingResponse;

  if (!rawShipment) return null;

  const shipment = rawShipment;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
          Tracking Number
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-brand-blue">
            {shipment.customTrackingNumber || shipment.id}
          </h2>
          <CopyButton
            text={shipment.customTrackingNumber || shipment.id}
            tooltipText="Copy ID"
          />
        </div>
      </div>
      <div className="text-left md:text-right">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
          Current Status
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/5 text-brand-blue rounded-full font-bold">
          <span className="w-5 h-5 rounded-full border-4 border-brand-blue bg-brand-yellow animate-pulse" />
          {status}
        </div>
        {shipment.updatedAt && (
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Last updated: {formatTrackingFull(shipment.updatedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackingOverview;
