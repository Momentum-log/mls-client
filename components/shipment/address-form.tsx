"use client";

import React, { useMemo } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import Button from "@/components/ui/button";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Address } from "@/store/shipment-store";
import countriesData from "@/lib/countries.iso.json";
import { State, City } from "country-state-city";

/**
 * Normalizes country names for legacy city lookup compatibility.
 */
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

/**
 * Base Validation Schema using Zod.
 */
const createAddressSchema = (isStateRequired: boolean) =>
  z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    street: z
      .string()
      .min(1, "Street address is required")
      .max(35, "Street address cannot exceed 35 characters"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    stateOrProvinceCode: isStateRequired
      ? z.string().min(1, "State/Province is required")
      : z.string().optional(),
    phone: z.string().min(1, "Phone number is required"),
  });

interface AddressFormProps {
  initialValues: Address | null;
  onSubmit: (values: Address) => void;
  onBack?: () => void;
  type: "pickup" | "dropoff";
}

/**
 * Enhanced AddressForm with high-contrast UI and modular design.
 * Used for both Pick-up (Origin) and Drop-off (Destination) details.
 */
export default function AddressForm({
  initialValues,
  onSubmit,
  onBack,
  type,
}: AddressFormProps) {
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
      country: "PL",
      phone: "",
    },
    enableReinitialize: true,
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
      onSubmit(values as Address);
    },
  });

  const availableStates = useMemo(() => {
    return State.getStatesOfCountry(formik.values.country);
  }, [formik.values.country]);

  const availableCities = useMemo(() => {
    if (formik.values.stateOrProvinceCode) {
      const cities = City.getCitiesOfState(
        formik.values.country,
        formik.values.stateOrProvinceCode
      );
      if (cities.length > 0) return cities.map((c) => c.name).sort();
    }
    return [];
  }, [formik.values.country, formik.values.stateOrProvinceCode]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("country", e.target.value);
    formik.setFieldValue("stateOrProvinceCode", "");
    formik.setFieldValue("city", "");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formik.setFieldValue("stateOrProvinceCode", e.target.value);
    formik.setFieldValue("city", "");
  };

  const title = type === "pickup" ? "Pick-up Details" : "Drop-off Details";
  const subtitle =
    type === "pickup"
      ? "Where should we collect the package?"
      : "Where is the package going?";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Contact Info Group */}
        <div className="col-span-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
              Contact Person
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            {...formik.getFieldProps("name")}
            className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-bold ${
              formik.touched.name && formik.errors.name
                ? "border-red-500 focus:ring-4 focus:ring-red-500/5 shadow-sm shadow-red-500/10"
                : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
            }`}
            placeholder="e.g. John Doe"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-[11px] text-red-500 font-bold ml-1">
              {formik.errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Company (Optional)
          </label>
          <input
            type="text"
            {...formik.getFieldProps("company")}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all font-medium"
            placeholder="Company Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...formik.getFieldProps("phone")}
            className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-medium ${
              formik.touched.phone && formik.errors.phone
                ? "border-red-500 ring-2 ring-red-500/10"
                : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
            }`}
            placeholder="+1 234 567 890"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-[11px] text-red-500 font-bold ml-1">
              {formik.errors.phone}
            </p>
          )}
        </div>

        {/* Address Group */}
        <div className="col-span-full mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
              Physical Address
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Country
          </label>
          <select
            name="country"
            onChange={handleCountryChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
            className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all font-medium"
          >
            {countriesData.map((country) => (
              <option key={country["alpha-2"]} value={country["alpha-2"]}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            State / Province
          </label>
          {availableStates.length > 0 ? (
            <select
              name="stateOrProvinceCode"
              onChange={handleStateChange}
              onBlur={formik.handleBlur}
              value={formik.values.stateOrProvinceCode}
              className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-medium ${
                formik.touched.stateOrProvinceCode &&
                formik.errors.stateOrProvinceCode
                  ? "border-red-500 ring-2 ring-red-500/10"
                  : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
              }`}
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
              {...formik.getFieldProps("stateOrProvinceCode")}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all font-medium"
              placeholder="State name"
            />
          )}
          {formik.touched.stateOrProvinceCode &&
            formik.errors.stateOrProvinceCode && (
              <p className="text-[11px] text-red-500 font-bold ml-1">
                {formik.errors.stateOrProvinceCode}
              </p>
            )}
        </div>

        <div className="col-span-full space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Street Address
          </label>
          <input
            type="text"
            {...formik.getFieldProps("street")}
            className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-bold ${
              formik.touched.street && formik.errors.street
                ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
            }`}
            placeholder="e.g. Marszałkowska 1"
          />
          {formik.touched.street && formik.errors.street && (
            <p className="text-[11px] text-red-500 font-bold ml-1">
              {formik.errors.street}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            City
          </label>
          {availableCities.length > 0 ? (
            <select
              {...formik.getFieldProps("city")}
              className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-medium ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500 ring-2 ring-red-500/10"
                  : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
              }`}
            >
              <option value="">Select City</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              {...formik.getFieldProps("city")}
              className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-bold ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                  : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
              }`}
              placeholder="e.g. Warsaw"
            />
          )}
          {formik.touched.city && formik.errors.city && (
            <p className="text-[11px] text-red-500 font-bold ml-1">
              {formik.errors.city}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-tight text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            {...formik.getFieldProps("postalCode")}
            className={`w-full px-5 py-4 rounded-2xl border bg-white outline-none transition-all font-bold ${
              formik.touched.postalCode && formik.errors.postalCode
                ? "border-red-500 focus:ring-4 focus:ring-red-500/5"
                : "border-gray-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5"
            }`}
            placeholder="00-001"
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <p className="text-[11px] text-red-500 font-bold ml-1">
              {formik.errors.postalCode}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-gray-500 font-bold"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="min-w-[180px] shadow-xl shadow-brand-blue/20"
        >
          Continue <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </form>
  );
}
