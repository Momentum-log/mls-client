"use client";

import React from "react";
import { FaGlobe, FaSignal, FaWifi } from "react-icons/fa6";

const VisionShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-yellow/50 rounded-3xl relative p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        {/* Main Card */}
        <div className="w-full bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative h-[350px] flex flex-col text-white">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur p-4 flex justify-between items-center shrink-0 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FaGlobe className="w-4 h-4 text-brand-yellow" />
              <span className="font-bold font-work-sans text-sm">
                Global Connect
              </span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-medium text-green-400">
                Online
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden">
            {/* Abstract Globe/Network Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-48 h-48 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute w-32 h-32 border border-brand-yellow/20 rounded-full animate-pulse"></div>
            </div>

            {/* Connecting Nodes */}
            <div className="absolute inset-0">
              {/* Node 1 (Top Left) */}
              <div className="absolute top-10 left-10 animate-[float_4s_ease-in-out_infinite]">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(0,93,177,0.5)]">
                  <span className="font-bold text-xs">NY</span>
                </div>
              </div>

              {/* Node 2 (Bottom Right) */}
              <div className="absolute bottom-10 right-10 animate-[float_5s_ease-in-out_infinite_1s]">
                <div className="w-8 h-8 bg-brand-yellow text-brand-blue rounded-lg flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(252,180,23,0.5)]">
                  <span className="font-bold text-xs">LD</span>
                </div>
              </div>

              {/* Node 3 (Center) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 text-center min-w-[120px]">
                  <p className="text-[10px] text-gray-400 mb-1">Latency</p>
                  <div className="flex items-center justify-center gap-2 text-xl font-bold text-white">
                    <FaWifi className="w-4 h-4 text-green-400" />
                    <span>0.0ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-yellow to-transparent opacity-50 animate-[scan_3s_linear_infinite]"></div>
          </div>

          {/* Footer Stats */}
          <div className="bg-white/5 backdrop-blur p-4 grid grid-cols-3 gap-2 border-t border-white/10">
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Reach</p>
              <p className="text-sm font-bold">100%</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[10px] text-gray-400">Speed</p>
              <p className="text-sm font-bold text-brand-yellow">Max</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-[10px] text-gray-400">Barriers</p>
              <p className="text-sm font-bold text-red-400">None</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400px);
          }
        }
      `}</style>
    </div>
  );
};

export default VisionShowcase;
