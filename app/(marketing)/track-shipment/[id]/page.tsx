"use client";

import React, { useEffect, useState, useRef } from "react";
import { trackShipment } from "@/api/shipments";
import { deepTransformData } from "@/utils/data-transform";
import { FiAlertCircle } from "react-icons/fi";
import TrackShell from "@/components/tracking/track-shell";
import PublicTrackingResult from "@/components/tracking/PublicTrackingResult";
import { TrackingResponse } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { buildUnpaidTrackingResponse } from "@/utils/tracking-fallbacks";

export default function TrackShipmentByIdPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const trackingId = Array.isArray(id) ? id[0] : id; // Handle potential array
  // A signed-in customer lands here with `?view=public` when the shipment
  // isn't in their account; sending them back to the dashboard would loop.
  const forcePublic = useSearchParams().get("view") === "public";

  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const isSignedIn = useAuthStore((state) => state.isAuthenticated);
  const isAuthenticated = isSignedIn && !forcePublic;
  const hasTrackedRef = useRef(false);

  // 1. Auth Check & Redirect
  useEffect(() => {
    if (isAuthenticated && trackingId) {
      // If logged in, redirect to dashboard shipment view immediately
      router.replace(`/app/shipments/${trackingId}`);
    }
  }, [isAuthenticated, trackingId, router]);

  // 2. Auto-fetch tracking data
  useEffect(() => {
    const fetchTracking = async () => {
      if (!trackingId) return;
      if (hasTrackedRef.current) return;

      // If user is authenticated, we skip fetching here because we are redirecting.
      // However, to prevent race conditions or flash of content, we might want to wait.
      // But simpler to just let it run if the redirect implies a delay, or abort if authed.
      if (isAuthenticated) return;

      hasTrackedRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await trackShipment(trackingId.toUpperCase());
        const cleanedData = deepTransformData(response);

        // Check for success-200 "CREATED" response (Unpaid).
        // The server returns the authoritative state as `shipmentStatus`, with
        // `carrierStatus: "TRACKING_NOT_AVAILABLE"` and an empty timeline when
        // no carrier tracking number exists yet.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = cleanedData as any;
        if (
          responseData.shipmentStatus === "CREATED" ||
          responseData.message?.includes("Carrier tracking not yet available")
        ) {
          setTrackingData(buildUnpaidTrackingResponse(trackingId));
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
          setTrackingData(buildUnpaidTrackingResponse(trackingId));
          return;
        }

        const errorMsg =
          error.response?.data?.message ||
          "Could not find any shipment with that ID.";
        setError(errorMsg);
        addToast({
          type: "error",
          title: "Tracking Failed",
          message: errorMsg,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingId, addToast, isAuthenticated]);

  // If authenticated, we show a loader while redirecting (or nothing)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <p className="text-gray-400">Redirecting to shipment details...</p>
        </div>
      </div>
    );
  }

  return (
    <TrackShell
      defaultValue={trackingId}
      onTrack={(id) => router.push(`/track-shipment/${encodeURIComponent(id)}`)}
    >
      {loading ? (
        <div className="h-64 animate-pulse rounded-3xl bg-white" />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-100 bg-white px-6 py-16 text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
          <h2 className="m-0 font-satoshi text-xl font-bold text-gray-900">
            Unable to track this parcel
          </h2>
          <p className="m-0 max-w-md text-gray-500">{error}</p>
        </div>
      ) : trackingData ? (
        <PublicTrackingResult data={trackingData} />
      ) : null}
    </TrackShell>
  );
}
