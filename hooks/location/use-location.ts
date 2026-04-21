import { useQuery } from "@tanstack/react-query";
import {
  getCities,
  getCountries,
  getStates,
  getAutocomplete,
  getPlaceDetails,
} from "@/api/location";

/**
 * Hook to fetch all countries.
 * Cached for 24 hours (staleTime) since country data rarely changes.
 */
export const useCountries = () => {
  return useQuery({
    queryKey: ["locations", "countries"],
    queryFn: getCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch states for a given country.
 * Enabled only when countryCode is present.
 */
export const useStates = (countryCode: string | undefined | null) => {
  return useQuery({
    queryKey: ["locations", "states", countryCode],
    queryFn: () => getStates(countryCode!),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch cities for a given state.
 * Enabled only when countryCode and stateCode are present.
 */
export const useCities = (
  countryCode: string | undefined | null,
  stateCode: string | undefined | null,
) => {
  return useQuery({
    queryKey: ["locations", "cities", countryCode, stateCode],
    queryFn: () => getCities(countryCode!, stateCode!),
    enabled: !!countryCode && !!stateCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch autocomplete suggestions for address input.
 * Only queries when input is 3+ characters long.
 */
export const useAddressAutocomplete = (
  input: string,
  sessionToken?: string,
) => {
  return useQuery({
    queryKey: ["locations", "autocomplete", input, sessionToken],
    queryFn: () => getAutocomplete(input, sessionToken),
    enabled: input.length > 2,
    staleTime: 0, // Don't cache autocomplete results
  });
};

/**
 * Hook to fetch full place details from a Google Places ID.
 * Cached for 5 minutes since place details don't change frequently.
 */
export const usePlaceDetails = (placeId: string, sessionToken?: string) => {
  return useQuery({
    queryKey: ["locations", "place-details", placeId, sessionToken],
    queryFn: () => getPlaceDetails(placeId, sessionToken),
    enabled: !!placeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
