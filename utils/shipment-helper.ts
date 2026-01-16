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
  // Primary: personName + city from dropoffAddress data
  const dropoffPerson = shipment.dropoffAddress?.contact?.personName;
  const dropoffCity = shipment.dropoffAddress?.city;

  if (dropoffPerson && dropoffCity) {
    return `${dropoffPerson} • ${dropoffCity}`;
  }

  // Fallback to origin/destination if available (using city/country)
  const origin = shipment.pickupAddress?.city;
  const destination = shipment.dropoffAddress?.city;

  if (origin && destination) {
    return `${origin} → ${destination}`;
  }

  if (shipment.dropoffAddress?.contact?.personName) {
    return `To ${shipment.dropoffAddress.contact.personName}`;
  }

  return (
    shipment.customTrackingNumber ||
    shipment.carrierTrackingNumber ||
    `Shipment ${shipment.id.slice(0, 8)}`
  );
};
