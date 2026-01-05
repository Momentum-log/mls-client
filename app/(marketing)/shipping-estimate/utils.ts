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
    "Priority Express"
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
  data: ShippingEstimateResponse
): ShippingEstimateResponse => {
  // We deep clean the entire structure
  return deepClean(data) as ShippingEstimateResponse;
};

// --- Payload Helper ---

import {
  CreateShipmentPayload,
  LocalShipmentPayload,
  InternationalShipmentPayload,
} from "@/types/shipping";

export const getPayload = (
  isInternational: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): CreateShipmentPayload => {
  if (isInternational) {
    // TypeScript enforces 'customs' here
    const payload: InternationalShipmentPayload = {
      ...data,
      customs: {
        declaredValue: data.customs?.declaredValue || 10,
        contentsDescription: data.customs?.contentsDescription || "Merchandise",
        currency: data.customs?.currency || "USD",
      },
    };
    return payload;
  } else {
    // TypeScript ensures 'customs' is undefined here
    const payload: LocalShipmentPayload = {
      ...data,
      customs: undefined,
    };
    return payload;
  }
};
