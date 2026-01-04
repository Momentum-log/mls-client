import { ShippingEstimatePayload } from "@/types/shipping";
import apiClient from "..";

export const getShippingEstimate = async (payload: ShippingEstimatePayload) => {
  const response = await apiClient.post("/shipping/estimate", payload);
  return response.data;
};
