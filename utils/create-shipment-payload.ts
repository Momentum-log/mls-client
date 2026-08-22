/**
 * Builds the create-shipment request body.
 *
 * Shared by the new-shipment flow and the invoice-renewal modal, which submit
 * the identical contract — the modal simply adds `shipmentId` + `invoiceId` to
 * put the server into update mode.
 *
 * The client no longer names a carrier or asserts a price. It sends the
 * estimate and the tier the customer chose; the server recovers the carrier,
 * the service and the price from the quote it persisted. That is what makes
 * multi-carrier routing possible — on a hub-routed shipment there is no single
 * carrier for the client to name.
 */

import type {
  Address,
  CustomsData,
  PackageDetails,
  ShipmentMutationPayload,
} from "@/types/shipping";

/** Flat address shape used by the form store and by `getPlaceDetails`. */
export interface FlatAddress {
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  stateOrProvinceCode?: string;
}

/** Converts the form's flat address into the canonical nested shape. */
export const toCanonicalAddress = (address: FlatAddress): Address => ({
  streetLines: [address.street],
  city: address.city,
  stateOrProvinceCode: address.stateOrProvinceCode || "",
  postalCode: address.postalCode,
  countryCode: address.country,
  residential: false,
  contact: {
    personName: address.name,
    phoneNumber: address.phone,
    companyName: address.company ?? "",
  },
});

export interface BuildCreateShipmentPayloadArgs {
  /** The quote these values came from. */
  estimateId: string;
  /** Opaque handle for the chosen tier. Must be passed through unmodified. */
  routingRef: string;
  sender: FlatAddress;
  recipient: FlatAddress;
  packages: PackageDetails[];
  customs?: CustomsData;
  userCountryCode?: string;
  currency?: string;
  preferredPaymentOption?: "stripe" | "payu";
  /** Present only when re-submitting an existing shipment (update mode). */
  shipmentId?: string;
  invoiceId?: string;
}

/**
 * @remarks Every value passed in must be raw. Display branding rewrites carrier
 * names inside strings, and a branded `routingRef` would fail to resolve
 * server-side and surface as an unrelated booking error.
 */
export const buildCreateShipmentPayload = ({
  estimateId,
  routingRef,
  sender,
  recipient,
  packages,
  customs,
  userCountryCode,
  currency,
  preferredPaymentOption,
  shipmentId,
  invoiceId,
}: BuildCreateShipmentPayloadArgs): ShipmentMutationPayload => ({
  estimateId,
  routingRef,
  pickupAddress: toCanonicalAddress(sender),
  dropoffAddress: toCanonicalAddress(recipient),
  packages,
  customs,
  userCountryCode,
  currency,
  preferredPaymentOption,
  shipmentId,
  invoiceId,
});
