"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaCopy, FaBell } from "react-icons/fa";

interface TrackingShowcaseProps {
  className?: string;
}

const TrackingShowcase: React.FC<TrackingShowcaseProps> = ({
  className = "",
}) => {
  const [showToast, setShowToast] = useState(false);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText("ML123456789");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-yellow/50 text-brand-blue px-6 py-2 rounded-lg text-sm font-work-sans font-bold shadow-lg z-50">
          Copied!
        </div>
      )}

      {/* Dashed Border Container */}
      <div className="w-11/12 h-80 border-2 border-dashed border-brand-blue rounded-2xl relative">
        {/* Tracking Component */}
        <div className="absolute -top-3 -right-2 w-full h-[280px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10">
          {/* Header Section */}
          <div className="bg-[#f8f9fa] h-[60px] rounded-t-2xl px-3 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4 text-brand-blue" />
              <div>
                <p className="text-brand-blue font-work-sans font-black text-xs leading-tight">
                  Momentum
                </p>
                <p className="text-brand-blue font-work-sans font-bold text-[10px] leading-tight">
                  Logistics
                </p>
              </div>
            </div>
            <div className="bg-brand-yellow px-2 py-1 rounded text-[9px] font-semibold">
              Live Tracking
            </div>
          </div>

          {/* Tracking Number Section */}
          <div className="px-3 py-3 bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] text-foreground/50">Tracking #</p>
                <p className="text-brand-blue font-bold text-sm">ML123456789</p>
              </div>
              <button
                onClick={handleCopyTracking}
                className="text-brand-blue hover:text-brand-blue/80 cursor-pointer transition-colors"
              >
                <FaCopy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Current Status Section */}
          <div className="mx-3 mb-3 bg-[#f0f8ff] rounded-md p-2">
            <p className="text-green-600 font-semibold text-xs">In Transit</p>
            <p className="text-[9px] text-foreground/60 mt-1">
              Est. delivery: Today, 4:30 PM
            </p>
            {/* Progress Bar */}
            <div className="mt-2 h-1 bg-foreground/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue w-[70%]" />
            </div>
          </div>

          {/* Shipment Timeline */}
          <div className="px-3 py-2 space-y-2 max-h-[120px] overflow-y-auto scrollbar-hide">
            {/* Current Location */}
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-green-600 mt-1" />
                <div className="w-px h-full bg-foreground/20 mt-1" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[9px] text-foreground/50">2:15 PM Today</p>
                <p className="text-[10px] font-semibold leading-tight">
                  Distribution Center
                </p>
                <p className="text-[9px] text-foreground/60">Chicago, IL</p>
                <p className="text-[9px] text-foreground/50 mt-1">
                  Package sorted and ready
                </p>
              </div>
            </div>

            {/* Previous Checkpoint */}
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-1" />
                <div className="w-px h-full bg-foreground/20 mt-1" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[9px] text-foreground/50">8:45 AM Today</p>
                <p className="text-[10px] font-semibold leading-tight">
                  Regional Hub
                </p>
                <p className="text-[9px] text-foreground/60">St. Louis, MO</p>
                <p className="text-[9px] text-foreground/50 mt-1">
                  Departed facility
                </p>
              </div>
            </div>

            {/* Origin */}
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-brand-blue mt-1" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] text-foreground/50">
                  6:30 PM Yesterday
                </p>
                <p className="text-[10px] font-semibold leading-tight">
                  Origin Facility
                </p>
                <p className="text-[9px] text-foreground/60">New York, NY</p>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#f8f9fa] h-10 rounded-b-2xl px-3 py-2 flex justify-between items-center">
            <p className="text-[9px] italic text-foreground/50">
              Real-time updates
            </p>
            <button className="text-brand-blue text-[9px] font-semibold hover:underline cursor-pointer flex items-center gap-1">
              <FaBell className="w-2 h-2" />
              Get notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingShowcase;
