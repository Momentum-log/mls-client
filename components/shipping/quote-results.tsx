"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/button";
import { formatCurrency } from "@/utils/currency-formatter";
import type { SupportedCurrency } from "@/types/country";
import type { Rate } from "@/types/shipping";

interface QuoteResultsProps {
  rates?: Rate[];
  errors?: { details?: string }[];
  /** True once a quote has come back, even with no rates. */
  hasResult: boolean;
  isLoading: boolean;
  onReviewAddresses: () => void;
}

const panelClass = "rounded-3xl border border-gray-200 bg-white p-5 sm:p-6";

const priceOf = (rate: Rate): string =>
  formatCurrency(rate.actualPrice, (rate.currency as SupportedCurrency) || "EUR");

/**
 * Shipping options for the instant quote: pick one, then continue to booking.
 * Booking needs an account, so "Continue" leads to registration.
 */
const QuoteResults: FC<QuoteResultsProps> = ({
  rates = [],
  errors = [],
  hasResult,
  isLoading,
  onReviewAddresses,
}) => {
  const [selected, setSelected] = useState(0);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(panelClass, "flex flex-col gap-4")}
      >
        <div className="flex items-center gap-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-brand-blue" aria-hidden="true" />
          <span className="text-[15px] font-semibold text-gray-900">
            Calculating rates across our courier networks…
          </span>
        </div>
        <div className="flex animate-pulse flex-col gap-3" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-64 max-w-full rounded bg-gray-200" />
              </div>
              <div className="h-6 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className={cn(panelClass, "flex flex-col items-center gap-3 py-12 text-center")}>
        <CircleAlert className="h-10 w-10 text-gray-300" aria-hidden="true" />
        <p className="m-0 max-w-[280px] text-gray-500">
          Fill out the form to see your shipping options.
        </p>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className={cn(panelClass, "flex flex-col gap-4")}>
        <h2 className="m-0 font-satoshi text-xl font-bold text-gray-900">No rates found</h2>
        <p className="m-0 text-sm leading-relaxed text-gray-600">
          We couldn&apos;t retrieve shipping rates for this address. This usually
          happens if the address is incomplete or unrecognized by our carriers.
        </p>
        {errors.length > 0 && (
          <div className="rounded-xl bg-warning-bg p-4 text-left text-xs text-warning-fg">
            {errors.map((err, i) => (
              <p key={i} className="m-0">
                {err.details}
              </p>
            ))}
          </div>
        )}
        <Button variant="outline" onClick={onReviewAddresses}>
          Review Addresses
        </Button>
      </div>
    );
  }

  const chosen = rates[Math.min(selected, rates.length - 1)];

  return (
    <section aria-labelledby="opt-h" className="flex flex-col gap-4">
      <h2 id="opt-h" className="m-0 font-satoshi text-xl font-bold leading-7 text-gray-900">
        {rates.length} {rates.length === 1 ? "option" : "options"} for your shipment
      </h2>
      <div role="radiogroup" aria-labelledby="opt-h" className={cn(panelClass, "flex flex-col gap-3")}>
        {rates.map((rate, index) => {
          const isSelected = rate === chosen;
          return (
            <button
              key={`${rate.serviceType}-${index}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelected(index)}
              className={cn(
                "flex items-start justify-between gap-4 rounded-2xl p-4 text-left",
                isSelected
                  ? "border-2 border-brand-blue bg-brand-blue-tint"
                  : "border border-gray-200 bg-white hover:border-brand-blue/50",
              )}
            >
              <span className="flex flex-col gap-1">
                <strong className="text-base font-bold text-gray-900">{rate.serviceName}</strong>
                {rate.deliveryDescription && (
                  <span className="text-sm text-gray-600">{rate.deliveryDescription}</span>
                )}
                {rate.warnings?.map((warning) => (
                  <span key={warning} className="text-xs text-warning-fg">
                    {warning}
                  </span>
                ))}
              </span>
              <span className="whitespace-nowrap text-xl font-extrabold text-gray-900">
                {priceOf(rate)}
              </span>
            </button>
          );
        })}
      </div>
      <div className={cn(panelClass, "flex flex-col gap-4")}>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-gray-500">Selected: {chosen.serviceName}</span>
          <span className="text-[28px] font-extrabold leading-[34px] text-gray-900">{priceOf(chosen)}</span>
        </div>
        <span className="text-[13px] leading-[18px] text-gray-500">
          Booking needs a free account. Prices are held for a limited time, then refreshed.
        </span>
        <Link
          href="/register"
          className="inline-flex h-[52px] items-center justify-center rounded-xl bg-brand-blue px-6 text-base font-bold text-white no-underline hover:bg-brand-blue-dark"
        >
          Continue to booking
        </Link>
      </div>
    </section>
  );
};

export default QuoteResults;
