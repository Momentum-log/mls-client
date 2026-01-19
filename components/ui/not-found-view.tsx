"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTruck,
  FaBoxOpen,
  FaMagnifyingGlass,
  FaHouse,
  FaRotateLeft,
  FaHeadset,
} from "react-icons/fa6";
import Button from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface NotFoundViewProps {
  /**
   * If true, renders the Dashboard-specific actions (e.g., "Return to Dashboard").
   * If false, renders Marketing/Public actions (e.g., "Return to Home").
   */
  isApp?: boolean;
}

export default function NotFoundView({ isApp = false }: NotFoundViewProps) {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsSearching(true);
    // Simulate a brief search delay for effect
    setTimeout(() => {
      router.push(
        `/track-shipment?trackingId=${encodeURIComponent(trackingId)}`,
      );
      // We don't set searching back to false because we are navigating away
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4">
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Visual Animation Area */}
        <div className="relative h-64 mb-10 flex items-center justify-center overflow-visible">
          {/* Background Circle */}
          <div className="absolute w-64 h-64 bg-brand-blue/5 rounded-full animate-pulse"></div>

          {/* Lost Box */}
          <div className="relative z-10 animate-[bounce_2s_infinite]">
            <FaBoxOpen className="w-32 h-32 text-brand-blue opacity-80" />
            <div className="absolute -top-4 -right-4 bg-brand-yellow text-brand-blue font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg rotate-12 select-none">
              ?
            </div>
          </div>

          {/* Truck passing by - utilizing the global @drive animation */}
          <div className="absolute bottom-10 -left-20 animate-[drive_8s_linear_infinite] opacity-50 pointer-events-none">
            <FaTruck className="w-16 h-16 text-gray-300 transform scale-x-[-1]" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="font-work-sans font-black text-8xl text-brand-blue mb-4 leading-none">
          404
        </h1>
        <h2 className="font-work-sans font-bold text-2xl md:text-3xl text-gray-900 mb-4">
          Shipment Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Looks like this package got lost in transit. The page you&apos;re
          looking for doesn&apos;t exist or has been moved to a new warehouse.
        </p>

        {/* Interactive Search Simulation */}
        <div className="max-w-md mx-auto mb-10">
          <form onSubmit={handleTrack} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaMagnifyingGlass
                className={cn(
                  "transition-colors duration-200",
                  isSearching
                    ? "text-brand-blue"
                    : "text-gray-400 group-hover:text-brand-blue",
                )}
              />
            </div>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Searching for a package? Enter Tracking ID..."
              className={cn(
                "w-full pl-11 pr-24 py-4 rounded-xl border outline-none transition-all shadow-sm",
                "bg-white border-gray-200",
                "focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10",
              )}
            />
            <div className="absolute inset-y-0 right-1.5 flex items-center">
              <Button
                type="submit"
                size="sm"
                disabled={!trackingId.trim() || isSearching}
                className={cn(
                  "rounded-lg px-4 h-9 transition-all",
                  !trackingId.trim() && "opacity-0 pointer-events-none",
                )}
              >
                {isSearching ? "Searching..." : "Track"}
              </Button>
            </div>
          </form>
          <p className="mt-2 text-sm text-gray-400">
            Were you trying to track a shipment?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isApp ? (
            <Link href="/app/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px] gap-2"
              >
                <FaRotateLeft /> Return to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px] gap-2"
              >
                <FaHouse /> Return to Base
              </Button>
            </Link>
          )}

          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] gap-2"
            >
              <FaHeadset /> Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
