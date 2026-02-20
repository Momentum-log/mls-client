"use client";

import React from "react";
import { useFormikContext } from "formik";
import {
  useCountries,
  useStates,
  useCities,
} from "@/hooks/location/use-location";
import { Select } from "@/components/ui/select";
import { FaCity, FaMapLocationDot, FaGlobe, FaMapPin } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import PhoneInput from "@/components/ui/phone-input";

import { PlaceDetails } from "@/types/location";
import { cn } from "@/utils/cn";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

interface AddressFieldsProps {
  prefix?: string; // e.g. "pickup" or "dropoff" or undefined for flat structure
}

const AddressFields: React.FC<AddressFieldsProps> = ({ prefix }) => {
  const { values, setFieldValue, errors, touched, handleBlur } =
    useFormikContext<any>();

  // Helper to get field name with optional prefix
  const getFieldName = (name: string) => (prefix ? `${prefix}.${name}` : name);

  // Extract nested or flat values
  const countryKey = prefix ? "countryCode" : "country";
  const stateKey = "stateOrProvinceCode";
  const cityKey = "city";
  const zipKey = "postalCode";
  const streetKey = prefix ? "street" : "street"; // ShippingEstimatePage uses 'street' internally now
  const emailKey = "email";
  const phoneKey = "phoneNumber";

  const countryValue = prefix
    ? values[prefix]?.[countryKey]
    : values[countryKey];
  const stateValue = prefix ? values[prefix]?.[stateKey] : values[stateKey];
  const cityValue = prefix ? values[prefix]?.[cityKey] : values[cityKey];
  const zipValue = prefix ? values[prefix]?.[zipKey] : values[zipKey];
  const streetValue = prefix ? values[prefix]?.[streetKey] : values[streetKey];
  const emailValue = prefix ? values[prefix]?.[emailKey] : values[emailKey];
  const phoneValue = prefix ? values[prefix]?.[phoneKey] : values[phoneKey];

  // React Query Hooks
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();
  const { data: states = [], isLoading: isLoadingStates } =
    useStates(countryValue);
  const { data: cities = [], isLoading: isLoadingCities } = useCities(
    countryValue,
    stateValue,
  );

  // Handlers
  const handleCountryChange = (val: string) => {
    setFieldValue(getFieldName(countryKey), val);
    setFieldValue(getFieldName(stateKey), "");
    setFieldValue(getFieldName(cityKey), "");
  };

  const handleStateChange = (val: string) => {
    setFieldValue(getFieldName(stateKey), val);
    setFieldValue(getFieldName(cityKey), "");
  };

  const handleCityChange = (val: string) => {
    setFieldValue(getFieldName(cityKey), val);
  };

  const handlePlaceSelect = (details: PlaceDetails) => {
    let street = details.street;
    let city = details.city;

    // Fallback if structured data is missing
    if (!street || !city) {
      const parts = details.formattedAddress.split(",").map((s) => s.trim());
      if (!street && parts.length > 0) {
        street = parts[0];
      }
      if (!city && parts.length > 1) {
        // usually 2nd part has zip and city (e.g. "00-123 Warsaw")
        const cityPart = parts[1].replace(/[\d-]+/g, "").trim();
        if (cityPart) {
          city = cityPart;
        } else if (parts.length > 2) {
          city = parts[2].replace(/[\d-]+/g, "").trim();
        }
      }
    }

    setFieldValue(getFieldName(streetKey), street);
    setFieldValue(getFieldName(cityKey), city);
    setFieldValue(getFieldName(countryKey), details.countryCode);
    setFieldValue(getFieldName(stateKey), details.stateCode);
    setFieldValue(getFieldName(zipKey), details.zip);
  };

  // Options
  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.isoCode,
    icon: <FaGlobe className="text-brand-blue/60" />,
  }));

  const stateOptions = states.map((s) => ({
    label: s.name,
    value: s.isoCode,
    icon: <FaMapLocationDot className="text-brand-blue/60" />,
  }));

  const cityOptions = cities.map((c) => ({
    label: c.name,
    value: c.name,
    icon: <FaCity className="text-brand-blue/60" />,
  }));

  // Errors/Touched
  const getFieldError = (name: string) => {
    if (prefix) {
      return (errors[prefix] as any)?.[name];
    }
    return (errors as any)?.[name];
  };

  const getFieldTouched = (name: string) => {
    if (prefix) {
      return (touched[prefix] as any)?.[name];
    }
    return (touched as any)?.[name];
  };

  const countryError = getFieldError(countryKey);
  const countryTouched = getFieldTouched(countryKey);
  const stateError = getFieldError(stateKey);
  const stateTouched = getFieldTouched(stateKey);
  const cityError = getFieldError(cityKey);
  const cityTouched = getFieldTouched(cityKey);
  const zipError = getFieldError(zipKey);
  const zipTouched = getFieldTouched(zipKey);
  const streetTouched = getFieldTouched(streetKey);
  const emailError = getFieldError(emailKey);
  const emailTouched = getFieldTouched(emailKey);
  const phoneError = getFieldError(phoneKey);
  const phoneTouched = getFieldTouched(phoneKey);

  return (
    <>
      {/* Contact Fields - Only for Pickup */}
      {prefix === "pickup" && (
        <>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaEnvelope className="h-4 w-4" />
              </span>
              <Input
                name={getFieldName(emailKey)}
                value={emailValue || ""}
                onChange={(e) =>
                  setFieldValue(getFieldName(emailKey), e.target.value)
                }
                onBlur={handleBlur}
                placeholder="your@email.com"
                className={cn(
                  "pl-11",
                  emailTouched && emailError ? "border-red-500" : "",
                )}
              />
            </div>
            {emailTouched && emailError && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {emailError}
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <PhoneInput
              value={phoneValue || ""}
              onChange={(val: string) =>
                setFieldValue(getFieldName(phoneKey), val)
              }
              className={cn(phoneTouched && phoneError ? "border-red-500" : "")}
            />

            {phoneTouched && phoneError && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {phoneError}
              </p>
            )}
          </div>
        </>
      )}

      {/* Street Address - Full Width */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FaMapPin className="h-4 w-4" />
          </span>
          <LocationAutocomplete
            value={streetValue || ""}
            onChange={(val) => setFieldValue(getFieldName(streetKey), val)}
            onPlaceSelect={handlePlaceSelect}
            placeholder="Search for street address..."
            className={cn(
              "pl-11",
              streetTouched && !streetValue ? "border-red-500" : "",
            )}
          />
        </div>
      </div>

      {/* Country - Searchable Dropdown */}
      <div className="md:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Country
        </label>
        <Select
          options={countryOptions}
          value={countryValue || ""}
          onChange={handleCountryChange}
          placeholder="Select Country"
          className={countryTouched && countryError ? "border-red-500" : ""}
          searchable
        />
        {countryTouched && countryError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">
            {countryError}
          </p>
        )}
      </div>

      {/* State/Province - Searchable Dropdown */}
      <div className="md:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          State / Province
        </label>
        <Select
          options={stateOptions}
          value={stateValue || ""}
          onChange={handleStateChange}
          placeholder="Select State"
          className={stateTouched && stateError ? "border-red-500" : ""}
          disabled={!countryValue}
          searchable
        />
        {stateTouched && stateError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">
            {stateError}
          </p>
        )}
      </div>

      {/* City - Searchable Dropdown */}
      <div className="md:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          City
        </label>
        <Select
          options={cityOptions}
          value={cityValue || ""}
          onChange={handleCityChange}
          placeholder="Select City"
          className={cityTouched && cityError ? "border-red-500" : ""}
          disabled={!stateValue}
          searchable
          allowCustom
        />
        {cityTouched && cityError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">{cityError}</p>
        )}
      </div>

      {/* Postal Code */}
      <div className="md:col-span-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Postal Code
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FaCity className="h-4 w-4" />
          </span>
          <Input
            name={getFieldName(zipKey)}
            value={zipValue || ""}
            onChange={(e) =>
              setFieldValue(getFieldName(zipKey), e.target.value)
            }
            onBlur={handleBlur}
            placeholder="Zip code"
            className={cn(
              "pl-11",
              zipTouched && zipError ? "border-red-500" : "",
            )}
          />
        </div>
        {zipTouched && zipError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">{zipError}</p>
        )}
      </div>
    </>
  );
};

export default AddressFields;
