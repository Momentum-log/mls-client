import { Invoice } from "./invoice";
import type { ShipmentStatus } from "@/utils/shipment-status";

export type { ShipmentStatus };

export interface ShippingRate {
  carrier: "FedEx" | "DHL" | "InPost" | string;
  serviceType: string;
  serviceName: string;
  carrierPrice: number;
  actualPrice: number;
  currency: string;
  deliveryDate?: string;
  deliveryDescription?: string;
  warnings?: string[];
}

export interface ShippingEstimate {
  estimateId: string;
  rates: ShippingRate[];
  errors: unknown[]; // Define more specifically if needed
  guestId?: string;
  createdAt?: string;
}

// 1. Helper Interfaces for nested structures
export interface Contact {
  personName: string;
  companyName: string;
  phoneNumber: string;
  email?: string;
}

export interface Address {
  city: string;
  contact: Contact;
  postalCode: string;
  countryCode: string;
  residential: boolean;
  streetLines: string[];
  stateOrProvinceCode: string;
}

export interface Weight {
  units: string; // e.g., "KG", "LB"
  value: number;
}

export interface Dimensions {
  units: string; // e.g., "CM", "IN"
  width: number;
  height: number;
  length: number;
}

export interface ItemDetail {
  nameEn: string;
  quantity: number;
  weight: number;
  value: number;
  tariffCode: string;
}

export type CustomsData =
  | {
      customsType: "S"; // Simplified clearance
      costsOfShipment?: number;
      currency: "PLN" | "EUR" | string;
      vatRegistrationNumber?: string;
      categoryOfItem: "9" | "11" | "21" | "31" | "32" | "91" | string;
      grossWeight: number;
      firstName: string;
      secondaryName: string;
      countryOfOrigin?: "PL" | string;
      additionalInfo?: string;
      customsItem: { item: ItemDetail | ItemDetail[] }[];
      nipNr: string;
      customAgreements?: {
        notExceedValue: boolean;
        notProhibitedGoods: true;
        notRestrictedGoods: true;
        invoiceContent: boolean;
      };
    }
  | {
      customsType: "I"; // Individual clearance
      costsOfShipment?: number;
      currency: "PLN" | "EUR" | string;
      vatRegistrationNumber?: string;
      categoryOfItem: "9" | "11" | "21" | "32" | string;
      grossWeight: number;
      firstName: string;
      secondaryName: string;
      countryOfOrigin?: "PL" | string;
      additionalInfo?: string;
      customsItem: { item: ItemDetail | ItemDetail[] }[];
      // Individual-only extras. All optional, despite what older revisions of
      // client-shipping-endpoints-guide.md claimed.
      eoriNr?: string;
      eoriNrReceiver?: string;
      vatRegistrationNumberReceiver?: string;
      invoiceNr?: string;
      invoiceDate?: string; // YYYY-MM-DD
      invoice?: string; // Base64
      customAgreements?: {
        notProhibitedGoods: true;
        notRestrictedGoods: true;
      };
    };

// Extracts the object where customsType is "I"
export type IndividualClearanceData = Extract<
  CustomsData,
  { customsType: "I" }
>;

export interface PackageDetails {
  weight: Weight;
  dimensions: Dimensions;
}

/**
 * Simplified Package for shipping estimates.
 * Removes customs information.
 */
export interface EstimatePackageDetails {
  weight: Weight;
  dimensions: Dimensions;
}

/**
 * Payload for getting shipping rates/estimates.
 * 'customs' is REQUIRED for international routes.
 */
export interface ShippingEstimatePayload {
  pickup: Address;
  dropoff: Address;
  packages: EstimatePackageDetails[];
  guestId?: string; // Keep consistent with docs
  /** Optional ISO 3166-1 alpha-2 country code for currency determination (e.g., 'PL', 'DE') */
  userCountryCode?: string;
  email?: string;
  phone?: string;
  customs?: CustomsData;
  /** Optional currency override (PLN or EUR) */
  currency?: string;
}

// Shipping estimate response

