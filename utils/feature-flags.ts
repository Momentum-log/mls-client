/**
 * Centralized feature flags for Address-Based Country Override.
 *
 * @module utils/feature-flags
 */

export type UseAddressCountryMode = "ENABLED" | "DISABLED" | "AUTO";

/**
 * Gets the current USE_ADDRESS_COUNTRY mode from environment variables.
 * Checks both NEXT_PUBLIC_USE_ADDRESS_COUNTRY (client) and USE_ADDRESS_COUNTRY (server).
 * Defaults to "DISABLED" if not set or invalid.
 *
 * @returns "ENABLED" | "DISABLED" | "AUTO"
 */
export function getUseAddressCountryMode(): UseAddressCountryMode {
  const mode =
    process.env.NEXT_PUBLIC_USE_ADDRESS_COUNTRY ||
    process.env.USE_ADDRESS_COUNTRY;
  if (mode === "ENABLED" || mode === "DISABLED" || mode === "AUTO") {
    return mode as UseAddressCountryMode;
  }
  return "DISABLED";
}

/**
 * Check if the address country override feature is active (ENABLED or AUTO).
 *
 * @returns true if feature is active
 */
export function isAddressCountryFeatureActive(): boolean {
  const mode = getUseAddressCountryMode();
  return mode === "ENABLED" || mode === "AUTO";
}

/**
 * Check if the active mode strictly requires an address (ENABLED mode).
 * If true, missing addresses should throw an error.
 *
 * @returns true if in strict ENABLED mode
 */
export function doesAddressCountryRequireAddress(): boolean {
  return getUseAddressCountryMode() === "ENABLED";
}
