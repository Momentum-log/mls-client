import { useMutation } from "@tanstack/react-query";
import { getShippingEstimate } from "@/api/shipping";
import {
  ShippingEstimatePayload,
  ShippingEstimateResponse,
} from "@/types/shipping";

export const useGetShippingEstimate = () => {
  return useMutation<ShippingEstimateResponse, Error, ShippingEstimatePayload>({
    mutationFn: getShippingEstimate,
  });
};
