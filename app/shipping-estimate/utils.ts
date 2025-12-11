import { ShippingEstimateResponse } from "@/api/shipping/types";

// Core replacements
const replaceFedExText = (text: string): string => {
  if (!text) return text;

  let result = text;

  // 1. Global Aggressive Replace "FedEx" -> "MLS"
  // Handles: FedEx, FEDEX, fedex -> MLS, MLS, mls
  // We use a regex with case insensitive flag, but we might want to respect case?
  // User said: "If it is lowercase, it should also be lowercase mls, but as long as it is FedEx, it should be changed to MLS."

  // Simplest sturdy approach:
  result = result.replace(/FedEx/g, "MLS"); // Standard
  result = result.replace(/FEDEX/g, "MLS"); // ALL CAPS -> MLS (User said "maxed to MLS")
  result = result.replace(/fedex/g, "mls"); // lowercase

  // Also handle the specific case of "FEDEX_" in enums/codes if they are just strings
  // e.g. "FEDEX_INTERNATIONAL" -> "MLS_INTERNATIONAL"
  // The above replace(/FEDEX/g, "MLS") handles "FEDEX_" -> "MLS_"

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
const deepClean = (obj: any): any => {
  if (typeof obj === "string") {
    return humanizeServiceTerms(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item));
  }
  if (obj && typeof obj === "object") {
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
