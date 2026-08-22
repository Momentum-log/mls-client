import apiClient from "..";
import {
  CancelPickupResponse,
  ContinueToPayResponse,
  FulfillmentOptions,
  GetShipmentResponse,
  PickupAvailability,
  RequestPickupPayload,
  RequestPickupResponse,
  ShipmentMutationPayload,
  ShippingEstimatePayload,
  TrackingResponse,
} from "@/types/shipping";
import { DropoffCenter } from "@/types/location";
import { CreateShipmentResponse } from "@/types/invoice";

/**
 * Calculates shipping rates for a given package and route.
 * @param payload - Pickup, dropoff, and package details.
 * @returns List of available shipping rates.
 */
export const getShippingEstimate = async (payload: ShippingEstimatePayload) => {
  const response = await apiClient.post(
    "/shipments/get-shipping-estimate",
    payload,
  );
  return response.data;
};

/**
 * Gets quote rates for the marketing shipping estimate flow.
 * @param payload - Pickup, dropoff, and package details.
 * @returns List of available quote rates.
 */
export const getShippingQuote = async (payload: ShippingEstimatePayload) => {
  const response = await apiClient.post(
    "/shipments/get-shipping-quote",
    payload,
  );
  return response.data;
};

/**
 * Retrieves details for a specific shipment.
 * @param id - Shipment ID.
 */
export const getShipment = async (id: string) => {
  const response = await apiClient.get<GetShipmentResponse>(
    `/shipments/get-shipment/${id}`,
  );
  return response.data;
};

/**
 * Reports what this shipment's carrier supports.
 *
 * Call before rendering any fulfillment control. The five fulfillment
 * endpoints are shipment-scoped and take neither a carrier nor an address —
 * both are already on the shipment record.
 *
 * @param id - Shipment ID.
 */
export const getFulfillmentOptions = async (id: string) => {
  const response = await apiClient.get<FulfillmentOptions>(
    `/shipments/${id}/fulfillment-options`,
  );
  return response.data;
};

/**
 * Dates and time windows the carrier will collect on.
 * @param id - Shipment ID.
 */
export const getPickupAvailability = async (id: string) => {
  const response = await apiClient.get<PickupAvailability>(
    `/shipments/${id}/pickup-availability`,
  );
  return response.data;
};

/**
 * Books a courier collection.
 *
 * Runs synchronously against the carrier, so a refusal reaches the customer.
 * A refusal does not damage the shipment — the label already exists and stays
 * valid for drop-off.
 *
 * @param id - Shipment ID.
 * @param payload - Schedule and optional driver remarks (max 60 chars).
 */
export const requestPickup = async (
  id: string,
  payload: RequestPickupPayload,
) => {
  const response = await apiClient.post<RequestPickupResponse>(
    `/shipments/${id}/request-pickup`,
    payload,
  );
  return response.data;
};

/**
 * Nearby drop-off locations, nearest first.
 *
 * Informational: labels are not location-locked, so the customer may use any
 * compatible location regardless of what is shown here.
 *
 * @param id - Shipment ID.
 * @param radiusKm - Search radius, 1-50. Defaults to 25 server-side.
 */
export const getShipmentDropoffCenters = async (
  id: string,
  radiusKm?: number,
) => {
  const response = await apiClient.get<DropoffCenter[]>(
    `/shipments/${id}/dropoff-centers`,
    { params: radiusKm ? { radiusKm } : undefined },
  );
  return response.data;
};

/**
 * Cancels a scheduled pickup, returning the shipment to AWAITING_FULFILLMENT.
 *
 * Carriers refuse cancellation once a courier is dispatched. Never clear the
 * pickup optimistically — if this fails the pickup is still live, and showing
 * it as cancelled sends a driver to an address the customer thinks is settled.
 *
 * @param id - Shipment ID.
 */
export const cancelPickup = async (id: string) => {
  const response = await apiClient.delete<CancelPickupResponse>(
    `/shipments/${id}/pickup`,
  );
  return response.data;
};

/**
 * Initializes a shipment and creates a Stripe Checkout session.
 * @param payload - Carrier, addresses, package, and selected rate.
 * @returns Shipment ID and Stripe checkout URL.
 */
export const createShipment = async (payload: ShipmentMutationPayload) => {
  const response = await apiClient.post<CreateShipmentResponse>(
    "/shipments/create-shipment",
    payload,
  );
  return response.data;
};

/**
 * Retrieves real-time tracking status for a shipment.
 * @param trackingNumber - Internal MLS tracking number.
 */
export const trackShipment = async (trackingNumber: string) => {
  const response = await apiClient.get<TrackingResponse>(
    `/shipments/track-shipment/${trackingNumber}`,
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

/**
 * Initiates the payment process for an existing unpaid shipment.
 * @param id - Shipment ID.
 * @returns Object containing the checkout URL.
 */
export const continueToPay = async (id: string) => {
  const response = await apiClient.post<ContinueToPayResponse>(
    `/shipments/${id}/pay`,
  );
  return response.data;
};
