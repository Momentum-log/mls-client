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
