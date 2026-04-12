import { ShippingEstimateResponse } from "@/types/shipping";
import {
  CreateShipmentPayload,
  Customs,
  CustomsData,
  InternationalShipmentPayload,
  LocalShipmentPayload,
  ShipmentMutationPayload,
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
}

interface EstimatePackageInput {
  weight: ShippingEstimatePayload["package"]["weight"];
  dimensions: ShippingEstimatePayload["package"]["dimensions"];
}

type CreatePayloadInput = Omit<ShipmentMutationPayload, "customs"> & {
  customs?: Customs;
};

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
  data: CreatePayloadInput,
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
  pickup: EstimateLocationInput,
  dropoff: EstimateLocationInput,
  pkg: EstimatePackageInput,
  guestId: string,
  userCountryCode?: string,
  customs?: CustomsData,
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
    ...(customs && { customs }),
    email: pickup.email,
    phone: pickup.phoneNumber,
  };
};