export interface Surcharge {
  type: string;
  description: string;
  level: string;
  amount: number;
}

export interface Tax {
  type: string;
  description: string;
  amount: number;
}

export interface ServiceName {
  type: string;
  encoding: string;
  value: string;
}

export interface ServiceDescription {
  serviceId: string;
  serviceType: string;
  code: string;
  names: ServiceName[];
  serviceCategory: string;
  description: string;
  astraDescription: string;
}

export interface OperationalDetail {
  ineligibleForMoneyBackGuarantee: boolean;
  astraDescription: string;
  airportId: string;
  serviceCode: string;
}

export interface ShipmentRateDetail {
  rateZone: string;
  ratingBasis: string;
  dimDivisor: number;
  fuelSurchargePercent: number;
  totalSurcharges: number;
  totalFreightDiscount: number;
  surCharges: Surcharge[]; // Note: JSON uses CamelCase 'surCharges' here
  taxes: Tax[];
  pricingCode: string;
  totalBillingWeight: Weight;
  packagingType?: string;
  customerReferences?: {
    value: string;
    type: string;
  }[];
  dimDivisorType: string;
  currency: string;
  rateScale: string;
}

// (Removed strictly typed payload duplicates to avoid conflicts with new definitions below)

export interface PackageRateDetail {
  rateType: string;
  ratedWeightMethod: string;
  baseCharge: number;
  netFreight: number;
  totalSurcharges: number;
  netFedExCharge: number;
  totalTaxes: number;
  netCharge: number;
  totalRebates: number;
  billingWeight: Weight;
  totalFreightDiscounts: number;
  surcharges: Surcharge[]; // Note: JSON uses lowercase 'surcharges' here
  currency: string;
}

export interface RatedPackage {
  groupNumber: number;
  effectiveNetDiscount: number;
  packageRateDetail: PackageRateDetail;
  sequenceNumber: number;
}

export interface RatedShipmentDetail {
  rateType: string;
  ratedWeightMethod: string;
  totalDiscounts: number;
  totalBaseCharge: number;
  totalNetCharge: number;
  totalNetFedExCharge: number;
  shipmentRateDetail: ShipmentRateDetail;
  ratedPackages: RatedPackage[];
  currency: string;
}

export interface Rate {
  // Common fields from various API responses
  serviceType: string;
  serviceName: string;
  carrier: string;
  carrierSlug?: string;
  actualPrice: number; // The user-facing price
  carrierPrice?: number; // The cost price
  price?: number; // Kept for generic compatibility if needed
  currency: string;
  deliveryDate?: string;
  deliveryDescription?: string;
  packagingType?: string;
  // Extras
  ratedShipmentDetails?: RatedShipmentDetail[];
  operationalDetail?: OperationalDetail;
  signatureOptionType?: string;
  serviceDescription?: ServiceDescription;
  warnings?: string[];
  totalPrice?: number; // Kept for backward compat
}

/** The three tier keys the server may return, in the order they should render. */
export const TIER_KEYS = ["fastest", "balanced", "economy"] as const;

export type TierKey = (typeof TIER_KEYS)[number];

/**
 * One bookable shipping option.
 *
 * A tier never exposes its carriers, its legs, or its per-leg prices — some
 * options run on one carrier end to end, others pass through our sorting
 * centre on two. That is ours to manage; the customer sees a price and a
 * delivery window.
 */
export interface ShippingTier {
  /**
   * Opaque handle for this option. Echo it back byte-for-byte at
   * create-shipment. Never parse it, never cache it across quotes, and never
   * infer anything from it.
   */
  routingRef: string;
  label: "Fastest" | "Balanced" | "Economy";
  /** Total price for the whole journey, in `currency`. */
  actualPrice: number;
  currency: string;
  transitDaysMin: number;
  transitDaysMax: number;
  deliveryDescription: string;
  warnings: string[];
}

/**
 * Any key may be absent — a route with one viable service returns one tier.
 * Render what you get; never pad the gap.
 */
export type ShippingTiers = Partial<Record<TierKey, ShippingTier>>;

