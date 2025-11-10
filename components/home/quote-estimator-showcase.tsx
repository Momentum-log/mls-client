"use client";

import React, { useState } from "react";
import {
  FaBox,
  FaRuler,
  FaMapMarkerAlt,
  FaCheck,
  FaCalculator,
} from "react-icons/fa";

interface QuoteEstimatorShowcaseProps {
  className?: string;
}

const QuoteEstimatorShowcase: React.FC<QuoteEstimatorShowcaseProps> = ({
  className = "",
}) => {
  const [packageType, setPackageType] = useState("small");
  const [fragile, setFragile] = useState(false);
  const [specialHandling, setSpecialHandling] = useState(false);
  const [pickupTime, setPickupTime] = useState("today-morning");
  const [deliveryOption, setDeliveryOption] = useState("standard");

  return (
    <div className={`relative w-full ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-yellow rounded-3xl relative pt-4">
        {/* Process Component */}
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 overflow-hidden ml-4">
          {/* Header Section */}
          <div className="bg-brand-blue h-[50px] px-3 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaCalculator className="w-4 h-4 text-white" />
              <p className="text-white font-work-sans font-black text-sm">
                Quick Estimate
              </p>
            </div>
            <div className="bg-brand-yellow px-2 py-1 rounded text-[9px] font-semibold text-gray-900">
              Fast Quote
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="h-[300px] md:max-h-[400px] overflow-y-auto px-3 py-2 scrollbar-hide">
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[9px] top-0 bottom-0 w-px bg-blue-200" />

              {/* Step 1: Select Package Type */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBox className="w-3 h-3 text-brand-blue" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Package Type
                      </p>
                    </div>
                    <div className="space-y-1">
                      {/* Small Package - Selected */}
                      <div
                        className={`rounded px-2 py-1 flex justify-between items-center cursor-pointer ${
                          packageType === "small"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPackageType("small")}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold">
                            Small Package
                          </span>
                          <span className="text-[8px] opacity-80">
                            Up to 12×8×4 in
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold">$12.99</span>
                          {packageType === "small" && (
                            <FaCheck className="w-2 h-2" />
                          )}
                        </div>
                      </div>
                      {/* Medium Package */}
                      <div
                        className={`rounded px-2 py-1 flex justify-between items-center cursor-pointer ${
                          packageType === "medium"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPackageType("medium")}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold">
                            Medium Package
                          </span>
                          <span className="text-[8px] opacity-80">
                            Up to 18×12×8 in
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold">$19.99</span>
                          {packageType === "medium" && (
                            <FaCheck className="w-2 h-2" />
                          )}
                        </div>
                      </div>
                      {/* Large Package */}
                      <div
                        className={`rounded px-2 py-1 flex justify-between items-center cursor-pointer ${
                          packageType === "large"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPackageType("large")}
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold">
                            Large Package
                          </span>
                          <span className="text-[8px] opacity-80">
                            Up to 24×18×12 in
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold">$29.99</span>
                          {packageType === "large" && (
                            <FaCheck className="w-2 h-2" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Package Dimensions */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaRuler className="w-3 h-3 text-brand-blue" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Dimensions & Weight
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Length:</span>
                        <span className="font-medium text-foreground">
                          12 in
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Width:</span>
                        <span className="font-medium text-foreground">
                          8 in
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium text-foreground">
                          4 in
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium text-foreground">
                          2.5 lbs
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Estimated Value:</span>
                        <span className="font-medium text-foreground">
                          $150
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer text-foreground/80">
                          <input
                            type="checkbox"
                            className="w-2 h-2 cursor-pointer"
                            checked={fragile}
                            onChange={(e) => setFragile(e.target.checked)}
                          />
                          <span>Fragile/Breakable Items</span>
                        </label>
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer text-foreground/80">
                          <input
                            type="checkbox"
                            className="w-2 h-2 cursor-pointer"
                            checked={specialHandling}
                            onChange={(e) =>
                              setSpecialHandling(e.target.checked)
                            }
                          />
                          <span>Special Handling</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Pickup Location */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="w-3 h-3 text-brand-blue" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Pickup Location
                      </p>
                    </div>
                    <div className="space-y-1">
                      {/* Selected Time Slot */}
                      <div
                        className={`rounded px-2 py-1 cursor-pointer ${
                          pickupTime === "today-morning"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPickupTime("today-morning")}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-semibold">
                            Today 10:00 AM - 12:00 PM
                          </span>
                          {pickupTime === "today-morning" && (
                            <FaCheck className="w-2 h-2" />
                          )}
                        </div>
                      </div>
                      {/* Other Time Slots */}
                      <div
                        className={`rounded px-2 py-1 cursor-pointer ${
                          pickupTime === "today-afternoon"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPickupTime("today-afternoon")}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px]">
                            Today 2:00 PM - 4:00 PM
                          </span>
                        </div>
                      </div>
                      <div
                        className={`rounded px-2 py-1 cursor-pointer ${
                          pickupTime === "tomorrow-morning"
                            ? "bg-brand-blue text-white"
                            : "bg-gray-200 text-foreground/80"
                        }`}
                        onClick={() => setPickupTime("tomorrow-morning")}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px]">
                            Tomorrow 9:00 AM - 11:00 AM
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[9px] text-gray-600">
                        📍 123 Main St, New York, NY
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Destination & Delivery */}
              <div className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="w-3 h-3 text-brand-blue" />
                      <p className="text-[11px] font-semibold text-gray-900">
                        Destination & Delivery
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[10px] text-gray-600">
                        📍 456 Oak Ave, Los Angeles, CA
                      </div>
                      <div className="mt-2 space-y-1">
                        <label
                          className="flex items-center gap-1 text-[9px] cursor-pointer"
                          onClick={() => setDeliveryOption("standard")}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value="standard"
                            className="w-2 h-2 cursor-pointer"
                            checked={deliveryOption === "standard"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                          />
                          <span className="text-foreground">
                            Standard Delivery (3-5 days) - $12.99
                          </span>
                          {deliveryOption === "standard" && (
                            <FaCheck className="w-2 h-2 ml-auto" />
                          )}
                        </label>
                        <label
                          className="flex items-center gap-1 text-[9px] cursor-pointer"
                          onClick={() => setDeliveryOption("express")}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value="express"
                            className="w-2 h-2 cursor-pointer"
                            checked={deliveryOption === "express"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                          />
                          <span className="text-foreground">
                            Express Delivery (1-2 days) - $24.99
                          </span>
                          {deliveryOption === "express" && (
                            <FaCheck className="w-2 h-2 ml-auto" />
                          )}
                        </label>
                        <label
                          className="flex items-center gap-1 text-[9px] cursor-pointer"
                          onClick={() => setDeliveryOption("overnight")}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value="overnight"
                            className="w-2 h-2 cursor-pointer"
                            checked={deliveryOption === "overnight"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                          />
                          <span className="text-foreground">
                            Overnight Delivery - $39.99
                          </span>
                          {deliveryOption === "overnight" && (
                            <FaCheck className="w-2 h-2 ml-auto" />
                          )}
                        </label>
                      </div>
                      {/* Progress Bar */}
                      <div className="mt-2">
                        <p className="text-[9px] text-gray-600 mb-1">
                          Estimated Timeline
                        </p>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-yellow w-[75%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Section */}
          <div className="bg-brand-yellow h-[50px] px-3 py-2 flex justify-between items-center">
            <div>
              <p className="text-gray-900 font-work-sans font-black text-sm">
                Total Estimate: $29.99
              </p>
              <p className="text-[8px] text-gray-900/70">Includes all fees</p>
            </div>
            <button className="bg-brand-blue text-white px-3 py-1.5 rounded text-[10px] font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteEstimatorShowcase;
