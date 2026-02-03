/**
 * Country and Currency types for multi-currency support.
 * Based on PRD: prd-client-currency-display.md
 */

/** Supported currency codes */
export type SupportedCurrency = "PLN" | "EUR";

/** IPinfo.io API response structure */
export interface IPInfoResponse {
  ip: string;
  asn?: string;
  as_name?: string;
  as_domain?: string;
  country_code: string;
  country: string;
  continent_code?: string;
  continent?: string;
}

/** Country store state */
export interface CountryState {
  /** ISO 3166-1 alpha-2 country code (e.g., 'PL', 'DE') */
  countryCode: string;
  /** Display currency based on country */
  currency: SupportedCurrency;
  /** Whether country has been detected via IP */
  isDetected: boolean;
  /** Whether user manually overrode the detected country */
  isManualOverride: boolean;
  /** Loading state for detection */
  isLoading: boolean;
}

/** Country store actions */
export interface CountryActions {
  /** Set country manually (triggers manual override flag) */
  setCountry: (code: string) => void;
  /** Detect country via IP geolocation */
  detectCountry: () => Promise<void>;
  /** Reset to auto-detect mode */
  reset: () => void;
}

/** Combined store type */
export type CountryStore = CountryState & CountryActions;
