"use client";

import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiSearch,
  FiTruck,
  FiCheckCircle,
  FiInfo,
  FiChevronRight,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";
import { trackShipment, getShipmentHistory } from "@/api/shipments";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CopyButton from "@/components/ui/copy-button";
import { formatStatus, getShipmentDisplayName } from "@/utils/shipment-helper";
import { useToast } from "@/hooks/use-toast";

/**
 * TrackShipmentPage Component
 * Provides a dedicated interface for tracking MLS shipments by ID.
 * Features a search form, recent history in empty state, and a detailed timeline.
 */
export default function TrackShipmentPage() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<any>(null);
  const [recentShipments, setRecentShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Fetch recent shipments from history for the empty state
  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await getShipmentHistory();
        // Limit to latest 5 shipments
        setRecentShipments(history.slice(0, 5));
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
   */
  const handleTrack = async (idToTrack?: string) => {
    const id = idToTrack || trackingId.trim();
    if (!id) {
      addToast({
        message: "Please enter a tracking ID",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShipment(null);

    try {
      const data = await trackShipment(id);
      setShipment(data.data); // Assuming the response has a data property based on api/shipments/index.ts
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
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header & Search Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Track Shipment
        </h1>
        <p className="text-gray-500 mb-8">
          Enter your MLS tracking ID to see real-time status updates.
        </p>

        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter MLS Tracking ID (e.g. MLS-TRK-F84B00...)"
              className="pl-12 h-14 text-lg border-gray-200 focus:border-brand-blue ring-0"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="h-14 px-8 text-lg font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Tracking..." : "Track"}
          </Button>
        </form>
      </div>

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
            <p className="text-red-700">{error}</p>
          </div>
        ) : shipment ? (
          /* Results Display */
          <div className="space-y-6">
            {/* Status Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-5 bg-brand-blue/10 text-brand-blue rounded-2xl">
                    <FiTruck className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        {shipment.carrierName || "MLS"} Shipment
                      </p>
                      <CopyButton
                        text={shipment.id}
                        tooltipText="Copy shipment ID"
                      />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                      {formatStatus(shipment.status || shipment.shipmentStatus)}
                    </h2>
                  </div>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <p className="text-gray-500 text-sm mb-1 font-medium">
                    Estimated Delivery
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {shipment.estimatedDeliveryDate
                      ? new Date(
                          shipment.estimatedDeliveryDate
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "To be determined"}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipment Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <FiClock className="text-brand-blue" /> Shipment Timeline
              </h3>

              {shipment.trackingEvents && shipment.trackingEvents.length > 0 ? (
                <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {shipment.trackingEvents.map((event: any, index: number) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${
                          index === 0
                            ? "bg-brand-blue scale-125"
                            : "bg-gray-300"
                        }`}
                      />

                      <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-4">
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
                        <div className="shrink-0 text-left md:text-right pt-1 md:pt-0">
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
                  ))}
                </div>
              ) : (
                /* Fallback for no events yet */
                <div className="py-12 text-center text-gray-400">
                  <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>
                    Shipment details are being processed. Check back soon for
                    updates.
                  </p>
                </div>
              )}
            </div>
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
              <p className="text-gray-500 max-w-sm mx-auto">
                Enter Your MLS ID above to see your package's journey in
                real-time.
              </p>
            </div>

            {/* Recent Shipments Section */}
            {!isHistoryLoading && recentShipments.length > 0 && (
              <div className="">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="h-px bg-gray-100 flex-1"></span>
                  Recent Shipments
                  <span className="h-px bg-gray-100 flex-1"></span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentShipments.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleTrack(s.id)}
                      className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-brand-blue hover:shadow-md transition-all group"
                    >
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-brand-blue/5 group-hover:text-brand-blue transition-colors">
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate">
                          {getShipmentDisplayName(s)}
                        </p>
                        <p className="text-xs text-brand-blue font-bold uppercase tracking-wider mt-0.5">
                          {formatStatus(s.shipmentStatus)}
                        </p>
                      </div>
                      <FiChevronRight className="text-gray-300 group-hover:text-brand-blue transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
