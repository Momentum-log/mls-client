import { useAuth } from "./useAuth";
import { useCountryStore } from "@/store/country-store";
import { getUserCountryCode } from "@/utils/address-country-helper";

/**
 * Hook to get the appropriate country code for the current user.
 *
 * Integrates:
 * - User's verified address country (if feature enabled & address exists)
 * - Fallback to browser-detected country from useCountryStore
 * - Default fallback to "US" if browser country is not detected
 * - Centralized feature flags & logging
 *
 * @returns { countryCode: string }
 */
const useUserCountryCode = () => {
  const { user } = useAuth();
  const { countryCode: browserCountryCode } = useCountryStore();

  let resolvedCountryCode = "US";

  try {
    resolvedCountryCode = getUserCountryCode(user, browserCountryCode || "US");
  } catch {
    // If strict mode throws MissingAddressError, return "US" (default fallback)
    // Pages/modals will trigger their own blocking pre-flight checks if required.
    resolvedCountryCode = "US";
  }

  return { countryCode: resolvedCountryCode };
};

export default useUserCountryCode;
