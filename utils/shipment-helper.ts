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

/**
 * Maps a Shipment object to the partial store state required for re-creation.
 * Includes customs data when available for international shipments.
 * Used in the "Duplicate Shipment" feature to repopulate the form with previous data.
 */
export const mapShipmentToStore = (shipment: Shipment) => {
  const mapAddress = (addr: any) => ({
    name: addr.contact?.personName || "",
    company: addr.contact?.companyName || "",
    phone: addr.contact?.phoneNumber || "",
    street: addr.streetLines?.join(" ") || "",
    city: addr.city,
    postalCode: addr.postalCode,
    country: addr.countryCode,
    stateOrProvinceCode: addr.stateOrProvinceCode,
  });

  // Map package
  // Store uses 'Package' interface (id, weight, length, width, height, description, value, currency)
  const pkg = {
    id: crypto.randomUUID(),
    weight: shipment.weight.value,
    length: shipment.dimensions.length,
    width: shipment.dimensions.width,
    height: shipment.dimensions.height,
    description: shipment.customs?.contentsDescription || "Merchandise",
    value: shipment.customs?.declaredValue || 1,
    currency: shipment.customs?.currency || shipment.currency,
  };

  return {
    sender: mapAddress(shipment.pickupAddress),
    recipient: mapAddress(shipment.dropoffAddress),
    packages: [pkg],
    customs: shipment.customs || null,
  };
};
