import apiClient from "..";
import type {
  BillingProfileInput,
  BillingProfileResponse,
  SaveBillingProfileResponse,
  TaxCheck,
} from "@/types/billing";

/** The saved billing details, `complete`, and a prefill when none are saved. */
export const getBillingProfile = async (): Promise<BillingProfileResponse> => {
  const response = await apiClient.get<BillingProfileResponse>(
    "/account/billing-profile",
  );
  return response.data;
};

/**
 * Saves the billing details. The server checks a business tax ID with Biała
 * lista or VIES; a registry that is down still saves (the check is stored as
 * unavailable and repeated when an order is placed).
 */
export const saveBillingProfile = async (
  payload: BillingProfileInput,
): Promise<SaveBillingProfileResponse> => {
  const response = await apiClient.put<SaveBillingProfileResponse>(
    "/account/billing-profile",
    payload,
  );
  return response.data;
};

/** Checks a tax ID while the customer types. Rate limited by the server. */
export const validateTaxId = async (payload: {
  countryCode: string;
  taxId: string;
}): Promise<TaxCheck> => {
  const response = await apiClient.post<TaxCheck>(
    "/billing/validate-tax-id",
    payload,
  );
  return response.data;
};
