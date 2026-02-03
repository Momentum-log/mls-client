/**
 * Currency formatting utilities for multi-currency support.
 * Handles locale-specific formatting for PLN (Poland) and EUR (Europe).
 *
 * Formatting conventions:
 * - PLN (Poland): Symbol AFTER amount, comma decimal separator (e.g., "100,00 zł")
 * - EUR (Europe): Symbol BEFORE amount, dot decimal separator (e.g., "€100.00")
 */

import { SupportedCurrency } from "@/types/country";

/**
 * Gets the currency symbol for the given currency code.
 *
 * @param currency - The currency code ('PLN' or 'EUR')
 * @returns The currency symbol ('zł' or '€')
 */
export const getCurrencySymbol = (currency: SupportedCurrency): string => {
  return currency === "PLN" ? "zł" : "€";
};

/**
 * Gets the ISO currency code.
 *
 * @param currency - The currency code
 * @returns The ISO code string
 */
export const getCurrencyCode = (currency: SupportedCurrency): string => {
  return currency;
};

/**
 * Formats a numeric amount with locale-specific currency formatting.
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency code ('PLN' or 'EUR')
 * @param options - Optional formatting options
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(100, 'PLN') // "100,00 zł"
 * formatCurrency(45.99, 'PLN') // "45,99 zł"
 * formatCurrency(100, 'EUR') // "€100.00"
 * formatCurrency(23.50, 'EUR') // "€23.50"
 */
export const formatCurrency = (
  amount: number,
  currency: SupportedCurrency,
  options?: {
    /** Show decimals even for whole numbers */
    showDecimals?: boolean;
    /** Use ISO code instead of symbol */
    useISOCode?: boolean;
  },
): string => {
  // Handle invalid inputs
  if (amount === undefined || amount === null || isNaN(amount)) {
    return currency === "PLN" ? "0,00 zł" : "€0.00";
  }

  const { showDecimals = true, useISOCode = false } = options || {};

  // Round to 2 decimal places
  const roundedAmount = Math.round(amount * 100) / 100;

  if (currency === "PLN") {
    // Polish formatting: symbol after, comma as decimal separator
    const formatted = roundedAmount.toLocaleString("pl-PL", {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return useISOCode ? `${formatted} PLN` : `${formatted} zł`;
  } else {
    // Euro formatting: symbol before, dot as decimal separator
    const formatted = roundedAmount.toLocaleString("en-IE", {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return useISOCode ? `${formatted} EUR` : `€${formatted}`;
  }
};

/**
 * Formats currency for display in compact form (no decimals for whole numbers).
 *
 * @param amount - The numeric amount
 * @param currency - The currency code
 * @returns Compact formatted string
 *
 * @example
 * formatCurrencyCompact(100, 'PLN') // "100 zł"
 * formatCurrencyCompact(23, 'EUR') // "€23"
 */
export const formatCurrencyCompact = (
  amount: number,
  currency: SupportedCurrency,
): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return currency === "PLN" ? "0 zł" : "€0";
  }

  const isWholeNumber = amount % 1 === 0;

  if (currency === "PLN") {
    const formatted = isWholeNumber
      ? Math.round(amount).toString()
      : amount.toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    return `${formatted} zł`;
  } else {
    const formatted = isWholeNumber
      ? Math.round(amount).toString()
      : amount.toLocaleString("en-IE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    return `€${formatted}`;
  }
};

/**
 * Determines the correct currency based on country code.
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns The currency for that country ('PLN' for Poland, 'EUR' for others)
 */
export const getCurrencyForCountry = (
  countryCode: string,
): SupportedCurrency => {
  return countryCode.toUpperCase() === "PL" ? "PLN" : "EUR";
};
