/**
 * Country detection and currency state store.
 * Uses Zustand with sessionStorage persistence.
 *
 * Detects user's country via Browser Geolocation API (navigator.geolocation)
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
       * Detect country via Browser Geolocation API.
       * Only runs if not already detected or manually overridden.
       */
      detectCountry: async () => {
        const state = get();

        // Respect manual overrides, but NOT automatic persistence.
        if (state.isManualOverride) {
          return;
        }

        set({ isLoading: true });

        if (!("geolocation" in navigator)) {
          console.warn("Geolocation not supported. Falling back.");
          set({
            countryCode: "EU",
            currency: "EUR",
            isDetected: true,
            isManualOverride: false,
            isLoading: false,
          });
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
                const normalizedCode = data.countryCode.toUpperCase();
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
                console.warn(
                  "Reverse geocoding failed (no country code). Data:",
                  data,
                );
                set({
                  countryCode: "EU",
                  currency: "EUR",
                  isDetected: true,
                  isManualOverride: false,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error("Reverse geocoding error:", error);
              set({
                countryCode: "EU",
                currency: "EUR",
                isDetected: true,
                isManualOverride: false,
                isLoading: false,
              });
            }
          },
          (error) => {
            console.warn("Browser Geolocation denied/error:", error.message);
            set({
              countryCode: "EU",
              currency: "EUR",
              isDetected: true,
              isManualOverride: false,
              isLoading: false,
            });
          },
          { timeout: 5000 },
        );
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
