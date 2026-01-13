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
  errors: any[]; // Define more specifically if needed
  guestId?: string;
  createdAt?: string;
}

export interface Address {
  streetLines: string[];
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
  contact?: {
    personName: string;
    phoneNumber: string;
    companyName?: string;
  };
}

interface Weight {
  units: string;
  value: number;
}

interface Dimensions {
  length: number;
  width: number;
  height: number;
  units: string;
}

interface PackageDetails {
  weight: Weight;
  dimensions: Dimensions;
}

export interface ShippingEstimatePayload {
  pickup: Address;
  dropoff: Address;
  package: PackageDetails;
  packagingType?:
    | "YOUR_PACKAGING"
    | "FEDEX_ENVELOPE"
    | "FEDEX_BOX"
    | "FEDEX_TUBE";
  guestId: string;
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
  guestId: string;
}

// --- Strict Shipment Types ---

export interface CustomsInfo {
  declaredValue: number;
  contentsDescription: string;
  currency: string; // e.g., "USD"
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
  customs: CustomsInfo; // <--- Mandatory
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

export interface Shipment {
  id: string;
  userId: string;
  carrierName: string;
  shipmentStatus: string;
  paymentStatus: string;
  actualPrice: number;
  currency: string;
  labelUrl: string | null;
  trackingNumber: string | null;
  customTrackingNumber: string | null;
  carrierTrackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  // Optional display fields often returned by refined API
  description?: string;
  origin?: string;
  destination?: string;
  recipientName?: string;
  pickupAddress?: Address;
  dropoffAddress?: Address;
  // Nested objects if needed for details
  recipient?: any;

  originData?: any; // Renamed to avoid conflict with 'origin' string if needed
  destinationData?: any; // Renamed to avoid conflict with 'destination' string if needed
}

export interface ShipmentStats {
  totalSpent: number;
  totalShipments: number;
  currency: string;
}
