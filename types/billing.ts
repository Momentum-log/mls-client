/**
 * Billing details saved on the account, and the tax ID check.
 * Server contract: `GET/PUT /account/billing-profile`, `POST /billing/validate-tax-id`.
 */

/** UNAVAILABLE means the registry could not answer; it is never "invalid". */
export type TaxCheckStatus = "VALID" | "INVALID" | "UNAVAILABLE" | "NOT_REQUIRED";

export interface TaxCheck {
  status: TaxCheckStatus;
  provider: "BIALA_LISTA" | "VIES" | "NONE";
  normalizedId: string;
  checkedAt: string;
}

export interface BillingProfile {
  fullName: string;
  companyName: string | null;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email: string;
  phone: string;
  isBusiness: boolean;
  taxId: string | null;
  /** The last registry answer for `taxId`, when it is a business. */
  lastValidation: Pick<TaxCheck, "status" | "provider" | "checkedAt"> | null;
}

/** What the form sends. */
export interface BillingProfileInput {
  fullName: string;
  street: string;
  postalCode: string;
  city: string;
  countryCode: string;
  email: string;
  phone: string;
  isBusiness: boolean;
  companyName?: string | null;
  taxId?: string | null;
}

/** Seeds the form once from the account when nothing is saved yet. */
export interface BillingPrefill {
  fullName: string;
  email: string;
  isBusiness: boolean;
  companyName: string | null;
  taxId: string | null;
}

export interface BillingProfileResponse {
  profile: BillingProfile | null;
  /** True when every required field is filled. */
  complete: boolean;
  prefill: BillingPrefill | null;
  requirements: { addressProof: boolean };
}

export interface SaveBillingProfileResponse {
  profile: BillingProfile;
  complete: boolean;
}

/**
 * Server reasons that mean "billing details are needed before shipping".
 * `ADDRESS_PROOF_REQUIRED` is a switch the company keeps off for now.
 */
export const BILLING_BLOCK_REASONS = [
  "BILLING_PROFILE_REQUIRED",
  "BILLING_PROFILE_INCOMPLETE",
  "ADDRESS_PROOF_REQUIRED",
] as const;

export type BillingBlockReason = (typeof BILLING_BLOCK_REASONS)[number];
