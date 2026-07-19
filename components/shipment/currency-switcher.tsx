"use client";

import React from "react";
import { SupportedCurrency } from "@/types/country";

interface CurrencySwitcherProps {
  currency: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  disabled?: boolean;
}

/**
 * CurrencySwitcher renders a minimalist, flat toggle switch for PLN and EUR.
 * It is designed to be placed in the header of the Service Selection card.
 */
export default function CurrencySwitcher({
  currency,
  onChange,
  disabled,
}: CurrencySwitcherProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("EUR")}
        className={`px-3 py-1 rounded-full text-xs font-black tracking-wider transition-all select-none cursor-pointer ${
          currency === "EUR"
            ? "bg-brand-blue text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        } disabled:opacity-50 disabled:pointer-events-none`}
      >
        EUR (€)
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("PLN")}
        className={`px-3 py-1 rounded-full text-xs font-black tracking-wider transition-all select-none cursor-pointer ${
          currency === "PLN"
            ? "bg-brand-blue text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        } disabled:opacity-50 disabled:pointer-events-none`}
      >
        PLN (zł)
      </button>
    </div>
  );
}
