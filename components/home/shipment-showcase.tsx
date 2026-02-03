"use client";

import React from "react";
import {
  FaUser,
  FaCheck,
  FaTimes,
  FaTruck,
  FaUserPlus,
  FaSignInAlt,
  FaBox,
} from "react-icons/fa";
import { useCountryStore } from "@/store/country-store";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";

interface ShipmentShowcaseProps {
  className?: string;
}

const ShipmentShowcase: React.FC<ShipmentShowcaseProps> = ({
  className = "",
}) => {
  const { currency } = useCountryStore();

  const isPLN = currency === "PLN";
  const multiplier = isPLN ? 4 : 1;

  const prices = {
    baseRate: 24.5 * multiplier,
    serviceFee: 3.25 * multiplier,
    fuelSurcharge: 2.45 * multiplier,
    insurance: 1.25 * multiplier,
    signatureFee: 0.0,
  };

  const total = Object.values(prices).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full border-2 border-dashed border-brand-yellow/40 rounded-3xl relative p-6">
        {/* Receipt Card with slight rotation */}
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] transform rotate-2 sm:rotate-3 overflow-hidden flex flex-col h-[300px] md:h-[400px]">
          {/* Header Section */}
          <div className="bg-[#f8f9fa] h-[50px] sm:h-[60px] rounded-t-2xl px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <FaTruck className="w-3 h-3 sm:w-4 sm:h-4 text-brand-blue" />
                <p className="text-brand-blue font-work-sans font-black text-[10px] sm:text-xs">
                  Momentum
                </p>
              </div>
              <p className="text-brand-blue font-work-sans font-bold text-[8px] sm:text-[10px] ml-5 sm:ml-6">
                Logistics
              </p>
            </div>
            <div className="bg-brand-yellow px-2 py-1 rounded text-[9px] sm:text-[10px] font-semibold text-gray-900">
              Confirmed
            </div>
          </div>

          {/* Scrollable Content Section with Checkpoint Timeline */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 scrollbar-hide">
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[9px] top-0 bottom-0 w-px bg-brand-blue/20" />

              {/* Step 1: Account Information */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      1
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUser className="w-3 h-3 text-brand-blue" />
                      <p className="text-[10px] sm:text-[11px] font-semibold text-gray-900">
                        Account Created
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Email:</span>
                        <span className="font-medium">user@example.com</span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Status:</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-medium">
                          Active
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Membership:</span>
                        <span className="font-medium">Free Account</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipment Details */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      2
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaBox className="w-3 h-3 text-brand-blue" />
                      <p className="text-[10px] sm:text-[11px] font-semibold text-gray-900">
                        Shipment Details
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">From:</span>
                        <span className="font-medium text-right">
                          123 Main St, New York, NY
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">To:</span>
                        <span className="font-medium text-right">
                          456 Oak Ave, Los Angeles, CA
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">
                          Package Weight:
                        </span>
                        <span className="font-medium">2.5 lbs</span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Dimensions:</span>
                        <span className="font-medium">12×8×4 in</span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Service Type:</span>
                        <span className="font-medium">Express</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Pricing Breakdown */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaSignInAlt className="w-3 h-3 text-brand-blue" />
                      <p className="text-[10px] sm:text-[11px] font-semibold text-gray-900">
                        Price Breakdown
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Base Rate:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            prices.baseRate,
                            currency as SupportedCurrency,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Service Fee:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            prices.serviceFee,
                            currency as SupportedCurrency,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">
                          Fuel Surcharge:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            prices.fuelSurcharge,
                            currency as SupportedCurrency,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Insurance:</span>
                        <span className="font-medium flex items-center gap-1">
                          {formatCurrency(
                            prices.insurance,
                            currency as SupportedCurrency,
                          )}
                          <FaCheck className="w-2 h-2 text-green-600" />
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Signature Fee:</span>
                        <span className="font-medium flex items-center gap-1">
                          {formatCurrency(
                            prices.signatureFee,
                            currency as SupportedCurrency,
                          )}
                          <FaTimes className="w-2 h-2 text-gray-400" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Delivery Options Selected */}
              <div className="relative mb-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] font-bold z-10">
                      4
                    </div>
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserPlus className="w-3 h-3 text-brand-blue" />
                      <p className="text-[10px] sm:text-[11px] font-semibold text-gray-900">
                        Delivery Options
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">
                          Delivery Speed:
                        </span>
                        <span className="bg-brand-yellow px-2 py-0.5 rounded text-[9px] font-medium text-gray-900">
                          Express (1-2 days)
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">
                          Signature Required:
                        </span>
                        <span className="font-medium flex items-center gap-1">
                          Yes
                          <FaCheck className="w-2 h-2 text-green-600" />
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Insurance:</span>
                        <span className="font-medium flex items-center gap-1">
                          Yes
                          <FaCheck className="w-2 h-2 text-green-600" />
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-gray-900/60">Instructions:</span>
                        <span className="font-medium text-right">
                          Leave at door
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Total Section */}
              <div className="relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold z-10">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="border-t border-gray-900/20 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-brand-blue font-work-sans font-bold text-xs sm:text-sm">
                          Total:
                        </span>
                        <span className="text-brand-blue font-work-sans font-black text-base sm:text-lg">
                          {formatCurrency(total, currency as SupportedCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-[#f8f9fa] h-8 sm:h-10 rounded-b-2xl px-3 sm:px-4 py-1 sm:py-2 flex flex-col justify-center shrink-0">
            <p className="text-[9px] sm:text-[10px] italic text-gray-900/50">
              Order ID: #MLS-123456
            </p>
            <p className="text-[9px] sm:text-[10px] text-green-600 font-medium flex items-center gap-1">
              <FaCheck className="w-2 h-2" />
              Payment Confirmed - Ready to Ship
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentShowcase;
