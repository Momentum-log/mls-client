import apiClient from "..";
import { ShippingEstimatePayload } from "./types";

export const getShippingEstimate = async (payload: ShippingEstimatePayload) => {
  const response = await apiClient.post("/shipping/estimate", payload);
  return response.data;
};
