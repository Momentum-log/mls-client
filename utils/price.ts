import type { PriceBreakdown } from "@/types/shipping";

/**
 * The price a customer pays for a rate or tier: the breakdown's VAT-inclusive
 * total when the server sends one (W4), otherwise the older net `actualPrice`.
 */
export const customerTotal = (option: {
  actualPrice: number;
  breakdown?: PriceBreakdown;
}): number => option.breakdown?.total ?? option.actualPrice;
