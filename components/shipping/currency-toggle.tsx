"use client";

import React, { FC } from "react";
import { cn } from "@/utils/cn";
import { useCountryStore } from "@/store/country-store";
import type { SupportedCurrency } from "@/types/country";

const CURRENCIES: SupportedCurrency[] = ["PLN", "EUR"];

interface CurrencyToggleProps {
  label?: string;
  className?: string;
}

/**
 * PLN / EUR switch. It writes the shared country store, so the top region
 * switcher and every price list on the page change together, instantly: quotes
 * already carry both currencies.
 */
const CurrencyToggle: FC<CurrencyToggleProps> = ({ label = "Currency", className }) => {
  const { currency, setCurrency } = useCountryStore();
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex rounded-full bg-gray-100 p-[3px]", className)}
    >
      {CURRENCIES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          aria-pressed={code === currency}
          className={cn(
            "h-8 min-w-[52px] rounded-full px-3 text-[13px] font-bold",
            code === currency ? "bg-white text-brand-blue" : "text-gray-600",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
};

export default CurrencyToggle;
