import { useQuery } from "@tanstack/react-query";
import { getAutocomplete, getPlaceDetails } from "@/api/location";

/**
 * Hook to fetch address autocomplete suggestions.
 * @param input The search text
 * @param sessiontoken Optional session token for billing optimization
 */
export const useAutocomplete = (input: string, sessiontoken?: string) => {
  return useQuery({
    queryKey: ["locations", "autocomplete", input, sessiontoken],
    queryFn: () => getAutocomplete(input, sessiontoken),
    enabled: input.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch full place details.
 * @param placeId The unique identifier for a place
 * @param sessiontoken Optional session token
 */
export const usePlaceDetails = (
  placeId: string | null,
  sessiontoken?: string,
) => {
  return useQuery({
    queryKey: ["locations", "place-details", placeId, sessiontoken],
    queryFn: () => getPlaceDetails(placeId!, sessiontoken),
    enabled: !!placeId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
