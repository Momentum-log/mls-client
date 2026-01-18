"use client";

import React, { useEffect, useState, useRef } from "react";
import Button from "@/components/ui/button";
import { trackShipment } from "@/api/shipments";
import { deepTransformData } from "@/utils/data-transform";
import { FiSearch, FiPackage, FiAlertCircle } from "react-icons/fi";
import Container from "@/components/shared/container";
import PublicTrackingResult from "@/components/tracking/PublicTrackingResult";
import { TrackingResponse } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export default function TrackShipmentByIdPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const trackingId = Array.isArray(id) ? id[0] : id; // Handle potential array

  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuthStore();
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

        // Check for success-200 "CREATED" response (Unpaid)
        // This handles the case where the API returns 200 but with status: "CREATED"
        // and no shipment object (just status/message).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = cleanedData as any;
        if (
          responseData.status === "CREATED" ||
          responseData.message?.includes("Carrier tracking not yet available")
        ) {
          const mockData: TrackingResponse = {
            // @ts-expect-error - Limited data for unpaid state
            shipment: {
              shipmentStatus: "CREATED",
              carrierTrackingNumber: trackingId,
            },
            timeline: [],
          };
          setTrackingData(mockData);
          return;
        }

        setTrackingData(cleanedData);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as AxiosError<{ message: string; status?: string }>;
        console.error(error);

        // Handle Unpaid (CREATED) shipment error response
        if (
          error.response?.data?.status === "CREATED" ||
          error.response?.data?.message?.includes(
            "Carrier tracking not yet available"
          )
        ) {
          // Construct a minimal tracking response to trigger the "Pay" UI
          const mockData: TrackingResponse = {
            // @ts-expect-error - Limited data for unpaid state
            shipment: {
              shipmentStatus: "CREATED",
              carrierTrackingNumber: trackingId,
              // We might not have ID if API doesn't return it in error,
              // but we rely on trackingId for the button link as failover
            },
            timeline: [],
          };
          setTrackingData(mockData);
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
    <div className="bg-white min-h-screen">
      {/* Hero Section (Simplified for ID view) */}
      <section className="relative bg-brand-blue py-12 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-white text-9xl transform -rotate-12 opacity-20">
            <FiPackage />
          </div>
          <div className="absolute bottom-10 right-10 text-brand-yellow text-9xl transform rotate-12 opacity-20">
            <FiPackage />
          </div>
        </div>

        <Container>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <Link
              href="/track-shipment"
              className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors text-sm font-medium"
            >
              ← Track another package
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 font-work-sans">
              Tracking <span className="text-brand-yellow">{trackingId}</span>
            </h1>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gray-50 min-h-[400px]">
        <Container>
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="animate-pulse space-y-8">
                <div className="h-48 bg-white rounded-3xl"></div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="h-40 bg-white rounded-3xl"></div>
                  <div className="h-40 bg-white rounded-3xl"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
                <FiAlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Unable to Track Package
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">{error}</p>
                <Link href="/track-shipment">
                  <Button variant="outline">Try Another ID</Button>
                </Link>
              </div>
            ) : trackingData ? (
              <PublicTrackingResult data={trackingData} />
            ) : null}
          </div>
        </Container>
      </section>
    </div>
  );
}
