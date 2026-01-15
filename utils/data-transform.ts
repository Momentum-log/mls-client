/**
 * Deeply transforms a data object to replace specific carrier names with "MLS".
 * It recursively traverses objects and arrays.
 * matches: "FedEx", "DHL", "InPost" (case insensitive)
 * replaces with: "MLS" (preserving original casing style roughly)
 */

const REPLACEMENTS: Record<string, string> = {
  fedex: "mls",
  FedEx: "MLS",
  FEDEX: "MLS",
  Fedex: "MLS",
  dhl: "mls",
  DHL: "MLS",
  inpost: "mls",
  InPost: "MLS",
  Inpost: "MLS",
  INPOST: "MLS",
};

const CARRIER_REGEX = /(FedEx|DHL|InPost)/gi;

function replaceCarrierText(text: string): string {
  if (!text) return text;

  // Direct replacements from the map for specific known casings
  // We check for exact matches first for cleaner replacement if it's just the word
  if (REPLACEMENTS[text]) {
    return REPLACEMENTS[text];
  }

  // General regex replacement for occurrence within sentences
  return text.replace(CARRIER_REGEX, (match) => {
    // Try to match the casing of the found text
    if (match === match.toUpperCase()) return "MLS";
    if (match === match.toLowerCase()) return "mls";
    return "MLS"; // Default title case
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepTransformData<T>(data: T): T {
  if (typeof data === "string") {
    return replaceCarrierText(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepTransformData(item)) as unknown as T;
  }

  if (data !== null && typeof data === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newObj[key] = deepTransformData((data as any)[key]);
      }
    }
    return newObj as T;
  }

  return data;
}
