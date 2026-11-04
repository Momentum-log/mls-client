import React, { FC } from "react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency-formatter";
import type { SupportedCurrency } from "@/types/country";
import type { PriceBreakdown as Breakdown } from "@/types/shipping";

interface PriceBreakdownProps {
  breakdown: Breakdown;
  /** "dark" for use on a brand-blue card. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Carrier price, handling fee, VAT and total (W4, D2). The commission is
 * always called "Handling fee" here; a zero pickup fee is not shown.
 */
const PriceBreakdown: FC<PriceBreakdownProps> = ({ breakdown, tone = "light", className }) => {
  const money = (value: number) =>
    formatCurrency(value, breakdown.currency as SupportedCurrency);
  const rows: Array<[string, number]> = [
    ["Carrier", breakdown.carrier],
    ["Handling fee", breakdown.handlingFee],
    ...(breakdown.pickupFee > 0 ? ([["Pickup fee", breakdown.pickupFee]] as Array<[string, number]>) : []),
    [`VAT (${breakdown.vatRate}%)`, breakdown.vat],
  ];
  const muted = tone === "dark" ? "text-white/70" : "text-gray-500";
  const strong = tone === "dark" ? "text-white" : "text-gray-900";

  return (
    <dl className={cn("m-0 flex flex-col gap-1 text-sm", className)}>
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4">
          <dt className={muted}>{label}</dt>
          <dd className={cn("m-0 tabular-nums", strong)}>{money(value)}</dd>
        </div>
      ))}
      <div
        className={cn(
          "mt-1 flex justify-between gap-4 border-t pt-1.5 font-bold",
          tone === "dark" ? "border-white/15" : "border-gray-200",
        )}
      >
        <dt className={strong}>Total</dt>
        <dd className={cn("m-0 tabular-nums", strong)}>{money(breakdown.total)}</dd>
      </div>
    </dl>
  );
};

export default PriceBreakdown;
