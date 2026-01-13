import apiClient from "..";
import { ShippingEstimatePayload } from "@/types/shipping";

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
 * Initializes a shipment and creates a Stripe Checkout session.
 * @param payload - Carrier, addresses, package, and selected rate.
 * @returns Shipment ID and Stripe checkout URL.
 */
export const createShipment = async (payload: any) => {
  const response = await apiClient.post("/shipments/create-shipment", payload);
  return response.data;
};

/**
 * Retrieves real-time tracking status for a shipment.
 * @param trackingNumber - Internal MLS tracking number.
 */
export const trackShipment = async (trackingNumber: string) => {
  const response = await apiClient.get(
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
