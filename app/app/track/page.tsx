"use client";

import React, { useState, useEffect } from "react";
import { FiPackage, FiInfo } from "react-icons/fi";
import { trackShipment, getShipmentHistory } from "@/api/shipments";
import { deepTransformData } from "@/utils/data-transform";
import { useToast } from "@/hooks/use-toast";
import { Shipment, TrackingResponse } from "@/types/shipping";

// Sub-components
import TrackingSearch from "@/components/tracking/TrackingSearch";
import TrackingOverview from "@/components/tracking/TrackingOverview";
import TrackingDetails from "@/components/tracking/TrackingDetails";
import TrackingTimelineView from "@/components/tracking/TrackingTimelineView";
import RecentShipments from "@/components/tracking/RecentShipments";

/**
 * TrackShipmentPage Component
 * Provides a dedicated interface for tracking MLS shipments by ID.
 * Features a search form, recent history in empty state, and a detailed timeline.
 */
export default function TrackShipmentPage() {
  const { addToast } = useToast();

  // State management
  const [trackingId, setTrackingId] = useState("");
  const [trackingResponse, setTrackingResponse] =
    useState<TrackingResponse | null>(null);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent shipments from history for the empty state
  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await getShipmentHistory();
        // Transform history data for branding
        const cleanedHistory = deepTransformData(history);
        // Limit to latest 5 shipments
        setRecentShipments(cleanedHistory.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch shipment history:", err);
      } finally {
        setIsHistoryLoading(false);
      }
    }
    fetchHistory();
  }, []);

  /**
   * Handles the tracking search
   * @param idToTrack Optional ID to track (e.g. from history)
   */
  const handleTrack = async (idToTrack?: string) => {
    const id = (idToTrack || trackingId).trim();
    if (!id) {
      addToast({
        message: "Please enter a tracking ID",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setTrackingResponse(null);

    try {
      const data = await trackShipment(id.toUpperCase());

      // Transform the entire response to ensure branding (FedEx -> MLS) is applied everywhere
      const cleanedResponse = deepTransformData(data);

      setTrackingResponse(cleanedResponse);

      if (idToTrack) setTrackingId(idToTrack);
    } catch (err: any) {
      console.error("Tracking error:", err);
      setError(
        err.response?.data?.message || "Shipment not found or access denied."
      );
      addToast({
        message: "Could not find shipment details.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl px-4">
      {/* Header & Search Form */}
      <TrackingSearch
        trackingId={trackingId}
        setTrackingId={setTrackingId}
        handleTrack={() => handleTrack()}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          /* Loading Skeleton */
          <div className="space-y-6 animate-pulse">
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiInfo className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Oops! something went wrong
            </h3>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : trackingResponse ? (
          /* Results Display: Follows TrackingResponse interface strictly */
          <div className="space-y-6">
            {/* Status Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col gap-6">
                <TrackingOverview trackingResponse={trackingResponse} />
                <TrackingDetails shipment={trackingResponse.shipment} />
              </div>
            </div>

            {/* Shipment Timeline */}
            <TrackingTimelineView trackingResponse={trackingResponse} />
          </div>
        ) : (
          /* Empty State */
          <div className="space-y-12">
            <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white shadow-sm border border-gray-100 text-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                <FiPackage className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                Ready to Track?
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto font-medium">
                Enter Your MLS ID above to see your package&apos;s journey in
                real-time.
              </p>
            </div>

            {/* Recent Shipments Section */}
            {!isHistoryLoading && (
              <RecentShipments
                shipments={recentShipments}
                onTrack={handleTrack}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
