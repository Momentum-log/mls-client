import type { Shipment, TrackingResponse } from "@/types/shipping";

/**
 * A minimal tracking response for a shipment that has no carrier tracking
 * number yet — an unpaid one, or one whose label is still being created.
 *
 * The server reports this case as `carrierStatus: "TRACKING_NOT_AVAILABLE"`
 * with an empty timeline rather than substituting another parcel's history,
 * which is what previously made brand-new shipments look like they were
 * already in transit.
 */
export const buildUnpaidTrackingResponse = (
  trackingId: string,
): TrackingResponse => ({
  trackingNumber: trackingId,
  carrierStatus: "TRACKING_NOT_AVAILABLE",
  shipmentStatus: "CREATED",
  timeline: [],
  shipment: {
    shipmentStatus: "CREATED",
    carrierTrackingNumber: trackingId,
  } as Shipment,
});
