import { ShippingEstimateResponse } from "@/types/shipping";
import {
  CustomsData,
  EstimateAddress,
  EstimateContact,
  ShippingEstimatePayload,
} from "@/types/shipping";
import {
  deepBrandCarrierDisplay,
  toDisplayCarrierName,
} from "@/utils/carrier-branding";

// Formatting/humanizing helper
const humanizeServiceTerms = (text: string): string => {
  let result = toDisplayCarrierName(text);

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
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const deepClean = <T>(obj: T): T => {
  if (typeof obj === "string") {
    return humanizeServiceTerms(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item)) as T;
  }

  if (!isRecord(obj)) {
    return obj;
  }

  const branded = deepBrandCarrierDisplay(obj);
  const transformed: Record<string, unknown> = {};

  Object.entries(branded).forEach(([key, value]) => {
    transformed[key] = deepClean(value);
  });

  return transformed as T;
};

// Entry point
export const transformShippingData = (
  data: ShippingEstimateResponse,
): ShippingEstimateResponse => {
  // We deep clean the entire structure
  return deepClean(data);
};

// --- Payload Helper ---

interface EstimateLocationInput {
  countryCode: string;
  stateOrProvinceCode?: string;
  city: string;
  postalCode?: string;
  streetLines?: string[];
  phoneNumber?: string;
  email?: string;
  /** A real contact name, when known. Without one no contact is sent (W2a). */
  personName?: string;
}

interface EstimatePackageInput {
  weight: {
    value: number;
    units: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    units: string;
  };
}

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
 * The contact for one end of a quote: only a real one. Carriers do not price
 * by contact, and a placeholder name ("Estimate") used to end up in the
 * stored quotes staff read on the Leads page (W2a).
 */
const contactFor = (location: EstimateLocationInput): EstimateContact | undefined =>
  location.personName?.trim()
    ? {
        personName: location.personName.trim(),
        ...(location.phoneNumber ? { phoneNumber: location.phoneNumber } : {}),
        ...(location.email ? { email: location.email } : {}),
      }
    : undefined;

const toEstimateAddress = (location: EstimateLocationInput): EstimateAddress => {
  const contact = contactFor(location);
  return {
    countryCode: location.countryCode,
    stateOrProvinceCode: location.stateOrProvinceCode || "",
    city: location.city,
    postalCode: location.postalCode || "00000",
    streetLines: location.streetLines || [],
    residential: false,
    ...(contact ? { contact } : {}),
  };
};

/**
 * Constructs the payload for getting shipping estimates: pickup, dropoff,
 * packages, guestId. A contact is included only when a real name is known;
 * the sender's email and phone always go top-level for lead capture.
 *
 * @param pickup - Pickup location (and the sender's contact, when known)
 * @param dropoff - Dropoff location (and the recipient's contact, when known)
 * @param packages - Array of package weights and dimensions
 * @param guestId - Guest identifier for non-authenticated users
 * @param userCountryCode - Optional ISO 3166-1 alpha-2 country code for currency
 */
export const getEstimatePayload = (
  pickup: EstimateLocationInput,
  dropoff: EstimateLocationInput,
  packages: EstimatePackageInput[],
  guestId: string,
  userCountryCode?: string,
  customs?: CustomsData,
  currency?: string,
): ShippingEstimatePayload => {
  return {
    pickup: toEstimateAddress(pickup),
    dropoff: toEstimateAddress(dropoff),
    packages: packages,
    guestId,
    ...(userCountryCode && { userCountryCode }),
    ...(customs && { customs }),
    ...(currency && { currency }),
    email: pickup.email,
    phone: pickup.phoneNumber,
  };
};
