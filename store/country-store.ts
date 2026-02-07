/**
 * Country detection and currency state store.
 * Uses Zustand with sessionStorage persistence.
 *
 *
 * Detects user's country via Browser Geolocation API (navigator.geolocation)
 * and sets currency:
 * - Poland (PL) → PLN
 * - All other countries → EUR
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CountryStore,
  CountryState,
  IPInfoResponse,
  SupportedCurrency,
} from "@/types/country";
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
 * Fetches country information using Browser Geolocation API + Reverse Geocoding.
 * Falls back to IP-based detection if user denies permission or browser API fails.
 */
const detectLocation = async (): Promise<IPInfoResponse | null> => {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await response.json();

          if (data && data.countryCode) {
            resolve({
              ip: "browser-geo",
              country_code: data.countryCode,
              country: data.countryName,
            } as IPInfoResponse);
          } else {
            console.warn(
              "Reverse geocoding failed (no country code). Data:",
              data,
            );
            resolve(null);
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          resolve(null);
        }
      },
      (error) => {
        console.warn("Browser Geolocation denied/error:", error.message);
        resolve(null); // No fallback
      },
      { timeout: 5000 },
    );
  });
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
       * Detect country via IP geolocation (IPinfo.io).
       * Only runs if not already detected or manually overridden.
       */
      detectCountry: async () => {
        const state = get();

        // Respect manual overrides, but NOT automatic persistence.
        // We want to re-check IP on every reload/visit to support VPN changes.
        if (state.isManualOverride) {
          return;
        }

        set({ isLoading: true });

        // Try Browser Geolocation first, with IP fallback inside
        const ipInfo = await detectLocation();

        if (ipInfo?.country_code) {
          const normalizedCode = ipInfo.country_code.toUpperCase();
          const currency: SupportedCurrency =
            getCurrencyForCountry(normalizedCode);

          set({
            countryCode: normalizedCode,
            currency,
            isDetected: true,
            isManualOverride: false,
            isLoading: false,
          });
        } else {
          console.warn("Country Detection Failed or Empty. Using Fallback:", {
            countryCode: "EU",
            currency: "EUR",
          });
          // Fallback to EUR if detection fails
          set({
            countryCode: "EU", // Generic Europe fallback
            currency: "EUR",
            isDetected: true,
            isManualOverride: false,
            isLoading: false,
          });
        }
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
        // Don't persist isDetected so we re-verify on reload (unless manual)
        isManualOverride: state.isManualOverride,
      }),
    },
  ),
);
