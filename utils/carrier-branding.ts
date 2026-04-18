/**
 * Carrier display branding helpers.
 *
 * These helpers are strictly for UI display transformations.
 * Raw values from the backend must remain unchanged when sent back to APIs.
 */

const CARRIER_NAME_PATTERN = /\b(fedex|dhl|inpost)\b/gi;

const DEFAULT_SKIP_KEYS = new Set(["carrierSlug", "slug"]);

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const normalizeCarrierMatch = (match: string): string => {
  if (match === match.toLowerCase()) {
    return "mls";
  }

  return "MLS";
};

/**
 * Replaces public carrier names with MLS for display purposes.
 *
 * Example:
 * - "FedEx International Priority" -> "MLS International Priority"
 */
export const toDisplayCarrierName = (text: string): string => {
  if (!text) {
    return text;
  }

  return text.replace(CARRIER_NAME_PATTERN, (match) =>
    normalizeCarrierMatch(match),
  );
};

/**
 * Deeply applies carrier display branding to strings in a data structure.
 *
 * This returns a transformed copy and never mutates the original input.
 */
export const deepBrandCarrierDisplay = <T>(
  data: T,
  skipKeys: ReadonlySet<string> = DEFAULT_SKIP_KEYS,
): T => {
  if (typeof data === "string") {
    return toDisplayCarrierName(data) as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => deepBrandCarrierDisplay(item, skipKeys)) as T;
  }

  if (!isRecord(data)) {
    return data;
  }

  const transformed: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (skipKeys.has(key)) {
      transformed[key] = value;
      return;
    }

    transformed[key] = deepBrandCarrierDisplay(value, skipKeys);
  });

  return transformed as T;
};
