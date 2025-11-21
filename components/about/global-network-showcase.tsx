"use client";

import React from "react";
import {
  FaGlobe,
  FaPlane,
  FaShip,
  FaTruck,
  FaBoxOpen,
  FaLocationDot,
} from "react-icons/fa6";

const GlobalNetworkShowcase: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-blue/30 rounded-3xl relative p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative h-[400px]">
          {/* Header */}
          <div className="bg-brand-blue p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <FaGlobe className="w-5 h-5" />
              <span className="font-bold font-work-sans">Global Network</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-white/80 font-medium">
                Live Operations
              </span>
            </div>
          </div>

          {/* Map Area (Abstract) */}
          <div className="relative h-full bg-gray-50 p-6 overflow-hidden">
            {/* Abstract Map Dots */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-brand-blue rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                ></div>
              ))}
            </div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path
                d="M50,150 Q150,50 250,150 T450,150"
                fill="none"
                stroke="#005db1"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_20s_linear_infinite]"
              />
              <path
                d="M100,300 Q200,200 300,300 T500,200"
                fill="none"
                stroke="#fcb417"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-[dash_25s_linear_infinite]"
              />
            </svg>

            {/* Active Shipment Cards (Floating) */}

            {/* Card 1: Air Freight */}
            <div className="absolute top-16 left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 w-48 animate-[float_4s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FaPlane className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Air Freight
                  </p>
                  <p className="text-xs font-bold text-gray-900">JFK → LHR</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[70%] rounded-full"></div>
              </div>
            </div>

            {/* Card 2: Ocean Freight */}
            <div className="absolute bottom-24 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 w-48 animate-[float_5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <FaShip className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Ocean Freight
                  </p>
                  <p className="text-xs font-bold text-gray-900">SHA → LAX</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[45%] rounded-full"></div>
              </div>
            </div>

            {/* Card 3: Last Mile */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl shadow-xl border border-gray-100 w-40 z-10 animate-[float_6s_ease-in-out_infinite_0.5s]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FaTruck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">
                    Last Mile
                  </p>
                  <p className="text-xs font-bold text-gray-900">
                    Out for Delivery
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
                <FaLocationDot className="w-3 h-3" /> Arriving Soon
              </div>
            </div>

            {/* Stats Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur border-t border-gray-100 p-4 flex justify-between items-center">
              <div className="text-center">
                <p className="text-xs text-gray-500">Active Routes</p>
                <p className="text-lg font-bold text-brand-blue">1,240+</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Countries</p>
                <p className="text-lg font-bold text-brand-blue">50+</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Delivered</p>
                <p className="text-lg font-bold text-brand-blue">1M+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-blue shadow-lg animate-bounce">
          <FaBoxOpen className="w-4 h-4" />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};

export default GlobalNetworkShowcase;
