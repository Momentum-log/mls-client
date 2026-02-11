import apiClient from "@/api";
import {
  AutocompleteSuggestion,
  City,
  Country,
  PlaceDetails,
  State,
} from "@/types/location";

/**
 * Fetches all available countries.
 */
export const getCountries = async (): Promise<Country[]> => {
  // Accessing response.data directly because axios returns the response object
  const response = await apiClient.get<Country[]>("/locations/countries");
  return response.data;
};

/**
 * Fetches states for a specific country.
 * @param countryCode 2-letter ISO country code
 */
export const getStates = async (countryCode: string): Promise<State[]> => {
  const response = await apiClient.get<State[]>(
    `/locations/countries/${countryCode}/states`,
  );
  return response.data;
};

/**
 * Fetches cities for a specific state in a country.
 * @param countryCode 2-letter ISO country code
 * @param stateCode ISO state code
 */
export const getCities = async (
  countryCode: string,
  stateCode: string,
): Promise<City[]> => {
  const response = await apiClient.get<City[]>(
    `/locations/countries/${countryCode}/states/${stateCode}/cities`,
  );
  return response.data;
};

/**
 * Fetches address autocomplete suggestions from Google Places.
 * @param input The text search string
 * @param sessiontoken Optional session token for billing optimization
 */
export const getAutocomplete = async (
  input: string,
  sessiontoken?: string,
): Promise<AutocompleteSuggestion[]> => {
  const response = await apiClient.get<AutocompleteSuggestion[]>(
    "/locations/autocomplete",
    {
      params: { input, sessiontoken },
    },
  );
  return response.data;
};

/**
 * Fetches full place details from Google Places.
 * @param placeId The unique identifier for a place
 * @param sessiontoken Optional session token (should match autocomplete call)
 */
export const getPlaceDetails = async (
  placeId: string,
  sessiontoken?: string,
): Promise<PlaceDetails> => {
  const response = await apiClient.get<PlaceDetails>(
    "/locations/place-details",
    {
      params: { placeId, sessiontoken },
    },
  );
  return response.data;
};
