import React from "react";
import { TrackingResponse } from "@/types/shipping";
import { format } from "date-fns";
import { FaBoxOpen, FaTruck, FaMapMarkerAlt, FaClock } from "react-icons/fa";

interface PublicTrackingResultProps {
  data: TrackingResponse;
}

export default function PublicTrackingResult({
  data,
}: PublicTrackingResultProps) {
  const { shipment, timeline } = data;

  if (!shipment) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100">
        <p className="font-semibold">Shipment details not found in response.</p>
        <p className="text-sm mt-1">Please try again or contact support.</p>
      </div>
    );
  }

  const latestEvent = timeline && timeline.length > 0 ? timeline[0] : null;

  // Determine progress based on status (simple mapping)
  const getProgress = (status: string) => {
    switch (status) {
      case "CREATED":
        return 25;
      case "IN_TRANSIT":
        return 50;
      case "OUT_FOR_DELIVERY":
        return 75;
      case "DELIVERED":
        return 100;
      case "FAILED":
        return 100; // Full bar but red
      case "CANCELLED":
        return 100; // Full bar but gray
      default:
        return 25;
    }
  };

  const progress = getProgress(shipment.shipmentStatus);
  const isError = ["FAILED", "CANCELLED"].includes(shipment.shipmentStatus);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-500">
      {/* Header / Status Banner */}
      <div
        className={`p-6 ${
          isError ? "bg-red-50" : "bg-brand-blue/5"
        } border-b border-gray-100`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Current Status
            </p>
            <h2
              className={`text-2xl font-black ${
                isError ? "text-red-600" : "text-brand-blue"
              } flex items-center gap-3`}
            >
              {isError ? <FaBoxOpen /> : <FaTruck />}
              {shipment.shipmentStatus.replace(/_/g, " ")}
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-400 font-medium">Tracking Number</p>
            <p className="text-lg font-bold text-gray-700 tracking-wider">
              {shipment.customTrackingNumber || shipment.carrierTrackingNumber}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
              isError ? "bg-red-500" : "bg-brand-blue"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
          <span>Created</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Route Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-brand-blue">
              <FaMapMarkerAlt />{" "}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">From</p>
              <p className="text-lg font-bold text-gray-800">
                {shipment.pickupAddress.city},{" "}
                {shipment.pickupAddress.countryCode}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(shipment.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="relative pl-2 ml-2 border-l-2 border-dashed border-gray-200 h-8"></div>

          <div className="flex items-start gap-4">
            <div className="mt-1 text-brand-yellow">
              <FaMapMarkerAlt />{" "}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">To</p>
              <p className="text-lg font-bold text-gray-800">
                {shipment.dropoffAddress.city},{" "}
                {shipment.dropoffAddress.countryCode}
              </p>
              <p className="text-sm text-gray-500">
                {/* Only show delivery date if present, else ETA or "Pending" */}
                {shipment.updatedAt
                  ? format(new Date(shipment.updatedAt), "MMM d, yyyy")
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Latest Event Highligth */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-gray-400" /> Latest Update
          </h3>

          {latestEvent ? (
            <div>
              <p className="font-bold text-brand-blue text-lg mb-1">
                {latestEvent.status}
              </p>
              <p className="text-gray-600 mb-2">{latestEvent.description}</p>
              <p className="text-xs text-gray-400 font-medium">
                {latestEvent.location ? `${latestEvent.location} • ` : ""}
                {/* Attempt to format if it looks like a date string, otherwise display as is */}
                {latestEvent.date && !isNaN(Date.parse(latestEvent.date))
                  ? format(
                      new Date(latestEvent.date),
                      "MMM d, yyyy 'at' h:mm a"
                    )
                  : latestEvent.date}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No updates available yet.</p>
          )}
        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          For privacy reasons, full address details and documents are hidden.
          <br />
          Login to your account to view complete shipment details.
        </p>
      </div>
    </div>
  );
}
