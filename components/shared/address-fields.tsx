"use client";

import React from "react";
import { useFormikContext } from "formik";
import {
  useCountries,
  useStates,
  useCities,
} from "@/hooks/location/use-location";
import { Select } from "@/components/ui/select";
import {
  FaCity,
  FaMapLocationDot,
  FaGlobe,
  FaMapPin,
  FaRoad,
} from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

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

  const countryValue = prefix
    ? values[prefix]?.[countryKey]
    : values[countryKey];
  const stateValue = prefix ? values[prefix]?.[stateKey] : values[stateKey];
  const cityValue = prefix ? values[prefix]?.[cityKey] : values[cityKey];
  const zipValue = prefix ? values[prefix]?.[zipKey] : values[zipKey];
  const streetValue = prefix ? values[prefix]?.[streetKey] : values[streetKey];

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
  const streetError = getFieldError(streetKey);
  const streetTouched = getFieldTouched(streetKey);

  return (
    <>
      {/* Country */}
      <div>
        <Select
          label="Country"
          placeholder={isLoadingCountries ? "Loading..." : "Select Country"}
          options={countryOptions}
          value={countryValue}
          onChange={handleCountryChange}
          searchable={true}
          disabled={isLoadingCountries}
          className={countryTouched && countryError ? "border-red-500" : ""}
        />
        {countryTouched && countryError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">
            {countryError}
          </p>
        )}
      </div>

      {/* State */}
      <div>
        <Select
          label="State / Province"
          placeholder={
            !countryValue
              ? "Select Country First"
              : isLoadingStates
                ? "Loading..."
                : states.length === 0
                  ? "No States Available"
                  : "Select State"
          }
          options={stateOptions}
          value={stateValue}
          onChange={handleStateChange}
          searchable={true}
          disabled={!countryValue || isLoadingStates || states.length === 0}
          className={stateTouched && stateError ? "border-red-500" : ""}
        />
        {stateTouched && stateError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">
            {stateError}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <Select
          label="City"
          placeholder={
            !stateValue && states.length > 0
              ? "Select State First"
              : isLoadingCities
                ? "Loading..."
                : "Select City"
          }
          options={cityOptions}
          value={cityValue}
          onChange={handleCityChange}
          searchable={true}
          disabled={(!stateValue && states.length > 0) || isLoadingCities}
          className={cityTouched && cityError ? "border-red-500" : ""}
        />
        {cityTouched && cityError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">{cityError}</p>
        )}
      </div>

      {/* Zip Code */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Zip Code / Postal Code
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FaMapPin className="h-4 w-4" />
          </span>
          <Input
            name={getFieldName(zipKey)}
            value={zipValue || ""}
            onChange={(e) =>
              setFieldValue(getFieldName(zipKey), e.target.value)
            }
            onBlur={handleBlur}
            placeholder="00000"
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

      {/* Street Address */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Street Address
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FaRoad className="h-4 w-4" />
          </span>
          <Input
            name={getFieldName(streetKey)}
            value={streetValue || ""}
            onChange={(e) =>
              setFieldValue(getFieldName(streetKey), e.target.value)
            }
            onBlur={handleBlur}
            placeholder="Enter street lines"
            className={cn(
              "pl-11",
              streetTouched && streetError ? "border-red-500" : "",
            )}
          />
        </div>
        {streetTouched && streetError && (
          <p className="text-red-500 text-xs mt-1 font-semibold">
            {streetError}
          </p>
        )}
      </div>
    </>
  );
};

export default AddressFields;
