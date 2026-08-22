/**
 * Shipment status vocabulary and action gates.
 *
 * `shipmentStatus` is the only authority on where a shipment sits in the MLS
 * lifecycle. The carrier's own wording arrives separately as `carrierStatus`
 * and is display-only — never branch on it.
 *
 * Every status comparison in the app should go through this module. Scattered
 * string literals are how we ended up gating a control on `"LABEL_CREATED"`,
 * a status the server has never emitted.
 */

/** The exact set the server can return. Mirrors `ShipmentStatus` in schema.prisma. */
export const SHIPMENT_STATUSES = [
  "CREATED",
  "PAID",
  "AWAITING_FULFILLMENT",
  "PICKUP_SCHEDULED",
  "AWAITING_DROPOFF",
  "AWAITING_HUB_CONFIRMATION",
  "LEG2_PENDING",
  "LEG2_CREATED",
  "CANCELLED",
  "IN_TRANSIT",
  "DELIVERED",
  "COMPLETED",
  "FAILED",
  "PAYMENT_FAILED",
  "CREATION_FAILED",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export type StatusTone = "info" | "success" | "warning" | "danger" | "neutral";

/**
 * Customer-facing labels.
 *
 * The three hub statuses deliberately collapse to "In Transit". A parcel moving
 * through our sorting centre is an implementation detail of how we honour the
 * delivery window — the customer has one tracking number and one label, and
 * telling them their parcel is "LEG2 Pending" answers a question they never
 * asked.
 */
export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  CREATED: "Awaiting Payment",
  PAID: "Preparing Label",
  AWAITING_FULFILLMENT: "Ready to Send",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  AWAITING_DROPOFF: "Awaiting Drop-off",
  AWAITING_HUB_CONFIRMATION: "In Transit",
  LEG2_PENDING: "In Transit",
  LEG2_CREATED: "In Transit",
  CANCELLED: "Cancelled",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  FAILED: "Failed",
  PAYMENT_FAILED: "Payment Failed",
  CREATION_FAILED: "Needs Attention",
};

export const SHIPMENT_STATUS_TONES: Record<ShipmentStatus, StatusTone> = {
  CREATED: "warning",
  PAID: "info",
  AWAITING_FULFILLMENT: "info",
  PICKUP_SCHEDULED: "info",
  AWAITING_DROPOFF: "info",
  AWAITING_HUB_CONFIRMATION: "info",
  LEG2_PENDING: "info",
  LEG2_CREATED: "info",
  CANCELLED: "neutral",
  IN_TRANSIT: "info",
  DELIVERED: "success",
  COMPLETED: "success",
  FAILED: "danger",
  PAYMENT_FAILED: "danger",
  CREATION_FAILED: "danger",
};

const STATUS_SET = new Set<string>(SHIPMENT_STATUSES);

/** Narrows an arbitrary string to a known status. */
export const isShipmentStatus = (value: string): value is ShipmentStatus =>
  STATUS_SET.has(value);

/**
 * Human-readable label, falling back to title-case for anything unrecognised so
 * a server-side addition degrades rather than rendering a raw enum.
 */
export const getStatusLabel = (status: string): string => {
  if (!status) return "Unknown";
  if (isShipmentStatus(status)) return SHIPMENT_STATUS_LABELS[status];

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getStatusTone = (status: string): StatusTone =>
  isShipmentStatus(status) ? SHIPMENT_STATUS_TONES[status] : "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
};

/** Badge colours for a status, so every list renders the same status alike. */
export const getStatusBadgeClasses = (status: string): string =>
  TONE_CLASSES[getStatusTone(status)];

const matches =
  (...statuses: ShipmentStatus[]) =>
  (status: string): boolean =>
    (statuses as string[]).includes(status);

/** Payment has not completed. The shipment is not actionable yet. */
export const isUnpaid = matches("CREATED", "PAYMENT_FAILED");

/**
 * Paid, but the carrier label is still being created.
 *
 * This is a transient state that resolves to `AWAITING_FULFILLMENT` on its own,
 * and it is the state a customer lands in immediately after checkout — so it
 * must be rendered as "working on it", never as an error.
 */
export const isLabelPending = matches("PAID");

/** Nothing further will happen without support intervention. */
export const isTerminal = matches(
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
  "PAYMENT_FAILED",
);

/** Paid for and still moving — what the dashboard's "active" count means. */
export const isActive = matches(
  "PAID",
  "AWAITING_FULFILLMENT",
  "PICKUP_SCHEDULED",
  "AWAITING_DROPOFF",
  "AWAITING_HUB_CONFIRMATION",
  "LEG2_PENDING",
  "LEG2_CREATED",
  "IN_TRANSIT",
);

/** The parcel has moved; a carrier timeline is worth showing. */
export const hasTracking = matches(
  "AWAITING_HUB_CONFIRMATION",
  "LEG2_PENDING",
  "LEG2_CREATED",
  "IN_TRANSIT",
  "DELIVERED",
  "COMPLETED",
);

/**
 * The window in which the customer can choose or change how the parcel reaches
 * the carrier. The five fulfillment endpoints return 409 outside it.
 */
export const canManageFulfillment = matches(
  "AWAITING_FULFILLMENT",
  "PICKUP_SCHEDULED",
  "AWAITING_DROPOFF",
);

/** Paid but no label — the one state that always needs a human. */
export const needsSupport = matches("CREATION_FAILED");

/** Arrived. `COMPLETED` is a delivered shipment that has been closed out. */
export const isDelivered = matches("DELIVERED", "COMPLETED");

/** Went wrong, as opposed to merely finished. */
export const isFailed = matches("FAILED", "PAYMENT_FAILED", "CREATION_FAILED");

/** Nothing to track and nothing to arrange — render an explanatory state. */
export const hasNoJourney = matches("FAILED", "CANCELLED", "CREATED");

/** Ended badly or was called off — no tracking will ever appear. */
export const isTerminalFailure = matches("FAILED", "CANCELLED");

/** Rough completion percentage for progress bars. */
export const getProgress = (status: string): number => {
  if (isUnpaid(status)) return 10;
  if (isLabelPending(status)) return 25;
  if (canManageFulfillment(status)) return 40;
  if (matches("DELIVERED", "COMPLETED")(status)) return 100;
  if (matches("FAILED", "CANCELLED", "PAYMENT_FAILED", "CREATION_FAILED")(status))
    return 100;
  if (hasTracking(status)) return 70;
  return 25;
};
