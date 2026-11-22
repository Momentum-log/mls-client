import type { SupportedCurrency } from "@/types/country";
import type { LegacyPriceBreakdown, PublicPrice } from "@/types/shipping";

/** What a rate or tier shows: one total, and the VAT inside it. */
export interface DisplayPrice {
  total: number;
  /** VAT contained in `total`; null when the server did not say. */
  vat: number | null;
  ratePercent: number;
  /** `23` when Polish VAT is inside the total; any other code means none. */
  vatCode: PublicPrice["vat"]["code"] | null;
  currency: SupportedCurrency;
}

interface Priced {
  price?: PublicPrice;
  breakdown?: LegacyPriceBreakdown;
  actualPrice?: number;
  currency: string;
}

const asCurrency = (value: string): SupportedCurrency =>
  value === "PLN" ? "PLN" : "EUR";

/**
 * The price a customer pays, in `preferred` currency when the quote carries
 * it. Switching currency only changes which returned total is read: nothing is
 * requested again. A route charged in one currency (Momentum) ignores the
 * preference and shows its own.
 *
 * An older server sends `breakdown` instead of `price`; its total and VAT are
 * read the same way, in the currency it was quoted in.
 */
export const displayPrice = (
  option: Priced,
  preferred?: string,
): DisplayPrice => {
  const { price } = option;
  if (price) {
    const wanted = preferred ? price.totals[preferred] : undefined;
    if (wanted && preferred) {
      return {
        total: wanted.total,
        vat: wanted.vat,
        ratePercent: price.vat.ratePercent,
        vatCode: price.vat.code,
        currency: asCurrency(preferred),
      };
    }
    return {
      total: price.total,
      vat: price.vat.amount,
      ratePercent: price.vat.ratePercent,
      vatCode: price.vat.code,
      currency: asCurrency(price.currency),
    };
  }

  const { breakdown } = option;
  if (breakdown) {
    return {
      total: breakdown.total,
      vat: breakdown.vat,
      ratePercent: breakdown.vatRate,
      vatCode: breakdown.vat > 0 ? "23" : "0",
      currency: asCurrency(breakdown.currency),
    };
  }

  return {
    total: option.actualPrice ?? 0,
    vat: null,
    ratePercent: 0,
    vatCode: null,
    currency: asCurrency(option.currency),
  };
};

/** True when the quote can be shown in more than one currency. */
export const offersCurrencySwitch = (option: Priced | undefined): boolean =>
  !!option?.price && Object.keys(option.price.totals).length > 1;
