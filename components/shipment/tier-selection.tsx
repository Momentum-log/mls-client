"use client";

import React from "react";
import Button from "@/components/ui/button";
import { FiTruck, FiClock, FiAlertTriangle, FiZap, FiAward, FiTag } from "react-icons/fi";
import {
  CarrierError,
  ShippingTier,
  ShippingTiers,
  TIER_KEYS,
  TierKey,
} from "@/types/shipping";
import { formatCurrency } from "@/utils/currency-formatter";
import { SupportedCurrency } from "@/types/country";

interface TierSelectionProps {
  tiers?: ShippingTiers;
  /** Present only to distinguish "no service on this route" from "no tiers". */
  hasRates: boolean;
  errors?: CarrierError[];
  selectedRoutingRef: string | null;
  onSelect: (tier: ShippingTier) => void;
  isLoading: boolean;
  onBack: () => void;
}

const TIER_PRESENTATION: Record<
  TierKey,
  { blurb: string; icon: React.ReactNode }
> = {
  fastest: {
    blurb: "Quickest delivery available",
    icon: <FiZap className="w-3.5 h-3.5" />,
  },
  balanced: {
    blurb: "Best value for the speed",
    icon: <FiAward className="w-3.5 h-3.5" />,
  },
  economy: {
    blurb: "Lowest price, takes longer",
    icon: <FiTag className="w-3.5 h-3.5" />,
  },
};

/** "1-3 business days", collapsing to "1 business day" when the range is a point. */
const formatTransit = (tier: ShippingTier): string => {
  const { transitDaysMin: min, transitDaysMax: max } = tier;

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return tier.deliveryDescription || "Standard delivery";
  }
  if (min === max) {
    return `${min} business day${min === 1 ? "" : "s"}`;
  }
  return `${min}-${max} business days`;
};

/**
 * TierSelection presents the bookable shipping options.
 *
 * The customer picks a price and a delivery window; the server picks the
 * carrier. Any of the three tiers may be absent — a route with one viable
 * service returns one tier, and we render what we get rather than padding the
 * gap with a worse option.
 */
export default function TierSelection({
  tiers,
  hasRates,
  errors,
  selectedRoutingRef,
  onSelect,
  isLoading,
  onBack,
}: TierSelectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 py-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 bg-gray-50 rounded-2xl border border-gray-100"
          />
        ))}
      </div>
    );
  }

  const available = TIER_KEYS.filter((key) => tiers?.[key]).map((key) => ({
    key,
    tier: tiers![key]!,
  }));

  if (available.length === 0) {
    // Three distinct failures, and conflating them sends the customer to fix
    // the wrong thing: no carrier could quote the route at all; carriers
    // quoted but nothing was bookable; or a carrier errored outright.
    const carrierErrors = errors?.filter((e) => e.hasError && e.details) ?? [];

    return (
      <div className="text-center py-12 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FiTruck className="w-6 h-6 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {hasRates ? "No Bookable Options" : "No Services Available"}
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2 font-medium">
          {hasRates
            ? "We found pricing for this route but couldn't assemble a bookable option. Please try again shortly or contact support."
            : "We couldn't find any shipping services for this route and weight. Please check your address and package details."}
        </p>

        {carrierErrors.length > 0 && (
          <ul className="mt-5 space-y-1.5 text-left max-w-sm mx-auto">
            {carrierErrors.map((err, i) => (
              <li
                key={i}
                className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2"
              >
                {err.details}
              </li>
            ))}
          </ul>
        )}

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
        {available.map(({ key, tier }) => {
          const isSelected = selectedRoutingRef === tier.routingRef;
          const presentation = TIER_PRESENTATION[key];

          return (
            <button
              key={tier.routingRef}
              type="button"
              onClick={() => onSelect(tier)}
              className={`w-full text-left p-6 rounded-2xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? "border-brand-blue bg-brand-blue/5 ring-4 ring-brand-blue/5"
                  : "border-gray-100 bg-white hover:border-brand-blue/30 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 text-sm font-black text-gray-900 tracking-tight">
                      <span className="text-brand-blue">
                        {presentation.icon}
                      </span>
                      {tier.label}
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
                        {formatTransit(tier)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 font-medium mt-1">
                    {presentation.blurb}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-gray-900 tabular-nums">
                    {formatCurrency(
                      tier.actualPrice,
                      tier.currency as SupportedCurrency,
                    )}
                  </div>
                  <div className="text-[9px] font-black text-brand-blue uppercase tracking-widest mt-0.5">
                    Est. Total
                  </div>
                </div>
              </div>

              {tier.warnings.length > 0 && (
                <ul className="mt-4 space-y-1 relative z-10">
                  {tier.warnings.map((warning, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-[11px] text-gray-500 font-medium"
                    >
                      <FiAlertTriangle className="w-3 h-3 mt-0.5 shrink-0 text-amber-500" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              )}

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
