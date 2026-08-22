import { useCountryStore } from "@/store/country-store";
import { getUserCountryCode } from "@/utils/address-country-helper";

/**
 * Hook to get the appropriate country code for the current user.
 *
 * Integrates:
 * - Fallback to browser-detected country from useCountryStore
 * - Fallback to pickup country code (passed as parameter) if browser country is not detected
 * - Default fallback to "US" if browser country is not detected
 *
 * @param {string} [fallbackCountryCode] - Optional fallback country code (e.g. pickup country)
 * @returns { countryCode: string }
 */
const useUserCountryCode = (fallbackCountryCode?: string) => {
  const { countryCode: browserCountryCode } = useCountryStore();

  const resolvedCountryCode = getUserCountryCode(
    browserCountryCode || "US",
    fallbackCountryCode,
  );

  return { countryCode: resolvedCountryCode };
};

export default useUserCountryCode;
