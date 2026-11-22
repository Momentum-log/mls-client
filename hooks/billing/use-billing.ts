import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBillingProfile,
  saveBillingProfile,
  validateTaxId,
} from "@/api/billing";
import type {
  BillingProfileInput,
  BillingProfileResponse,
  SaveBillingProfileResponse,
  TaxCheck,
} from "@/types/billing";

export const billingKeys = {
  profile: ["billing", "profile"] as const,
};

/** The saved billing details and whether they are complete. */
export const useBillingProfile = () =>
  useQuery<BillingProfileResponse, Error>({
    queryKey: billingKeys.profile,
    queryFn: getBillingProfile,
    staleTime: 1000 * 60,
  });

/** Saves the billing details and refreshes what the app knows about them. */
export const useSaveBillingProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<SaveBillingProfileResponse, Error, BillingProfileInput>({
    mutationFn: saveBillingProfile,
    onSuccess: (saved) => {
      queryClient.setQueryData<BillingProfileResponse>(
        billingKeys.profile,
        (previous) => ({
          profile: saved.profile,
          complete: saved.complete,
          prefill: null,
          requirements: previous?.requirements ?? { addressProof: false },
        }),
      );
    },
  });
};

/** Checks one tax ID; the caller decides when. */
export const useValidateTaxId = () =>
  useMutation<TaxCheck, Error, { countryCode: string; taxId: string }>({
    mutationFn: validateTaxId,
  });
