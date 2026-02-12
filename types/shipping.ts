export interface ShippingRate {
  carrier: "FedEx" | "DHL";
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

export interface Customs {
  currency: string;
  declaredValue: number;
  contentsDescription: string;
}

export interface PackageDetails {
  weight: Weight;
  dimensions: Dimensions;
}

/**
 * Simplified Address for shipping estimates.
 * Removes contact information as it's not required for quoting.
 */
export interface EstimateAddress {
  city: string;
  postalCode: string;
  countryCode: string;
  residential: boolean;
  streetLines: string[];
  stateOrProvinceCode: string;
  email?: string;
  phoneNumber?: string;
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
 * 'customs' is NOT required for estimates regardless of the route.
 * Addresses do NOT require contact details for estimates.
 */
export interface ShippingEstimatePayload {
  pickup: EstimateAddress;
  dropoff: EstimateAddress;
  package: EstimatePackageDetails;
  guestId: string;
  /** Optional ISO 3166-1 alpha-2 country code for currency determination (e.g., 'PL', 'DE') */
  userCountryCode?: string;
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
  carrier: "FedEx" | "DHL" | "MLS"; // Added MLS as it might be transformed
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

export interface ShippingEstimateResponse {
  estimateId: string;
  rates: Rate[];
  errors?: {
    carrier: string;
    hasError: boolean;
    errorCode: number;
    details: string;
  }[];
  guestId: string;
}

/**
 * Use this for Local Shipments (e.g. PL to PL).
 * 'customs' is strictly optional (and usually not needed).
 */
export interface LocalShipmentPayload {
  carrierName: string; // e.g. "FedEx", "MLS"
  pickupAddress: Address;
  dropoffAddress: Address;
  package: PackageDetails;
  rate: Rate;
  customs?: never; // Using 'never' ensures you DON'T pass it by mistake
  userCountryCode?: string;
}

/**
 * Use this for International Shipments (e.g. PL to US).
 * 'customs' is REQUIRED. TypeScript will error if you forget it.
 */
export interface InternationalShipmentPayload {
  carrierName: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  package: PackageDetails;
  rate: Rate;
  customs: Customs; // <--- Mandatory
  userCountryCode?: string;
}

// Union type helper if you need to handle both generically
export type CreateShipmentPayload =
  | LocalShipmentPayload
  | InternationalShipmentPayload;

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
  carrier: string;
  status: string;
  timeline: TrackingTimeline[];
  shipment: Shipment;
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
  shipmentStatus: "IN_TRANSIT" | "DELIVERED" | "PENDING" | "EXCEPTION" | string;
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED" | string;
  serviceType: string;
  serviceName: string;
  labelUrl: string | null;

  // --- Financials ---
  currency: string;
  carrierPrice: number;
  actualPrice: number;

  // --- Physical Specs ---
  weight: Weight;
  dimensions: Dimensions;
  customs?: Customs;

  // --- Logistics ---
  pickupAddress: Address;
  dropoffAddress: Address;
  carrier: CarrierInfo;

  // --- Timestamps ---
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentStats {
  totalSpent: number;
  totalShipments: number;
  currency: string;
}

export interface GetShipmentResponse extends Shipment {
  tracking: {
    trackingNumber: string;
    lastUpdate: string;
    estimatedDelivery: string;
    status: string;
    timeline: TrackingTimeline[];
  };
}
