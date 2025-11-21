"use client";

import React from "react";
import {
  FaBox,
  FaTruck,
  FaCircleCheck,
  FaClock,
  FaEllipsisVertical,
  FaMagnifyingGlass,
  FaBell,
} from "react-icons/fa6";

interface DashboardShowcaseProps {
  className?: string;
}

const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-blue/30 rounded-3xl relative pt-4 pl-4">
        {/* Dashboard Container */}
        <div className="w-full bg-gray-50 rounded-tl-2xl rounded-bl-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 overflow-hidden h-[300px] md:h-[400px] flex flex-col border-l border-t border-b border-gray-200">
          {/* Sidebar (Mini) */}
          <div className="flex h-full">
            <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 shrink-0">
              <div className="w-6 h-6 rounded bg-brand-blue mb-2"></div>
              <div className="w-6 h-6 rounded bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <FaBox className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <FaTruck className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <FaClock className="w-3 h-3" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md w-48">
                  <FaMagnifyingGlass className="text-gray-400 w-3 h-3" />
                  <div className="h-2 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FaBell className="text-gray-400 w-3 h-3" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 overflow-hidden flex-1 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="h-3 w-24 bg-gray-800 rounded mb-1"></div>
                    <div className="h-2 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="bg-brand-blue text-white text-[10px] px-2 py-1 rounded font-medium">
                    + New Shipment
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-1 bg-blue-50 rounded text-brand-blue">
                        <FaTruck className="w-3 h-3" />
                      </div>
                      <span className="text-[10px] text-green-500 font-medium">
                        +12%
                      </span>
                    </div>
                    <div className="h-4 w-8 bg-gray-800 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-1 bg-yellow-50 rounded text-brand-yellow">
                        <FaClock className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="h-4 w-8 bg-gray-800 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-1 bg-green-50 rounded text-green-600">
                        <FaCircleCheck className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="h-4 w-8 bg-gray-800 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>

                {/* Recent Shipments Table */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                    <div className="h-3 w-20 bg-gray-800 rounded"></div>
                    <FaEllipsisVertical className="text-gray-300 w-3 h-3" />
                  </div>
                  <div className="p-2 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                            <FaBox className="text-gray-400 w-3 h-3" />
                          </div>
                          <div>
                            <div className="h-2 w-16 bg-gray-700 rounded mb-1"></div>
                            <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="h-4 w-16 bg-brand-blue/10 rounded-full"></div>
                          <div className="h-2 w-8 bg-gray-300 rounded hidden md:block"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShowcase;
