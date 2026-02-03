import apiClient from "@/api";
import { City, Country, State } from "@/types/location";

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