export interface CarrierError {
  carrier: string;
  hasError: boolean;
  errorCode?: number;
  details?: string;
}

export interface ShippingEstimateResponse {
  estimateId: string;
  /**
   * Every direct carrier rate.
   *
   * Display only — these entries carry no `routingRef`, and the server resolves
   * a booking solely through `tiers`. Used by the marketing quote page, which
   * never books. Do not offer these as a bookable choice.
   */
  rates: Rate[];
  tiers?: ShippingTiers;
  errors?: CarrierError[];
  guestId: string;
}

export type FulfillmentType = "PICKUP" | "DROPOFF";

/**
 * What this shipment's carrier actually supports.
 *
 * Capability is reported per shipment because it is read from the carrier
 * adapter, and it varies as carriers are added. Never infer it from the
 * carrier's name.
 */
export interface FulfillmentOptions {
  shipmentId: string;
  currentFulfillment: "NONE" | FulfillmentType;
  pickupSupported: boolean;
  dropoffSupported: boolean;
  pickupStatus: PickupStatus;
  canCancelPickup: boolean;
  /** Display only — never send it back. */
  carrierDisplayName: string;
}

export interface PickupAvailability {
  /** Dates the carrier will collect, YYYY-MM-DD. Authoritative. */
  availableDates: string[];
  /** Latest allowed ready time, local to the pickup postal code. */
  cutoffTime: string;
  /**
   * The minimum window the courier needs, as an ISO-8601 duration
   * (e.g. `PT1H30M`). A length of time, not a time of day — never render it
   * on a clock.
   */
  accessTime: string;
  defaultReadyTime: string;
  residentialAvailable: boolean;
}

export interface RequestPickupPayload {
  scheduledDate: string;
  readyTime: string;
  closeTime: string;
  /** Capped at 60 characters by the carrier; rejected rather than truncated. */
  remarks?: string;
}

export interface RequestPickupResponse {
  pickupConfirmationCode: string;
  pickupLocationCode: string;
  scheduledDate: string;
  readyTime: string;
  closeTime: string;
  pickupStatus: PickupStatus;
  message: string;
  /** Currently always 0. Render only when non-zero. */
  pickupFee: number;
  currency: string;
}

export interface CancelPickupResponse {
  shipmentId: string;
  pickupStatus: PickupStatus;
  shipmentStatus: ShipmentStatus;
  message: string;
}

/** Carrier limit on the free-text driver instruction. */
export const PICKUP_REMARKS_MAX_LENGTH = 60;

export type PickupStatus =
  | "NONE"
  | "PENDING"
  | "CONFIRMED"
  | "MISSED"
  | "CANCELLED"
  | "COMPLETED";

export interface PickupDetails {
  scheduledDate: string; // YYYY-MM-DD
  readyTime: string; // HH:MM:SS
  closeTime: string; // HH:MM:SS
  remarks?: string;
}

export interface PickupAvailabilityParams {
  carrierSlug?: string;
  address: Address;
  pickupRequestType?: "SAME_DAY" | "FUTURE_DAY";
  domestic?: boolean;
}

export interface PickupAvailabilityResult {
  availableDates: string[];
  cutoffTime: string;
  accessTime: string;
  defaultReadyTime: string;
}

