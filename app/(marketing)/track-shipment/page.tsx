"use client";

import React, { useState } from "react";
import { trackShipment } from "@/api/shipments";
import { deepTransformData } from "@/utils/data-transform";
import TrackShell from "@/components/tracking/track-shell";
import PublicTrackingResult from "@/components/tracking/PublicTrackingResult";
import { TrackingResponse } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { buildUnpaidTrackingResponse } from "@/utils/tracking-fallbacks";

export default function TrackShipmentPage() {
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleTrack = async (trackingId: string) => {

    // Redirect authenticated users immediately
    if (isAuthenticated) {
      router.push(`/app/shipments/${trackingId}`);
      return;
    }

    setLoading(true);
    setTrackingData(null);

    try {
      const response = await trackShipment(trackingId);
      // Transform the entire response for branding
      const cleanedData = deepTransformData(response);
      console.log("Tracking Data Response:", cleanedData);

      // Check for success-200 "CREATED" response (Unpaid).
      // The authoritative state is `shipmentStatus`; the carrier's own wording
      // arrives separately as `carrierStatus` and is display-only.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = cleanedData as any;
      if (
        responseData.shipmentStatus === "CREATED" ||
        responseData.message?.includes("Carrier tracking not yet available")
      ) {
        setTrackingData(
          buildUnpaidTrackingResponse(trackingId),
        );
        return;
      }

      setTrackingData(cleanedData);
    } catch (err) {
      const error = err as AxiosError<{
        message: string;
        shipmentStatus?: string;
      }>;
      console.error(error);

      // Handle Unpaid (CREATED) shipment error response
      if (
        error.response?.data?.shipmentStatus === "CREATED" ||
        error.response?.data?.message?.includes(
          "Carrier tracking not yet available"
        )
      ) {
        setTrackingData(
          buildUnpaidTrackingResponse(trackingId),
        );
        return;
      }

      addToast({
        type: "error",
        title: "Tracking Failed",
        message:
          error.response?.data?.message ||
          "Could not find any shipment with that ID.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrackShell onTrack={handleTrack} isLoading={loading}>
      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      ) : trackingData ? (
        <PublicTrackingResult data={trackingData} />
      ) : null}
    </TrackShell>
  );
}
