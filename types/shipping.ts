import { Invoice } from "./invoice";

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
      // Required specific individual items
      nipNr: string;
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
  package: EstimatePackageDetails;
  guestId?: string; // Keep consistent with docs
  /** Optional ISO 3166-1 alpha-2 country code for currency determination (e.g., 'PL', 'DE') */
  userCountryCode?: string;
  email?: string;
  phone?: string;
  customs?: CustomsData;
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
  carrierSlug: string; // e.g. "fedex", "mls"
  pickupAddress: Address;
  dropoffAddress: Address;
  package: PackageDetails;
  rate: Rate;
  customs?: never; // Using 'never' ensures you DON'T pass it by mistake
  userCountryCode?: string;
  preferredPaymentOption?: "payu" | "stripe";
}

/**
 * Use this for International Shipments (e.g. PL to US).
 * 'customs' is REQUIRED. TypeScript will error if you forget it.
 */
export interface InternationalShipmentPayload {
  carrierSlug: string;
  pickupAddress: Address;
  dropoffAddress: Address;
  package: PackageDetails;
  rate: Rate;
  customs: CustomsData; // <--- Mandatory
  userCountryCode?: string;
  preferredPaymentOption?: "payu" | "stripe";
}

// Union type helper if you need to handle both generically
export type CreateShipmentPayload =
  | LocalShipmentPayload
  | InternationalShipmentPayload;

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
  status: string;
  timeline: TrackingTimeline[];
  shipment?: Shipment;
}

export interface ShipmentTrackingSummary {
  trackingNumber: string;
  lastUpdate: string;
  estimatedDelivery: string;
  status: string;
  timeline: TrackingTimeline[];
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
  customs?: CustomsData;

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
  tracking?: TrackingResponse; // TrackingResponse
}

export interface ShipmentStats {
  totalSpent: number;
  totalShipments: number;
  currency: string;
}

export interface GetShipmentResponse extends Omit<Shipment, "tracking"> {
  tracking?: TrackingResponse | ShipmentTrackingSummary;
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
