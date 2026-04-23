/**
 * Country detection and currency state store.
 * Uses Zustand with sessionStorage persistence.
 *
 * Detects user's country via browser locale information (no external API calls)
 * and sets currency:
 * - Poland (PL) → PLN
 * - All other countries → EUR
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CountryStore, CountryState, SupportedCurrency } from "@/types/country";
import { getCurrencyForCountry } from "@/utils/currency-formatter";

/** Initial state before detection */
const initialState: CountryState = {
  countryCode: "",
  currency: "EUR", // Default to EUR until detected
  isDetected: false,
  isManualOverride: false,
  isLoading: false,
};

/**
 * Attempts to extract a 2-letter region code from a locale string.
 * Examples: en-PL -> PL, pl_PL -> PL.
 */
const extractRegionFromLocale = (locale: string): string | null => {
  if (!locale) return null;

  try {
    const region = new Intl.Locale(locale).region;
    if (region && /^[A-Za-z]{2}$/.test(region)) {
      return region.toUpperCase();
    }
  } catch {
    // Fallback parsing below for environments without Intl.Locale support.
  }

  const match = locale.match(/[-_](\w{2})(?:[-_]|$)/);
  if (!match?.[1]) return null;

  const candidate = match[1].toUpperCase();
  return /^[A-Z]{2}$/.test(candidate) ? candidate : null;
};

/**
 * Detects country code from browser locale settings.
 */
const detectCountryCodeFromBrowser = (): string | null => {
  const locales = [
    ...(navigator.languages || []),
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().locale,
  ].filter(Boolean);

  for (const locale of locales) {
    const code = extractRegionFromLocale(String(locale));
    if (code) {
      return code;
    }
  }

  return null;
};

/**
 * Zustand store for country/currency state.
 * Persists to sessionStorage (resets per browser session).
 */
export const useCountryStore = create<CountryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Manually set the user's country (overrides auto-detection).
       */
      setCountry: (code: string) => {
        const normalizedCode = code.toUpperCase();
        const currency: SupportedCurrency =
          getCurrencyForCountry(normalizedCode);

        set({
          countryCode: normalizedCode,
          currency,
          isDetected: true,
          isManualOverride: true,
          isLoading: false,
        });
      },

      /**
       * Detect country via browser locale metadata.
       * Only runs if not already detected or manually overridden.
       */
      detectCountry: async () => {
        const state = get();

        // Respect manual overrides, but NOT automatic persistence.
        if (state.isManualOverride) {
          return;
        }

        set({ isLoading: true });

        const detectedCode = detectCountryCodeFromBrowser();
        const normalizedCode = detectedCode || "EU";
        const currency: SupportedCurrency =
          getCurrencyForCountry(normalizedCode);

        set({
          countryCode: normalizedCode,
          currency,
          isDetected: true,
          isManualOverride: false,
          isLoading: false,
        });
      },

      /**
       * Reset to initial state and trigger fresh detection.
       */
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "country-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        countryCode: state.countryCode,
        currency: state.currency,
        isManualOverride: state.isManualOverride,
      }),
    },
  ),
);
