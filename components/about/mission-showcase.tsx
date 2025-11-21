"use client";

import React, { useState, useEffect } from "react";
import { FaCheck, FaBolt, FaArrowRight } from "react-icons/fa6";

const MissionShowcase: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-blue/30 rounded-3xl relative p-4 md:p-6 bg-white/50 backdrop-blur-sm">
        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden relative h-[350px] flex flex-col">
          {/* Header */}
          <div className="bg-brand-blue p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-white">
              <FaBolt className="w-4 h-4 text-brand-yellow" />
              <span className="font-bold font-work-sans text-sm">
                Instant Logistics
              </span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 flex flex-col justify-center relative">
            {/* Background Grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(#005db1 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            {/* Step 1: Request */}
            <div
              className={`transition-all duration-500 transform ${
                step === 0
                  ? "opacity-100 translate-y-0"
                  : "opacity-40 translate-y-4 blur-sm"
              } mb-4`}
            >
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      New Shipment
                    </p>
                    <p className="text-xs text-gray-500">
                      Electronics • 5kg • NYC
                    </p>
                  </div>
                </div>
                {step === 0 && (
                  <div className="bg-brand-blue text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                    Processing...
                  </div>
                )}
                {step > 0 && <FaCheck className="text-green-500 w-4 h-4" />}
              </div>
            </div>

            {/* Step 2: Route */}
            <div
              className={`transition-all duration-500 transform ${
                step === 1
                  ? "opacity-100 translate-y-0"
                  : step > 1
                  ? "opacity-40 translate-y-4 blur-sm"
                  : "opacity-0 -translate-y-4"
              } mb-4`}
            >
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Optimizing Route
                    </p>
                    <p className="text-xs text-gray-500">
                      AI Calculation Active
                    </p>
                  </div>
                </div>
                {step === 1 && (
                  <div className="bg-brand-yellow text-brand-blue text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                    Calculating...
                  </div>
                )}
                {step > 1 && <FaCheck className="text-green-500 w-4 h-4" />}
              </div>
            </div>

            {/* Step 3: Success */}
            <div
              className={`transition-all duration-500 transform ${
                step === 2
                  ? "opacity-100 translate-y-0 scale-105"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <FaCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">
                      Shipment Ready!
                    </p>
                    <p className="text-xs text-green-600">
                      Label Generated Instantly
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <FaArrowRight className="w-3 h-3 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute -bottom-3 -left-3 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 z-20">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-gray-600">Zero Friction</span>
        </div>
      </div>
    </div>
  );
};

export default MissionShowcase;
