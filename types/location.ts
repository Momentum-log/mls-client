export interface Country {
  name: string;
  isoCode: string;
  flag?: string; // Optional, might be added by frontend or backend later
  currency?: string;
  latitude?: string;
  longitude?: string;
  phonecode?: string;
}

export interface State {
  name: string;
  isoCode: string;
  countryCode: string;
}

export interface City {
  name: string;
  countryCode: string;
  stateCode: string;
}

export interface AutocompleteSuggestion {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  street: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  zip: string;
  formattedAddress: string;
}

export interface DropoffCenterAddress {
  streetLines: string[];
  city: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
}

export interface DropoffCenter {
  id?: string;
  centerName: string;
  address: DropoffCenterAddress;
  distanceKm: number;
  operatingHours?: Record<string, string>;
  carrierCapabilities?: string[];
  locationType?: string;
}

export interface DropoffCenterSearchParams {
  carrierSlug?: string;
  address: DropoffCenterAddress;
  radiusKm?: number;
}

