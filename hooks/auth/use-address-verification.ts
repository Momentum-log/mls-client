import { useMutation, useQuery } from "@tanstack/react-query";
import { getAddressStatus, submitAddressUpdateRequest } from "@/api/auth";
import {
  AddressStatusResponse,
  AddressUpdateRequestPayload,
} from "@/types/address-verification";

/**
 * Fetches current address verification status and latest request information.
 */
export const useAddressVerificationStatus = () => {
  return useQuery<AddressStatusResponse>({
    queryKey: ["address-verification-status"],
    queryFn: getAddressStatus,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: false,
  });
};

/**
 * Submits address update request with proof file.
 */
export const useSubmitAddressUpdateRequest = () => {
  return useMutation<unknown, Error, AddressUpdateRequestPayload>({
    mutationFn: (payload) => submitAddressUpdateRequest(payload),
  });
};
