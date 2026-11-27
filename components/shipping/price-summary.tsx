import React, { FC } from "react";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/currency-formatter";
import type { DisplayPrice } from "@/utils/price";

interface PriceSummaryProps {
  price: DisplayPrice;
  /** "dark" for use on a brand-blue card. */
  tone?: "light" | "dark";
  className?: string;
  /** False at quote stage: VAT depends on the billing details given at booking. */
  showVat?: boolean;
}

/**
 * The customer's price: one all-inclusive total and the VAT inside it
 * ("Total 130,00 zł" / "incl. 23% VAT 24,31 zł"). When no VAT applies the VAT
 * line reads 0,00. Nothing about how the price was built is shown.
 */
const PriceSummary: FC<PriceSummaryProps> = ({ price, tone = "light", className, showVat = true }) => {
  const muted = tone === "dark" ? "text-white/70" : "text-gray-500";
  const strong = tone === "dark" ? "text-white" : "text-gray-900";
  const money = (value: number) => formatCurrency(value, price.currency);
  const vatLabel = price.vatCode === "23" ? `incl. ${price.ratePercent}% VAT` : "VAT";

  return (
    <dl className={cn("m-0 flex flex-col gap-1 text-sm", className)}>
      <div className="flex justify-between gap-4 font-bold">
        <dt className={strong}>Total</dt>
        <dd className={cn("m-0 tabular-nums", strong)}>{money(price.total)}</dd>
      </div>
      {showVat && price.vat !== null && (
        <div className="flex justify-between gap-4">
          <dt className={muted}>{vatLabel}</dt>
          <dd className={cn("m-0 tabular-nums", muted)}>{money(price.vat)}</dd>
        </div>
      )}
    </dl>
  );
};

export default PriceSummary;
