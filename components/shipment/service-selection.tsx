"use client";

import React from "react";
import Button from "@/components/ui/button";
import { FiCheck, FiTruck, FiClock } from "react-icons/fi";
import { Rate } from "@/types/shipping";

interface ServiceSelectionProps {
  rates: Rate[];
  selectedRateId: string | null;
  onSelect: (rate: Rate) => void;
  isLoading: boolean;
  onBack: () => void;
}

/**
 * ServiceSelection displays a list of shipping rates and delivery times.
 * It allows the user to compare and choose their preferred shipping method.
 */
export default function ServiceSelection({
  rates,
  selectedRateId,
  onSelect,
  isLoading,
  onBack,
}: ServiceSelectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 py-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-50 rounded-2xl border border-gray-100"
          />
        ))}
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FiTruck className="w-6 h-6 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          No Services Available
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2 font-medium">
          We couldn't find any shipping services for this route and weight.
          Please check your address details.
        </p>
        <Button
          variant="ghost"
          onClick={onBack}
          className="mt-6 text-gray-500 font-bold"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      <div className="grid grid-cols-1 gap-4">
        {rates.map((rate) => {
          const isSelected = selectedRateId === rate.serviceType;
          return (
            <button
              key={rate.serviceType}
              type="button"
              onClick={() => onSelect(rate)}
              className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? "border-brand-blue bg-brand-blue/5 ring-4 ring-brand-blue/5"
                  : "border-gray-100 bg-white hover:border-brand-blue/30 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-gray-900 tracking-tight">
                      {rate.serviceName}
                    </span>
                    {isSelected && (
                      <span className="bg-brand-blue text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 font-bold">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5" />
                      <span className="text-[11px] uppercase tracking-tight">
                        {rate.deliveryDescription || "Standard Delivery"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-gray-900 tabular-nums">
                    {rate.actualPrice || rate.price}{" "}
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {rate.currency}
                    </span>
                  </div>
                  <div className="text-[9px] font-black text-brand-blue uppercase tracking-widest mt-0.5">
                    Est. Total
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              <div
                className={`absolute top-0 right-0 w-2 h-full transition-all ${
                  isSelected
                    ? "bg-brand-blue"
                    : "bg-transparent group-hover:bg-brand-blue/10"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="text-gray-500 font-bold"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
