import { ShippingEstimateResponse } from "@/types/shipping";

// Core replacements
// Core replacements
const replaceFedExText = (text: string): string => {
  if (!text) return text;

  let result = text;

  // 1. Precise Logic:
  // "fedex" (lowercase) -> "mls"
  // "FedEx" / "FEDEX" / "Fedex" (mixed/caps) -> "MLS"

  // We use lookahead/behind or just precise string replacement order.
  // Replacing lowercase specific first might be safer if we want to preserve it,
  // but since 'FedEx' usually appears as a substring, global replace with function is best.

  result = result.replace(/fedex/g, "mls"); // Exact lowercase match
  result = result.replace(/FedEx/g, "MLS"); // Standard
  result = result.replace(/FEDEX/g, "MLS"); // ALL CAPS
  result = result.replace(/Fedex/g, "MLS"); // Title case

  return result;
};

// Formatting/humanizing helper
const humanizeServiceTerms = (text: string): string => {
  let result = replaceFedExText(text);

  // 2. Specific Service Name Simplifications
  // Note: regexes must match the *already replaced* text (i.e., looking for "MLS")

  // "MLS International Connect Plus" -> "MLS Connect+"
  result = result.replace(/International Connect Plus/gi, "Connect+");

  // "MLS International Priority Express" -> "MLS Priority Express"
  // "International Priority Express" -> "Priority Express"
  result = result.replace(
    /International Priority Express/gi,
    "Priority Express",
  );

  // "International First" -> "First Class"
  result = result.replace(/International First/gi, "First Class");

  // "International Priority" -> "Priority"
  // (Watch out not to break Priority Express if not matched above, but 'Priority Express' replaces 'International Priority Express' first)
  // To be safe against "MLS Priority Express", "International Priority" substring presence:
  // "Priority Express" doesn't have "International".
  // So if we have "MLS International Priority", change to "MLS Priority".
  result = result.replace(/International Priority/gi, "Priority");

  // "International Economy" -> "Economy"
  result = result.replace(/International Economy/gi, "Economy");

  return result;
};

// Deep recursive cleaner
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepClean = (obj: any): any => {
  if (typeof obj === "string") {
    return humanizeServiceTerms(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item));
  }
  if (obj && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // We do NOT change keys, only values
        newObj[key] = deepClean(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

// Entry point
export const transformShippingData = (
  data: ShippingEstimateResponse,
): ShippingEstimateResponse => {
  // We deep clean the entire structure
  return deepClean(data) as ShippingEstimateResponse;
};

// --- Payload Helper ---

import {
  CreateShipmentPayload,
  LocalShipmentPayload,
  InternationalShipmentPayload,
  ShippingEstimatePayload,
} from "@/types/shipping";

/**
 * Checks if a shipment is international based on country codes.
 */
export const checkIfInternational = (
  pickupCountry: string | undefined,
  dropoffCountry: string | undefined,
): boolean => {
  if (!pickupCountry || !dropoffCountry) return false;
  return pickupCountry.toUpperCase() !== dropoffCountry.toUpperCase();
};

/**
 * Constructs the payload for creating a shipment.
 * Enforces 'customs' only for international routes.
 */
export const getPayload = (
  isInternational: boolean,
  data: any,
): CreateShipmentPayload => {
  if (isInternational) {
    const payload: InternationalShipmentPayload = {
      ...data,
      customs: {
        declaredValue: data.customs?.declaredValue || 0,
        contentsDescription: data.customs?.contentsDescription || "",
        currency: data.customs?.currency || "USD",
      },
    };
    return payload;
  } else {
    // For local shipments, customs MUST be absent
    const { customs, ...rest } = data;
    const payload: LocalShipmentPayload = {
      ...rest,
    };
    return payload;
  }
};

/**
 * Constructs the payload for getting shipping estimates.
 * Follows the standard structure: pickup, dropoff, package, guestId.
 * Strips contact and customs information.
 *
 * @param pickup - Pickup location details (countryCode, stateOrProvinceCode, city)
 * @param dropoff - Dropoff location details (countryCode, stateOrProvinceCode, city)
 * @param pkg - Package weight and dimensions
 * @param guestId - Guest identifier for non-authenticated users
 * @param userCountryCode - Optional ISO 3166-1 alpha-2 country code for currency
 */
export const getEstimatePayload = (
  pickup: any,
  dropoff: any,
  pkg: any,
  guestId: string,
  userCountryCode?: string,
): ShippingEstimatePayload => {
  return {
    pickup: {
      countryCode: pickup.countryCode,
      stateOrProvinceCode: pickup.stateOrProvinceCode || "",
      city: pickup.city,
      postalCode: pickup.postalCode || "00000",
      streetLines: pickup.streetLines || [],
      residential: false,
      contact: {
        personName: "Estimate",
        companyName: "",
        phoneNumber: pickup.phoneNumber || "",
        email: pickup.email || "",
      },
    },
    dropoff: {
      countryCode: dropoff.countryCode,
      stateOrProvinceCode: dropoff.stateOrProvinceCode || "",
      city: dropoff.city,
      postalCode: dropoff.postalCode || "00000",
      streetLines: dropoff.streetLines || [],
      residential: false,
      contact: {
        personName: "Estimate",
        companyName: "",
        phoneNumber: "",
        email: "",
      },
    },
    package: {
      weight: pkg.weight,
      dimensions: pkg.dimensions,
    },
    guestId,
    ...(userCountryCode && { userCountryCode }),
    email: pickup.email,
    phone: pickup.phoneNumber,
  };
};
