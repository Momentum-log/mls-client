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
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
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
  dimDivisorType: string;
  currency: string;
  rateScale: string;
}

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
  serviceType: string;
  serviceName: string;
  packagingType?: string;
  ratedShipmentDetails?: RatedShipmentDetail[];
  operationalDetail?: OperationalDetail;
  signatureOptionType?: string;
  serviceDescription?: ServiceDescription;
  deliveryDescription?: string;
  warnings?: string[];
  price?: number;
  currency?: string;
}

export interface ShippingEstimateResponse {
  estimateId: string;
  rates: Rate[];
  guestId: string;
}

// ... other types for Shipment