/** Billing address. Flat, and distinct from the canonical shipping `Address`. */
export interface BillingAddress {
  street: string;
  city: string;
  postalCode: string;
  countryCode: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

/**
 * The create-shipment request body.
 *
 * `estimateId` + `routingRef` are the entire booking instruction. The server
 * recovers the carrier, the service and the price from the persisted estimate,
 * so the client sends none of them.
 *
 * Deliberately absent, and rejected by the server: `carrierSlug`, `rate`,
 * `fulfillmentType`, `pickupDetails`, `dropoffCenterId`. Fulfillment is chosen
 * after payment, once the carrier and the leg are known.
 */
export interface CreateShipmentPayload {
  estimateId: string;
  /** Opaque handle from `tiers`. Echo byte-for-byte; never parse or rebuild. */
  routingRef: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  packages: PackageDetails[];
  /** Required by the server when the two countries differ. */
  customs?: CustomsData;
  userCountryCode?: string;
  preferredPaymentOption?: "payu" | "stripe";
  /** Optional currency override (PLN or EUR) */
  currency?: string;
  billingAddress?: BillingAddress;
}

export type ShipmentMutationPayload = CreateShipmentPayload & {
  shipmentId?: string;
  invoiceId?: string;
};

// --- Verify Response ---

export interface VerifyPaymentResponse {
  status: "SUCCESS" | "FAILED";
  paymentStatus: string;
  shipmentStatus: string;
  trackingNumber?: string;
  labelUrl?: string;
  message?: string;
}

export interface TrackingTimeline {
  date: string;
  status: string;
  description: string;
  location: string;
}

export interface TrackingResponse {
  trackingNumber: string;
  carrier?: string;
  /**
   * The carrier's own free-text wording. Display only — never branch on it.
   * `"TRACKING_NOT_AVAILABLE"` when no carrier tracking number exists yet.
   */
  carrierStatus: string;
  /** The authoritative MLS lifecycle state. Branch on this. */
  shipmentStatus: ShipmentStatus;
  timeline: TrackingTimeline[];
  shipment?: Shipment;
}

/**
 * The raw carrier tracking payload, as nested under `tracking` on a
 * get-shipment response.
 *
 * Distinct from `TrackingResponse`, which is the shape of the dedicated
 * track-shipment endpoint. Here `status` is the carrier's own wording and is
 * display-only — the authoritative state is the sibling `shipmentStatus` on
 * the shipment itself.
 */
export interface CarrierTrackingData {
  trackingNumber?: string;
  status?: string;
  lastUpdate?: string;
  estimatedDelivery?: string;
  timeline?: TrackingTimeline[];
}

export interface CarrierInfo {
  id: string;
  name: string;
  commissionPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  apiKey?: string | null;
  apiSecret?: string | null;
  baseUrl?: string | null;
}

// Dependent interfaces (Address, Contact, etc.) remain the same...

export interface Shipment {
  // --- Core Identifiers ---
  id: string;
  userId: string;
  carrierId: string;

  // --- Tracking ---
  customTrackingNumber: string | null;
  carrierTrackingNumber: string | null;

  // --- Status & Service ---
  shipmentStatus: ShipmentStatus;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  serviceType: string;
  serviceName: string;
  labelUrl: string | null;

  // --- Fulfillment & Pickup ---
  fulfillmentType?: FulfillmentType;
  pickupStatus?: PickupStatus;
  pickupConfirmationCode?: string | null;
  pickupLocationCode?: string | null;
  scheduledPickupDate?: string | null;
  pickupReadyTime?: string | null;
  pickupCloseTime?: string | null;
  pickupRemarks?: string | null;
  dropoffCenterId?: string | null;
  supportAction?: string | null;

  // --- Financials ---
  currency: string;
  carrierPrice: number;
  actualPrice: number;

  // --- Physical Specs ---
  weight: Weight;
  dimensions: Dimensions;
  customs?: CustomsData;
  packages?: PackageDetails[];

  // --- Logistics ---
  pickupAddress: Address;
  dropoffAddress: Address;
  carrier: CarrierInfo;

  // --- Timestamps ---
  createdAt: string;
  updatedAt: string;

  // --- Invoice (optional, populated when fetching full shipment details) ---
  invoice?: Invoice; // ShipmentInvoice type from invoice.ts
  invoiceId?: string;
  tracking?: CarrierTrackingData;
}

export interface ShipmentStats {
  totalSpent: number;
  totalShipments: number;
  currency: string;
}

export interface GetShipmentResponse extends Shipment {
  invoice?: Invoice;
  pdfGenerationStatus?: string;
  pdfDownloadUrl?: string | null;
}

export interface ContinueToPayResponse {
  shipmentId: string;
  checkoutUrl?: string;
  invoice?: {
    id?: string;
    invoiceId?: string;
  };
}
