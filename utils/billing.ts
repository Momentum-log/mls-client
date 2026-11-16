import type { BillingProfile, TaxCheckStatus } from "@/types/billing";

/** EU member states (ISO codes), for choosing the right tax ID label. */
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE",
]);

/** What the tax ID is called in the customer's billing country. */
export const taxIdLabel = (countryCode: string): string => {
  const country = countryCode.toUpperCase();
  if (country === "PL") return "NIP";
  return EU_COUNTRIES.has(country) ? "EU VAT number" : "Tax ID";
};

/**
 * What to tell the customer about a tax ID check. `UNAVAILABLE` is never an
 * error: the registry could not answer, so we verify the number ourselves and
 * the invoice follows once that is done.
 */
export const taxCheckNotice = (
  status: TaxCheckStatus,
): { tone: "ok" | "warn" | "info"; text: string } | null => {
  switch (status) {
    case "VALID":
      return { tone: "ok", text: "This number is verified." };
    case "INVALID":
      return {
        tone: "warn",
        text: "We could not find this number in the official register. Check it, or untick the business option to order as a private customer.",
      };
    case "UNAVAILABLE":
      return {
        tone: "info",
        text: "We could not check this number right now. You can continue: we will verify it for you, and your invoice will be sent once it is confirmed.",
      };
    case "NOT_REQUIRED":
      return null;
  }
};

/** True when the saved business number is still waiting for a registry answer. */
export const isTaxCheckPending = (profile: BillingProfile | null): boolean =>
  !!profile?.isBusiness && profile.lastValidation?.status === "UNAVAILABLE";
