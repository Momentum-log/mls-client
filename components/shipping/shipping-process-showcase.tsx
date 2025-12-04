"use client";

import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaCalculator,
  FaTruckFast,
  FaCheck,
  FaArrowRight,
  FaRulerCombined,
  FaWeightHanging,
} from "react-icons/fa6";

const ShippingProcessShowcase: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-blue/30 rounded-3xl relative p-4 bg-white/50 backdrop-blur-sm">
        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden relative h-[320px] flex flex-col">
          {/* Header */}
          <div className="bg-brand-blue p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-white">
              <span className="font-bold font-work-sans text-sm">
                Smart Shipping Process
              </span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    step === i ? "bg-brand-yellow" : "bg-white/30"
                  }`}
                ></div>
              ))}
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

            {/* Step 1: Enter Details */}
            <div
              className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 transform ${
                step === 0
                  ? "opacity-100 translate-x-0"
                  : step < 0 // Should not happen with modulo, but logically previous
                  ? "opacity-0 translate-x-full"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="font-bold text-gray-900">
                      1. Enter Details
                    </h3>
                    <p className="text-xs text-gray-500">
                      Input dimensions & weight
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaBox className="text-brand-blue" />
                        <span className="text-sm font-medium">
                          Package Type
                        </span>
                      </div>
                      <span className="text-xs bg-blue-50 text-brand-blue px-2 py-1 rounded">
                        Box
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaRulerCombined className="text-brand-blue" />
                        <span className="text-sm font-medium">Dimensions</span>
                      </div>
                      <span className="text-xs text-gray-500">30x20x15 cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaWeightHanging className="text-brand-blue" />
                        <span className="text-sm font-medium">Weight</span>
                      </div>
                      <span className="text-xs text-gray-500">2.5 kg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Get Quote */}
            <div
              className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 transform ${
                step === 1
                  ? "opacity-100 translate-x-0"
                  : step < 1
                  ? "opacity-0 translate-x-full"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="font-bold text-gray-900">
                      2. Instant Quote
                    </h3>
                    <p className="text-xs text-gray-500">
                      AI-powered rate calculation
                    </p>
                  </div>

                  <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-xl p-4 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue/20">
                      <div className="h-full bg-brand-blue w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] mx-auto"></div>
                    </div>

                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-brand-blue">
                      <FaCalculator className="w-5 h-5 animate-pulse" />
                    </div>
                    <p className="text-2xl font-bold text-brand-blue mb-1">
                      $24.50
                    </p>
                    <p className="text-xs text-gray-500">
                      Standard Delivery • 2-3 Days
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Ship It */}
            <div
              className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 transform ${
                step === 2
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-2">
                    <h3 className="font-bold text-gray-900">
                      3. Ready to Ship!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Label generated instantly
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <FaCheck className="w-8 h-8" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-2">
                      <FaTruckFast />
                      <span>Shipment Created</span>
                    </div>
                    <button className="text-xs bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-sm shadow-green-200">
                      Download Label
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute -bottom-3 -right-3 bg-brand-yellow text-brand-blue px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-20 transform rotate-3">
          <span className="text-xs font-bold">Fast & Easy</span>
          <FaArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default ShippingProcessShowcase;
