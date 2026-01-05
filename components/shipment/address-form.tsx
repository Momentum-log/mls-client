"use client";

import React, { useMemo, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Button from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Address } from "@/store/shipment-store";
import countriesData from "@/lib/countries.iso.json";
// Import full countries data
import citiesDataRaw from "@/lib/countries.json";
import { State, City } from "country-state-city";

// Type assertion for the JSON data structure
const citiesData = citiesDataRaw as Record<string, string[]>;

// Helper to map ISO country names to our JSON keys
const normalizeCountryName = (isoName: string): string => {
  const mappings: Record<string, string> = {
    "United States of America": "United States",
    "Korea, Republic of": "Republic of Korea",
    "Viet Nam": "Vietnam",
    "Venezuela, Bolivarian Republic of": "Venezuela",
    "Bolivia, Plurinational State of": "Bolivia",
    "Russian Federation": "Russia",
    "Iran, Islamic Republic of": "Iran",
    "Tanzania, United Republic of": "Tanzania",
    "Moldova, Republic of": "Moldova",
    "Syrian Arab Republic": "Syria",
    "Lao People's Democratic Republic": "Laos",
    "Micronesia, Federated States of": "Micronesia",
  };

  return mappings[isoName] || isoName;
};

// Base Schema
const createAddressSchema = (isStateRequired: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    // Dynamic validation for state
    stateOrProvinceCode: isStateRequired
      ? z.string().min(1, "State/Province is required")
      : z.string().optional(),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
  });

interface AddressFormProps {
  initialValues: Address | null;
  onSubmit: (values: Address) => void;
  onBack?: () => void;
  title?: string;
}

export default function AddressForm({
  initialValues,
  onSubmit,
  onBack,
}: AddressFormProps) {
  // We need to manage validation schema dynamically based on chosen country
  // But Formik needs a static schema or re-render.
  // We can validate state manually or stick to Zod schema updates.

  // To check if country has states
  const hasStates = (countryCode: string) => {
    const states = State.getStatesOfCountry(countryCode);
    return states && states.length > 0;
  };

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      company: "",
      street: "",
      city: "",
      stateOrProvinceCode: "",
      postalCode: "",
      country: "PL", // Default to Poland
      phone: "",
      email: "",
    },
    enableReinitialize: true,
    // We update schema dynamically or accept loose schema and refine?
    // Let's rely on validationSchema being re-evaluated since 'enableReinitialize' is true,
    // but validationSchema needs to be memoized or passed correctly.
    // Simpler approach: Create a robust schema that checks context? Zod+Formik adapter makes this tricky.
    // Instead, we will construct the schema during render.
    validate: (values) => {
      const countryCode = values.country;
      const required = hasStates(countryCode);
      const schema = createAddressSchema(required);
      try {
        schema.parse(values);
        return {};
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors as Record<
            string,
            string[] | undefined
          >;
          // Formik expects string values for errors, but Zod returns string[]
          const formikErrors: Record<string, string> = {};
          Object.keys(fieldErrors).forEach((key) => {
            const messages = fieldErrors[key];
            if (messages && messages.length > 0) {
              formikErrors[key] = messages[0];
            }
          });
          return formikErrors;
        }
        return {};
      }
    },
    onSubmit: (values) => {
      // Ensure state code is sent (not name) - Dropdown values should be codes
      onSubmit(values as Address);
    },
  });

  // Get current country name to look up cities (Legacy logic kept for cities)
  const selectedCountryName = useMemo(() => {
    const country = countriesData.find(
      (c) => c["alpha-2"] === formik.values.country
    );
    return country ? country.name : "";
  }, [formik.values.country]);

  // Get states for strict dropdown
  const availableStates = useMemo(() => {
    return State.getStatesOfCountry(formik.values.country);
  }, [formik.values.country]);

  // Get cities for the selected country (Legacy + State aware?)
  const availableCities = useMemo(() => {
    if (!selectedCountryName) return [];

    // If state is selected, maybe filter cities by state using `City.getCitiesOfState`?
    // That would be better than the raw JSON file.
    if (formik.values.stateOrProvinceCode) {
      const citiesStart = City.getCitiesOfState(
        formik.values.country,
        formik.values.stateOrProvinceCode
      );
      if (citiesStart.length > 0) {
        return citiesStart.map((c) => c.name).sort();
      }
    }

    // Fallback to existing JSON logic if no state selected or no cities found in library
    const normalizedName = normalizeCountryName(selectedCountryName);
    const citiesRaw = citiesData[normalizedName] || [];
    return Array.from(new Set(citiesRaw)).sort();
  }, [
    selectedCountryName,
    formik.values.country,
    formik.values.stateOrProvinceCode,
  ]);

  // Reset city and state when country changes
  useEffect(() => {
    // Only reset if the user changed it manually (interaction)
    // But this effect runs on mount too. 'enableReinitialize' handles initialValues.
    // We should be careful not to wipe initialValues on first render.
    // For now, let's trust formik handles initialValues, and we only react to changes *after* mount?
    // Actually, simple check: if values match initialValues, don't wipe.
  }, [formik.values.country]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("country", e.target.value);
    formik.setFieldValue("stateOrProvinceCode", "");
    formik.setFieldValue("city", "");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("stateOrProvinceCode", e.target.value);
    formik.setFieldValue("city", "");
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="col-span-full">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-3">
            Contact Details
          </h3>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. John Doe"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Company (Optional)
          </label>
          <input
            type="text"
            name="company"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.company}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. Momentum Inc."
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. john@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. +48 123 456 789"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.phone}
            </div>
          )}
        </div>

        {/* Address Info */}
        <div className="col-span-full mt-4">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-3">
            Address
          </h3>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            onChange={handleCountryChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white"
          >
            <option value="" disabled>
              Select Country
            </option>
            {countriesData.map((country) => (
              <option key={country["alpha-2"]} value={country["alpha-2"]}>
                {country.name}
              </option>
            ))}
          </select>
          {formik.touched.country && formik.errors.country && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.country}
            </div>
          )}
        </div>

        {/* State/Province Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            State / Province
          </label>
          {availableStates.length > 0 ? (
            <select
              name="stateOrProvinceCode"
              onChange={handleStateChange}
              onBlur={formik.handleBlur}
              value={formik.values.stateOrProvinceCode || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white"
            >
              <option value="">Select State</option>
              {availableStates.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="stateOrProvinceCode"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stateOrProvinceCode || ""}
              placeholder="Optional"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              // Disable validation appearance if optional? No, formik handles it.
            />
          )}

          {formik.touched.stateOrProvinceCode &&
            formik.errors.stateOrProvinceCode && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.stateOrProvinceCode}
              </div>
            )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.street}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. ul. Piotrkowska 10"
          />
          {formik.touched.street && formik.errors.street && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.street}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.postalCode}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            placeholder="e.g. 90-001"
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.postalCode}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">City</label>
          <select
            name="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400"
            disabled={!availableCities.length}
          >
            <option value="" disabled>
              {availableCities.length ? "Select City" : "City"}
            </option>
            {availableCities.map((city: string, index: number) => (
              <option key={`${city}-${index}`} value={city}>
                {city}
              </option>
            ))}
          </select>
          {formik.touched.city && formik.errors.city && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.city}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="min-w-[150px] ml-auto"
        >
          Next Step <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </form>
  );
}
