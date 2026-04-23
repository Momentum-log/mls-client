import { Shipment } from "@/types/shipping";
import {
  deepBrandCarrierDisplay,
  toDisplayCarrierName,
} from "@/utils/carrier-branding";

// Formatting/humanizing helper
const humanizeServiceTerms = (text: string): string => {
  let result = toDisplayCarrierName(text);

  // Specific Service Name Simplifications
  result = result.replace(/International Connect Plus/gi, "Connect+");
  result = result.replace(
    /International Priority Express/gi,
    "Priority Express",
  );
  result = result.replace(/International First/gi, "First Class");
  result = result.replace(/International Priority/gi, "Priority");
  result = result.replace(/International Economy/gi, "Economy");

  return result;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Deep recursive cleaner
export const deepClean = <T>(obj: T): T => {
  if (typeof obj === "string") {
    return humanizeServiceTerms(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item)) as T;
  }

  if (!isRecord(obj)) {
    return obj;
  }

  const base = deepBrandCarrierDisplay(obj);
  const result: Record<string, unknown> = {};

  Object.entries(base).forEach(([key, value]) => {
    result[key] = deepClean(value);
  });

  return result as T;
};

export const transformShipmentData = (shipment: Shipment): Shipment => {
  return deepClean(shipment);
};
