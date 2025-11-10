"use client";

import React from "react";

import {
  FaTruck,
  FaBox,
  FaLocationDot,
  FaCircleCheck,
  FaLocationPin,
} from "react-icons/fa6";

interface TrackingStepShowcaseProps {
  className?: string;
}

const TrackingStepShowcase: React.FC<TrackingStepShowcaseProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-accent-light rounded-3xl relative pt-4">
        {/* Tracking Card */}
        <div className="w-full bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 overflow-hidden ml-4 -mt-2 h-[300px] md:h-[400px] flex flex-col">
          {/* Header Section */}
          <div className="bg-accent-dark h-[50px] px-3 py-2 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <FaLocationDot className="w-4 h-4 text-white" />
              <p className="text-white font-work-sans font-black text-sm">
                Live Tracking
              </p>
            </div>
            <div className="bg-accent-light px-2 py-1 rounded text-[9px] font-semibold text-accent-dark">
              Track Shipment
            </div>
          </div>

          {/* Tracking ID Section */}
          <div className="bg-accent-dark/5 px-3 py-2 border-b border-accent-light/30 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-semibold text-gray-600">
                  Tracking ID
                </p>
                <p className="text-[11px] font-bold text-accent-dark font-mono">
                  TRK-789456231XYZ
                </p>
              </div>
              <div className="bg-accent-light px-2 py-1 rounded">
                <p className="text-[9px] font-medium text-accent-dark">
                  In Transit
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line - Split into segments */}
              <div className="absolute left-[9px] top-0 h-[calc(40%)] w-px bg-accent-dark" />
              <div className="absolute left-[9px] top-[40%] bottom-0 w-px bg-gray-300" />

              {/* Checkpoint 1: Shipment Confirmed */}
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center z-10">
                      <FaCircleCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 pb-3 bg-accent-dark/5 rounded px-2 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCircleCheck className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Shipment Confirmed
                      </p>
                    </div>
                    <p className="text-[9px] text-gray-600 mb-1">
                      Today, 10:30 AM
                    </p>
                    <p className="text-[9px] text-gray-600 italic">
                      Your shipment has been confirmed
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkpoint 2: Picked Up */}
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center z-10">
                      <FaCircleCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaBox className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Picked Up
                      </p>
                    </div>
                    <p className="text-[9px] text-gray-600 mb-1">
                      Today, 11:45 AM
                    </p>
                    <p className="text-[9px] text-gray-600 italic mb-1">
                      Package picked up from warehouse
                    </p>
                    <p className="text-[9px] text-gray-600">
                      📍 123 Main St, New York, NY
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkpoint 3: In Transit (Current Active) */}
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center z-10 ring-2 ring-accent-light shadow-lg">
                      <FaTruck className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 pb-3 border-l-4 border-accent-dark bg-accent-light/10 rounded px-2 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <FaTruck className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-accent-dark">
                        In Transit
                      </p>
                    </div>
                    <p className="text-[9px] text-accent-dark font-medium mb-1">
                      Currently in transit
                    </p>
                    <p className="text-[9px] text-accent-dark mb-2">
                      On the way to destination
                    </p>
                    <div className="mb-2">
                      <p className="text-[10px] font-semibold text-accent-dark mb-1">
                        ETA: 2:30 PM Today
                      </p>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-dark w-[65%]" />
                      </div>
                    </div>
                    <div className="bg-accent-dark/5 rounded px-2 py-1">
                      <p className="text-[9px] font-bold text-accent-dark">
                        Current Status
                      </p>
                      <p className="text-[9px] text-accent-dark">
                        Real-time tracking active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkpoint 4: Out for Delivery (Pending) */}
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center z-10">
                      <FaLocationPin className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaLocationPin className="w-3 h-3 text-gray-400" />
                      <p className="text-[11px] font-semibold text-gray-400">
                        Out for Delivery
                      </p>
                    </div>
                    <p className="text-[9px] text-gray-400 mb-1">Pending</p>
                    <p className="text-[9px] text-gray-400 italic">
                      Will arrive at destination
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkpoint 5: Delivered (Pending) */}
              <div className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center z-10">
                      <FaCircleCheck className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCircleCheck className="w-3 h-3 text-gray-400" />
                      <p className="text-[11px] font-semibold text-gray-400">
                        Delivered
                      </p>
                    </div>
                    <p className="text-[9px] text-gray-400 mb-1">—</p>
                    <p className="text-[9px] text-gray-400 italic">
                      Signature received
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Section */}
          <div className="bg-accent-light h-[50px] px-3 py-2 flex justify-between items-center shrink-0">
            <div>
              <p className="text-accent-dark font-work-sans font-black text-sm">
                Shipment Details
              </p>
              <p className="text-[8px] text-accent-dark/70">
                Real-time updates
              </p>
            </div>
            <button className="bg-accent-dark text-white px-3 py-1.5 rounded text-[10px] font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
              View Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingStepShowcase;
