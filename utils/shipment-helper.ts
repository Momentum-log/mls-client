import { Shipment } from "@/types/shipping";

/**
 * Formats a shipment status enum into a human-readable string.
 * Example: "IN_TRANSIT" -> "In Transit"
 */
export const formatStatus = (status: string) => {
  if (!status) return "Unknown";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Generates a meaningful display name for a shipment.
 */
export const getShipmentDisplayName = (shipment: Shipment) => {
  // User requested: personName + city from dropoffAddress data
  const dropoffPerson = shipment.dropoffAddress?.contact?.personName;
  const dropoffCity = shipment.dropoffAddress?.city;

  if (dropoffPerson && dropoffCity) {
    return `${dropoffPerson} • ${dropoffCity}`;
  }

  // Fallback to older logic if new fields aren't available
  if (shipment.description && shipment.description.trim() !== "") {
    return shipment.description;
  }

  // Try to use origin/destination Data if available
  const origin = shipment.origin || shipment.originData?.city;
  const destination = shipment.destination || shipment.destinationData?.city;

  if (origin && destination) {
    return `${origin} → ${destination}`;
  }

  if (shipment.recipientName) {
    return `To ${shipment.recipientName}`;
  }

  if (shipment.recipient?.contact?.personName) {
    return `To ${shipment.recipient.contact.personName}`;
  }

  return (
    shipment.customTrackingNumber ||
    shipment.trackingNumber ||
    `Shipment ${shipment.id.slice(0, 8)}`
  );
};
