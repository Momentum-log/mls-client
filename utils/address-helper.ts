export interface ParsedAddress {
  streetLines: string[];
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
}

export const resolveAddressFromString = async (
  query: string
): Promise<ParsedAddress> => {
  try {
    const fetchAddress = async (q: string) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          q
        )}&format=json&addressdetails=1&limit=1`
      );
      const data = await response.json();
      return data && data.length > 0 ? data[0] : null;
    };

    let result = await fetchAddress(query);

    // If no result and query has commas, try to search by less specific parts
    // e.g. "123 Main St, New York, NY 10001" -> try "10001" or "New York, NY"
    // This handles cases where street number might not be in OSM but zip is.
    if (!result && query.includes(",")) {
      const parts = query.split(",").map((p) => p.trim());
      // Try searching just the last part (often zip or country) combined with city if possible
      // Just a simple fallback for now: try searching the last 2 parts
      if (parts.length >= 2) {
        const fallbackQuery = parts.slice(-2).join(", ");
        console.warn(
          `Address not found strict, trying fallback: ${fallbackQuery}`
        );
        result = await fetchAddress(fallbackQuery);
      }
    }

    if (!result) {
      throw new Error(`Address not found: ${query}`);
    }

    const addr = result.address;

    // Helper to find valid city
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.hamlet ||
      addr.suburb ||
      addr.neighbourhood ||
      "";

    // Helper to find valid state
    const state = addr.state || addr.region || addr.province || "";

    return {
      streetLines: [
        [addr.house_number, addr.road].filter(Boolean).join(" "),
      ].filter(Boolean),
      city,
      stateOrProvinceCode: state,
      postalCode: addr.postcode || "",
      countryCode: (addr.country_code || "").toUpperCase(),
    };
  } catch (error) {
    console.error("Error resolving address:", error);
    // Return empty structure on failure so form can be filled manually
    return {
      streetLines: [],
      city: "",
      stateOrProvinceCode: "",
      postalCode: "",
      countryCode: "",
    };
  }
};
