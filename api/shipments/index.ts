import { AxiosResponse } from "axios";
import apiClient from "..";
import { ShippingEstimatePayload, TrackingResponse } from "@/types/shipping";

/**
 * Calculates shipping rates for a given package and route.
 * @param payload - Pickup, dropoff, and package details.
 * @returns List of available shipping rates.
 */
export const getShippingEstimate = async (payload: ShippingEstimatePayload) => {
  const response = await apiClient.post(
    "/shipments/get-shipping-estimate",
    payload
  );
  return response.data;
};

/**
 * Retrieves details for a specific shipment.
 * @param id - Shipment ID.
 */
export const getShipment = async (id: string) => {
  const response = await apiClient.get(`/shipments/get-shipment/${id}`);
  return response.data;
};

/**
 * Initializes a shipment and creates a Stripe Checkout session.
 * @param payload - Carrier, addresses, package, and selected rate.
 * @returns Shipment ID and Stripe checkout URL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createShipment = async (payload: any) => {
  const response = await apiClient.post("/shipments/create-shipment", payload);
  return response.data;
};

/**
 * Retrieves real-time tracking status for a shipment.
 * @param trackingNumber - Internal MLS tracking number.
 */
export const trackShipment = async (trackingNumber: string) => {
  const response = await apiClient.get<TrackingResponse>(
    `/shipments/track-shipment/${trackingNumber}`
  );
  return response.data;
};

/**
 * Fetches the shipment history for the authenticated user.
 */
export const getShipmentHistory = async () => {
  const response = await apiClient.get("/shipments/get-shipment-history");
  return response.data;
};

/**
 * Retrieves total spent and shipment count statistics.
 */
export const getShipmentStats = async () => {
  const response = await apiClient.get("/shipments/get-shipment-stats");
  return response.data;
};
