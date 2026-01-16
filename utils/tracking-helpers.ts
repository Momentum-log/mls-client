import { Shipment } from "@/types/shipping";

// Core replacements
const replaceFedExText = (text: string): string => {
  if (!text) return text;

  let result = text;
  // "fedex" (lowercase) -> "mls"
  // "FedEx" / "FEDEX" / "Fedex" (mixed/caps) -> "MLS"
  result = result.replace(/fedex/g, "mls"); // Exact lowercase match
  result = result.replace(/FedEx/g, "MLS"); // Standard
  result = result.replace(/FEDEX/g, "MLS"); // ALL CAPS
  result = result.replace(/Fedex/g, "MLS"); // Title case
  return result;
};

// Formatting/humanizing helper
const humanizeServiceTerms = (text: string): string => {
  let result = replaceFedExText(text);

  // Specific Service Name Simplifications
  result = result.replace(/International Connect Plus/gi, "Connect+");
  result = result.replace(
    /International Priority Express/gi,
    "Priority Express"
  );
  result = result.replace(/International First/gi, "First Class");
  result = result.replace(/International Priority/gi, "Priority");
  result = result.replace(/International Economy/gi, "Economy");

  return result;
};

// Deep recursive cleaner
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepClean = (obj: any): any => {
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
        newObj[key] = deepClean(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

export const transformShipmentData = (shipment: Shipment): Shipment => {
  return deepClean(shipment) as Shipment;
};
