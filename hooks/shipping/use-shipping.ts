import { useMutation } from "@tanstack/react-query";
import { getShippingEstimate } from "@/api/shipping";
import {
  ShippingEstimatePayload,
  ShippingEstimateResponse,
} from "@/api/shipping/types";

export const useGetShippingEstimate = () => {
  return useMutation<ShippingEstimateResponse, Error, ShippingEstimatePayload>({
    mutationFn: (payload: ShippingEstimatePayload) =>
      getShippingEstimate(payload),
  });
};
