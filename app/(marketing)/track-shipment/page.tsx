"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { trackShipment } from "@/api/shipments";
import { deepTransformData } from "@/utils/data-transform";
import { FiSearch, FiPackage } from "react-icons/fi";
import Container from "@/components/shared/container";
import PublicTrackingResult from "@/components/tracking/PublicTrackingResult";
import { TrackingResponse } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function TrackShipmentPage() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    // Redirect authenticated users immediately
    if (isAuthenticated) {
      router.push(`/app/shipments/${trackingId.trim().toUpperCase()}`);
      return;
    }

    setLoading(true);
    setTrackingData(null);

    try {
      const response = await trackShipment(trackingId.trim().toUpperCase());
      // Transform the entire response for branding
      const cleanedData = deepTransformData(response);
      console.log("Tracking Data Response:", cleanedData);

      // Check for success-200 "CREATED" response (Unpaid)
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
            carrierTrackingNumber: trackingId.trim().toUpperCase(),
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
            carrierTrackingNumber: trackingId.trim().toUpperCase(),
          },
          timeline: [],
        };
        setTrackingData(mockData);
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-blue py-20 text-center overflow-hidden">
        {/* Background Elements */}
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
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-brand-yellow font-bold text-xs uppercase tracking-wider">
              Real-time Tracking
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-work-sans">
              Track Your <span className="text-brand-yellow">Shipment</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Enter your tracking number below to see exactly where your package
              is in real-time.
            </p>

            <form
              onSubmit={handleTrack}
              className="w-full max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <FiSearch className="h-6 w-6 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-16 pr-36 py-5 rounded-full border-2 border-transparent focus:border-brand-yellow focus:ring-4 focus:ring-brand-blue/20 bg-white text-gray-900 placeholder-gray-400 text-lg outline-none shadow-2xl transition-all"
                placeholder="Enter your tracking number (e.g. MLS-123456...)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
              <div className="absolute right-2 top-2 bottom-2 rounded-full overflow-hidden">
                <Button
                  type="submit"
                  disabled={loading || !trackingId}
                  className="h-full rounded-full px-8 text-lg font-bold shadow-none hover:shadow-lg transition-all"
                >
                  {loading ? "Tracking..." : "Track"}
                </Button>
              </div>
            </form>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gray-50 min-h-[400px]">
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
            ) : trackingData ? (
              <PublicTrackingResult data={trackingData} />
            ) : (
              <div className="text-center py-20 opacity-40">
                <FiPackage className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-400 font-medium">
                  Ready to track your package
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
