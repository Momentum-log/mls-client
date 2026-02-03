"use client";

import React, { useState } from "react";
import {
  FaBolt,
  FaBox,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheck,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useCountryStore } from "@/store/country-store";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";

interface SimplifiedLogisticsShowcaseProps {
  className?: string;
}

const SimplifiedLogisticsShowcase: React.FC<
  SimplifiedLogisticsShowcaseProps
> = ({ className = "" }) => {
  const [signatureRequired, setSignatureRequired] = useState(true);
  const [insurance, setInsurance] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState("leave");

  const { currency } = useCountryStore();
  const isPLN = currency === "PLN";
  const multiplier = isPLN ? 4 : 1;

  const prices = {
    express: 29.99 * multiplier,
    standard: 19.99 * multiplier,
    economy: 14.99 * multiplier,
    value: 150 * multiplier,
    insurance: 4.99 * multiplier,
    total: 34.98 * multiplier, // This total might need recalculation if logic was dynamic, but for showcase it's fine.
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-white/40 rounded-2xl relative pt-4">
        {/* Process Component */}
        <div className="w-full bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 overflow-hidden ml-4 -mt-2">
          {/* Header Section */}
          <div className="bg-[#f8f9fa] h-[50px] px-3 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdDashboard className="w-4 h-4 text-accent-dark" />
              <p className="text-accent-dark font-work-sans font-black text-sm">
                One-Click Logistics
              </p>
            </div>
            <div className="bg-purple-200 px-2 py-1 rounded text-[9px] font-semibold text-accent-dark">
              Simplified
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="max-h-[220px] overflow-y-auto px-3 py-2 scrollbar-hide">
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[9px] top-0 bottom-0 w-px bg-purple-200" />

              {/* Step 1: Get Instant Quote */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center text-[10px] font-bold z-10">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBolt className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-accent-dark">
                        Choose Service Type
                      </p>
                    </div>
                    <div className="space-y-1">
                      {/* Express - Selected */}
                      <div className="bg-accent-dark text-white rounded px-2 py-1 flex justify-between items-center">
                        <span className="text-[10px] font-semibold">
                          Express
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold">
                            {formatCurrency(
                              prices.express,
                              currency as SupportedCurrency,
                            )}
                          </span>
                          <FaCheck className="w-2 h-2" />
                        </div>
                      </div>
                      {/* Standard */}
                      <div className="bg-gray-50 rounded px-2 py-1 flex justify-between items-center">
                        <span className="text-[10px]">Standard</span>
                        <span className="text-[10px] text-gray-600">
                          {formatCurrency(
                            prices.standard,
                            currency as SupportedCurrency,
                          )}
                        </span>
                      </div>
                      {/* Economy */}
                      <div className="bg-gray-50 rounded px-2 py-1 flex justify-between items-center">
                        <span className="text-[10px]">Economy</span>
                        <span className="text-[10px] text-gray-600">
                          {formatCurrency(
                            prices.economy,
                            currency as SupportedCurrency,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Create Shipment */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center text-[10px] font-bold z-10">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBox className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-accent-dark">
                        Package Details
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">2.5 lbs</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">12×8×4 in</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            prices.value,
                            currency as SupportedCurrency,
                            { showDecimals: false },
                          )}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-2 h-2 cursor-pointer"
                            checked={signatureRequired}
                            onChange={(e) =>
                              setSignatureRequired(e.target.checked)
                            }
                          />
                          <span>Signature Required</span>
                        </label>
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-2 h-2 cursor-pointer"
                            checked={insurance}
                            onChange={(e) => setInsurance(e.target.checked)}
                          />
                          <span>
                            Insurance (
                            {formatCurrency(
                              prices.insurance,
                              currency as SupportedCurrency,
                            )}
                            )
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Schedule Pickup */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-accent-dark text-white flex items-center justify-center text-[10px] font-bold z-10">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="w-3 h-3 text-accent-dark" />
                      <p className="text-[11px] font-semibold text-accent-dark">
                        Pickup Options
                      </p>
                    </div>
                    <div className="space-y-1">
                      {/* Selected Time Slot */}
                      <div className="bg-accent-dark text-white rounded px-2 py-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-semibold">
                            Today
                          </span>
                          <FaCheck className="w-2 h-2" />
                        </div>
                        <span className="text-[9px]">2:00 PM - 4:00 PM</span>
                      </div>
                      {/* Other Time Slots */}
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-[10px]">
                          Today: 4:00 PM - 6:00 PM
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-[10px]">
                          Tomorrow: 9:00 AM - 11:00 AM
                        </span>
                      </div>
                      <div className="mt-2 text-[9px] text-gray-600">
                        📍 123 Main St, New York, NY
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Track & Deliver */}
              <div className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold z-10">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="w-3 h-3 text-green-600" />
                      <p className="text-[11px] font-semibold text-green-600">
                        Live Tracking Active
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-600">
                        Out for delivery - ETA: 3:45 PM
                      </p>
                      {/* Progress Bar */}
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-dark w-[90%]" />
                      </div>
                      <div className="mt-2 space-y-1">
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            value="leave"
                            className="w-2 h-2 cursor-pointer"
                            checked={deliveryOption === "leave"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                          />
                          <span>Leave at door</span>
                        </label>
                        <label className="flex items-center gap-1 text-[9px] cursor-pointer">
                          <input
                            type="radio"
                            name="delivery"
                            value="meet"
                            className="w-2 h-2 cursor-pointer"
                            checked={deliveryOption === "meet"}
                            onChange={(e) => setDeliveryOption(e.target.value)}
                          />
                          <span>Meet at door</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Section */}
          <div className="bg-purple-200 h-[50px] px-3 py-2 flex justify-between items-center">
            <div>
              <p className="text-accent-dark font-work-sans font-black text-sm">
                Total:{" "}
                {formatCurrency(prices.total, currency as SupportedCurrency)}
              </p>
              <p className="text-[8px] text-accent-dark/70">
                All fees included
              </p>
            </div>
            <button className="bg-accent-dark text-white px-3 py-1.5 rounded text-[10px] font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
              Create Shipment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedLogisticsShowcase;
