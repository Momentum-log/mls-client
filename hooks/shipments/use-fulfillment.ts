import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelPickup,
  getFulfillmentOptions,
  getPickupAvailability,
  getShipmentDropoffCenters,
  requestPickup,
} from "@/api/shipments";
import {
  CancelPickupResponse,
  FulfillmentOptions,
  PickupAvailability,
  RequestPickupPayload,
  RequestPickupResponse,
} from "@/types/shipping";
import { DropoffCenter } from "@/types/location";

export const fulfillmentKeys = {
  options: (shipmentId: string) => ["fulfillment-options", shipmentId] as const,
  availability: (shipmentId: string) =>
    ["pickup-availability", shipmentId] as const,
  dropoffCenters: (shipmentId: string, radiusKm: number) =>
    ["shipment-dropoff-centers", shipmentId, radiusKm] as const,
};

/**
 * What this shipment's carrier supports, and where fulfillment currently
 * stands. Call before rendering any fulfillment control.
 *
 * @param pollWhilePending - Re-fetch on an interval. Set while the shipment is
 * `PAID`, where the label is still being created and the endpoint answers 409
 * until it exists. Without this the customer arriving straight from checkout
 * sees a dead end and has to refresh by hand.
 */
export const useFulfillmentOptions = (
  shipmentId: string,
  options?: { enabled?: boolean; pollWhilePending?: boolean },
) => {
  return useQuery<FulfillmentOptions, Error>({
    queryKey: fulfillmentKeys.options(shipmentId),
    queryFn: () => getFulfillmentOptions(shipmentId),
    enabled: Boolean(shipmentId) && (options?.enabled ?? true),
    refetchInterval: options?.pollWhilePending ? 5000 : false,
    retry: false,
  });
};

/**
 * Dates the carrier will actually collect on.
 *
 * Only fetch once `/fulfillment-options` reports `pickupSupported` — otherwise
 * this answers 403.
 */
export const usePickupAvailability = (
  shipmentId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery<PickupAvailability, Error>({
    queryKey: fulfillmentKeys.availability(shipmentId),
    queryFn: () => getPickupAvailability(shipmentId),
    enabled: Boolean(shipmentId) && (options?.enabled ?? true),
    retry: false,
  });
};

/**
 * Nearby drop-off locations. Informational — labels are not location-locked.
 */
export const useShipmentDropoffCenters = (
  shipmentId: string,
  radiusKm = 25,
  options?: { enabled?: boolean },
) => {
  return useQuery<DropoffCenter[], Error>({
    queryKey: fulfillmentKeys.dropoffCenters(shipmentId, radiusKm),
    queryFn: () => getShipmentDropoffCenters(shipmentId, radiusKm),
    enabled: Boolean(shipmentId) && (options?.enabled ?? true),
    retry: false,
  });
};

/**
 * Books a courier collection.
 *
 * On failure the shipment is untouched — the label exists and stays valid for
 * drop-off — so callers must surface the error without closing off either
 * option.
 */
export const useRequestPickup = (shipmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<RequestPickupResponse, Error, RequestPickupPayload>({
    mutationFn: (payload) => requestPickup(shipmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.options(shipmentId),
      });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
  });
};

/**
 * Cancels a scheduled pickup.
 *
 * State is refreshed from the server rather than assumed. A carrier that
 * refuses cancellation leaves the pickup live, and optimistically clearing it
 * would send a driver to an address the customer believes is settled.
 */
export const useCancelPickup = (shipmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<CancelPickupResponse, Error, void>({
    mutationFn: () => cancelPickup(shipmentId),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fulfillmentKeys.options(shipmentId),
      });
      queryClient.invalidateQueries({ queryKey: ["shipment", shipmentId] });
    },
  });
};
