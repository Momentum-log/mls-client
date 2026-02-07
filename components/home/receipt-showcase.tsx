"use client";

import React from "react";
import { useCountryStore } from "@/store/country-store";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";

interface ReceiptShowcaseProps {
  className?: string;
}

const ReceiptShowcase: React.FC<ReceiptShowcaseProps> = ({
  className = "",
}) => {
  const { currency } = useCountryStore();
  const isPLN = currency === "PLN";
  const multiplier = isPLN ? 4 : 1;

  const prices = {
    baseRate: 24.5 * multiplier,
    fuelSurcharge: 2.45 * multiplier,
    insurance: 1.25 * multiplier,
    total: 28.2 * multiplier,
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dashed Border Container */}
      <div className="w-full sm:w-[80%] mx-auto h-64 sm:h-80 border-2 border-dashed border-background/40 rounded-3xl relative">
        {/* Receipt Component */}
        <div
          className="absolute -top-2 sm:-top-3 -right-[5%] sm:-right-[10%] w-[110%] sm:w-[120%] h-60 sm:h-[280px] mt-4 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10"
          style={{ transform: "rotate(5deg)" }}
        >
          {/* Header Section */}
          <div className="bg-[#f8f9fa] h-[50px] sm:h-[60px] rounded-t-2xl px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 sm:w-5 h-4 sm:h-5 text-brand-blue"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <div>
                <p className="text-brand-blue font-work-sans font-black text-[10px] sm:text-xs leading-tight">
                  Momentum
                </p>
                <p className="text-brand-blue font-work-sans text-[8px] sm:text-[10px] leading-tight font-bold">
                  Logistics
                </p>
              </div>
            </div>
            <div className="bg-brand-yellow px-2 py-1 rounded text-[9px] sm:text-[10px] font-semibold">
              Instant
            </div>
          </div>

          {/* Quote Details Section */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 space-y-2 sm:space-y-3">
            {/* Route */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">From:</span>
                <span className="font-medium">New York, NY</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">To:</span>
                <span className="font-medium">Los Angeles, CA</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-foreground/10" />

            {/* Package Details */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">Weight:</span>
                <span className="font-medium">2.5 lbs</span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">Dimensions:</span>
                <span className="font-medium">12×8×4 in</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-foreground/10" />

            {/* Pricing Breakdown */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">Base Rate:</span>
                <span>
                  {formatCurrency(
                    prices.baseRate,
                    currency as SupportedCurrency,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">Fuel Surcharge:</span>
                <span>
                  {formatCurrency(
                    prices.fuelSurcharge,
                    currency as SupportedCurrency,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[10px] sm:text-[11px]">
                <span className="text-foreground/60">Insurance:</span>
                <span>
                  {formatCurrency(
                    prices.insurance,
                    currency as SupportedCurrency,
                  )}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-foreground/20" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-brand-yellow font-work-sans font-bold text-xs sm:text-sm">
                Total:
              </span>
              <span className="text-brand-yellow font-work-sans font-black text-base sm:text-lg">
                {formatCurrency(prices.total, currency as SupportedCurrency)}
              </span>
            </div>
          </div>

          {/* Footer Section */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#f8f9fa] h-8 sm:h-10 rounded-b-2xl px-3 sm:px-4 py-1 sm:py-2 flex flex-col justify-center">
            <p className="text-[9px] sm:text-[10px] italic text-foreground/50">
              Generated: 2 seconds ago
            </p>
            <p className="text-[9px] sm:text-[10px] text-green-600 font-medium">
              ✓ No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptShowcase;
