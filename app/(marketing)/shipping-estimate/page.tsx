"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Container from "@/components/shared/container";
import Button from "@/components/ui/button";
import {
  FaBoxOpen,
  FaTruckFast,
  FaCalculator,
  FaCircleExclamation,
} from "react-icons/fa6";

import ShippingHero from "@/components/shipping/shipping-hero";
import { shippingFormSchema, ShippingFormValues } from "./schema";
// import { resolveAddressFromString } from "@/utils/address-helper"; // Removed in favor of presets
import { useGetShippingEstimate } from "@/hooks/shipments/use-shipments";
import { useToast } from "@/hooks/use-toast";
import {
  POLAND_CITIES,
  SUPPORTED_COUNTRIES,
  SHIPPING_MODES,
} from "./constants";
import { Select } from "@/components/ui/select";
// Make sure to import types correctly
import { transformShippingData, getEstimatePayload } from "./utils";
import { getOrSetGuestId } from "@/utils/auth-helper";
import {
  ShippingEstimatePayload,
  ShippingEstimateResponse,
  Rate,
} from "@/types/shipping";

// Package Presets
const PACKAGE_PRESETS = [
  {
    id: "envelope",
    name: "Envelope",
    icon: "✉️",
    dims: { length: 35, width: 25, height: 2 },
    weight: 0.5,
  },
  {
    id: "book-box",
    name: "Book Box",
    icon: "📚",
    dims: { length: 30, width: 20, height: 15 },
    weight: 2,
  },
  {
    id: "laptop-box",
    name: "Laptop Box",
    icon: "💻",
    dims: { length: 45, width: 35, height: 10 },
    weight: 3,
  },
  {
    id: "luggage",
    name: "Luggage",
    icon: "🧳",
    dims: { length: 70, width: 50, height: 30 },
    weight: 20,
  },
  {
    id: "custom",
    name: "Custom",
    icon: "📦",
    dims: { length: 0, width: 0, height: 0 },
    weight: 0,
  },
];

export default function ShippingEstimatePage() {
  const [isLocating, setIsLocating] = useState(false);

  const { addToast } = useToast();

  // React Query Mutation
  const {
    mutate: estimateMutation,
    isPending: isEstimating,
    data: rawEstimateData,
  } = useGetShippingEstimate();

  const estimateData = rawEstimateData
    ? transformShippingData(rawEstimateData)
    : undefined;

  const formik = useFormik<ShippingFormValues>({
    initialValues: {
      shippingMode: "local",
      pickupLocation: "",
      dropoffLocation: "",
      selectedPreset: PACKAGE_PRESETS[0].id,
      package: {
        weight: PACKAGE_PRESETS[0].weight,
        dimensions: PACKAGE_PRESETS[0].dims,
      },
      isStackable: true,
    },
    validationSchema: toFormikValidationSchema(shippingFormSchema),
    onSubmit: async (values) => {
      try {
        // Construct Payload from Constants
        let pickupAddr, dropoffAddr;

        // Pickup Resolution
        if (values.shippingMode === "import") {
          const details = SUPPORTED_COUNTRIES.find(
            (c) => c.id === values.pickupLocation
          );
          pickupAddr = details
            ? {
                city: details.capital || "Unknown",
                countryCode: details.country,
                postalCode: details.zip || "00000",
                streetLines: [details.street || "Main St"],
                stateOrProvinceCode: details.state || "XX", // Use defined state or XX fallback
                residential: false,
                contact: {
                  personName: "Guest User",
                  companyName: "",
                  phoneNumber: "000000000",
                },
              }
            : null;
        } else {
          const details = POLAND_CITIES.find(
            (c) => c.id === values.pickupLocation
          );
          pickupAddr = details
            ? {
                city: details.name,
                countryCode: details.country,
                postalCode: details.zip,
                streetLines: [details.street],
                stateOrProvinceCode: details.state,
                residential: values.isStackable,
                contact: {
                  personName: "Guest User",
                  companyName: "",
                  phoneNumber: "000000000",
                },
              }
            : null;
        }

        // Dropoff Resolution
        if (values.shippingMode === "export") {
          const details = SUPPORTED_COUNTRIES.find(
            (c) => c.id === values.dropoffLocation
          );
          dropoffAddr = details
            ? {
                city: details.capital || "Unknown",
                countryCode: details.country,
                postalCode: details.zip || "00000",
                streetLines: [details.street || "Main St"],
                stateOrProvinceCode: details.state || "XX",
                residential: false,
                contact: {
                  personName: "Guest User",
                  companyName: "",
                  phoneNumber: "000000000",
                },
              }
            : null;
        } else {
          const details = POLAND_CITIES.find(
            (c) => c.id === values.dropoffLocation
          );
          dropoffAddr = details
            ? {
                city: details.name,
                countryCode: details.country,
                postalCode: details.zip,
                streetLines: [details.street],
                stateOrProvinceCode: details.state,
                residential: false,
                contact: {
                  personName: "Guest User",
                  companyName: "",
                  phoneNumber: "000000000",
                },
              }
            : null;
        }

        if (!pickupAddr || !dropoffAddr) {
          addToast({
            type: "error",
            title: "Invalid Selection",
            message: "Please select valid locations from the list.",
          });
          return;
        }

        // Add "Fetching Quote" Toast immediately on valid submit
        addToast({
          type: "info",
          title: "Fetching Quote",
          message: "Please wait while we retrieve your estimate...",
          duration: 3000,
        });

        // Determine Packaging Type & Logic
        // If Envelope is selected, we should generally NOT send custom dimensions as it overrides valid envelope defaults,
        // BUT user might have modified them.
        // FedEx often errors if you send 'FEDEX_ENVELOPE' with arbitrary dims that don't match standard envelope.
        // SAFE BET: If 'envelope', use 'FEDEX_ENVELOPE'. If custom/box, use 'YOUR_PACKAGING'.
        // const isEnvelope = values.selectedPreset === "envelope";
        // const packagingType = isEnvelope ? "FEDEX_ENVELOPE" : "YOUR_PACKAGING";

        const payload = getEstimatePayload(
          { ...pickupAddr, residential: values.isStackable },
          dropoffAddr,
          {
            weight: {
              value: parseFloat(Number(values.package.weight).toFixed(2)),
              units: "KG",
            },
            dimensions: {
              length: parseFloat(
                Number(values.package.dimensions.length).toFixed(1)
              ),
              width: parseFloat(
                Number(values.package.dimensions.width).toFixed(1)
              ),
              height: parseFloat(
                Number(values.package.dimensions.height).toFixed(1)
              ),
              units: "CM",
            },
          },
          getOrSetGuestId()
        );

        console.log(
          "Submitting Shipping Payload:",
          JSON.stringify(payload, null, 2)
        );

        estimateMutation(payload, {
          onSuccess: () => {
            addToast({
              type: "success",
              title: "Quote Received!",
              message:
                "Your shipping estimate has been calculated successfully.",
            });
          },
          onError: (error) => {
            // Check if error is specifically about packaging
            const isPackagingError =
              error.message?.includes("PACKAGECOMBINATION") ||
              JSON.stringify(error).includes("PACKAGECOMBINATION");
            addToast({
              type: "error",
              title: isPackagingError
                ? "Invalid Package Type"
                : "Estimation Failed",
              message: isPackagingError
                ? "This package type isn't available for the selected route. Try using 'Custom' or a different box."
                : error.message || "Something went wrong. Please try again.",
            });
          },
        });
      } catch (error) {
        console.error("Submission error:", error);
        addToast({
          type: "error",
          title: "Application Error",
          message: "An unexpected error occurred.",
        });
      }
    },
  });

  // Handle Preset Change
  const handlePresetChange = (presetId: string) => {
    const preset = PACKAGE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      formik.setFieldValue("selectedPreset", presetId);
      if (presetId !== "custom") {
        formik.setFieldValue("package.weight", preset.weight);
        formik.setFieldValue("package.dimensions", preset.dims);
      }
    }
  };

  // Reverse Geocoding Helper (Client Side for button)
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return `Current Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  };

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Fetch address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        formik.setFieldValue("pickupLocation", address);
        setIsLocating(false);
      },
      (error) => {
        // Use warn for expected errors like permission denial
        console.warn("Geolocation error:", error.message);
        let errorMessage =
          "Unable to retrieve your location. Please enter it manually.";

        // Handle specific error codes
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage =
              "Location access was denied. Please enable location permissions in your browser settings to use this feature, or enter your address manually.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage =
              "Location unavailable. Please check your device settings.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please try again.";
            break;
        }

        alert(errorMessage);
        setIsLocating(false);
      }
    );
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <ShippingHero />

      {/* Estimate Form Section */}
      <div className="bg-gray-50 py-20">
        <Container>
          {/* <div className="max-w-6xl mx-auto"> */}
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-brand-blue font-bold text-xs uppercase tracking-wider">
                Get a Quote
              </span>
            </div>
            <h1 className="font-work-sans font-black text-4xl md:text-5xl text-gray-900 mb-6">
              Estimate Your <span className="text-brand-blue">Shipping</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get an instant estimate for your shipment. Enter your details
              below to see our competitive rates and delivery times.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3 space-y-6">
              <form onSubmit={formik.handleSubmit}>
                {/* Location Details */}
                {/* Shipping Mode */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                  <h2 className="font-bold text-xl text-gray-900 mb-4">
                    Where are you shipping?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SHIPPING_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("shippingMode", mode.id);
                          // Reset locations when processing mode changes to avoid invalid states
                          formik.setFieldValue("pickupLocation", "");
                          formik.setFieldValue("dropoffLocation", "");
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                          formik.values.shippingMode === mode.id
                            ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                            : "border-gray-200 hover:border-brand-blue/50 text-gray-600"
                        }`}
                      >
                        <span className="text-2xl mb-2">{mode.icon}</span>
                        <span className="font-semibold">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-blue">
                      <FaTruckFast className="w-5 h-5" />
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">
                      Route Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pickup Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pickup Location
                      </label>
                      <Select
                        label=""
                        placeholder={
                          formik.values.shippingMode === "import"
                            ? "Select Country"
                            : "Select City"
                        }
                        options={
                          formik.values.shippingMode === "import"
                            ? SUPPORTED_COUNTRIES.map((c) => ({
                                label: c.name,
                                value: c.id,
                                icon:
                                  c.country === "UK"
                                    ? "🇬🇧"
                                    : c.country === "US"
                                    ? "🇺🇸"
                                    : c.country === "CN"
                                    ? "🇨🇳"
                                    : c.country === "NG"
                                    ? "🇳🇬"
                                    : "🇩🇪",
                              }))
                            : POLAND_CITIES.map((c) => ({
                                label: c.name,
                                value: c.id,
                                icon: "🏙️",
                              }))
                        }
                        value={formik.values.pickupLocation}
                        onChange={(val) =>
                          formik.setFieldValue("pickupLocation", val)
                        }
                      />
                      {formik.touched.pickupLocation &&
                        formik.errors.pickupLocation && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.pickupLocation}
                          </p>
                        )}
                    </div>

                    {/* Dropoff Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Drop-off Location
                      </label>
                      <Select
                        label=""
                        placeholder={
                          formik.values.shippingMode === "export"
                            ? "Select Country"
                            : "Select City"
                        }
                        options={
                          formik.values.shippingMode === "export"
                            ? SUPPORTED_COUNTRIES.map((c) => ({
                                label: c.name,
                                value: c.id,
                                icon:
                                  c.country === "UK"
                                    ? "🇬🇧"
                                    : c.country === "US"
                                    ? "🇺🇸"
                                    : c.country === "CN"
                                    ? "🇨🇳"
                                    : c.country === "NG"
                                    ? "🇳🇬"
                                    : "🇩🇪",
                              }))
                            : POLAND_CITIES.map((c) => ({
                                label: c.name,
                                value: c.id,
                                icon: "🏙️",
                              }))
                        }
                        value={formik.values.dropoffLocation}
                        onChange={(val) =>
                          formik.setFieldValue("dropoffLocation", val)
                        }
                      />
                      {formik.touched.dropoffLocation &&
                        formik.errors.dropoffLocation && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.dropoffLocation}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <FaBoxOpen className="w-5 h-5" />
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">
                      Package Details
                    </h2>
                  </div>

                  {/* Presets */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Package Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {PACKAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handlePresetChange(preset.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            formik.values.selectedPreset === preset.id
                              ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                              : "border-gray-200 hover:border-brand-blue/50 text-gray-600"
                          }`}
                        >
                          <span className="text-2xl mb-1">{preset.icon}</span>
                          <span className="text-xs font-medium">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions & Weight */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Dimensions (cm)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col">
                          <input
                            type="number"
                            name="package.dimensions.length"
                            value={formik.values.package.dimensions.length}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="L"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                          <span className="text-xs text-gray-500 text-center block mt-1">
                            Length
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <input
                            type="number"
                            name="package.dimensions.width"
                            value={formik.values.package.dimensions.width}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="W"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                          <span className="text-xs text-gray-500 text-center block mt-1">
                            Width
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <input
                            type="number"
                            name="package.dimensions.height"
                            value={formik.values.package.dimensions.height}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="H"
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none text-center h-11"
                            disabled={formik.values.selectedPreset !== "custom"}
                          />
                          <span className="text-xs text-gray-500 text-center block mt-1">
                            Height
                          </span>
                        </div>
                      </div>
                      {formik.errors.package?.dimensions && (
                        <p className="text-red-500 text-xs">
                          Invalid dimensions
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="package.weight"
                          value={formik.values.package.weight}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-brand-blue outline-none h-11"
                          disabled={formik.values.selectedPreset !== "custom"}
                        />
                        {formik.touched.package?.weight &&
                          formik.errors.package?.weight && (
                            <p className="text-red-500 text-xs mt-1">
                              {formik.errors.package.weight as string}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="stackable"
                        name="isStackable"
                        checked={formik.values.isStackable}
                        onChange={formik.handleChange}
                        className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                      />
                      <label
                        htmlFor="stackable"
                        className="text-sm text-gray-600 select-none"
                      >
                        This item is stackable
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full py-4 text-lg font-bold shadow-lg shadow-brand-blue/20 mt-6"
                  disabled={formik.isSubmitting || isEstimating}
                  type="submit"
                >
                  {formik.isSubmitting || isEstimating ? (
                    <span className="flex items-center gap-2">
                      <FaCalculator className="animate-pulse" /> Calculating...
                    </span>
                  ) : (
                    "Get My Quote"
                  )}
                </Button>
              </form>
            </div>

            {/* Summary / Result Section */}
            <div className="lg:col-span-2">
              <div className="bg-brand-blue text-white rounded-3xl p-6 md:p-8 sticky top-32">
                <h3 className="font-bold text-xl mb-6">Quote Summary</h3>

                {!estimateData && !isEstimating ? (
                  <div className="text-center py-8 text-white/60">
                    <FaCircleExclamation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Fill out the form to see your estimated shipping cost.
                    </p>
                  </div>
                ) : isEstimating ? (
                  // Skeleton Loader
                  <div className="space-y-6 animate-pulse">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white/10 rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <div className="h-6 w-32 bg-white/20 rounded"></div>
                            <div className="h-4 w-24 bg-white/10 rounded"></div>
                          </div>
                          <div className="h-8 w-20 bg-white/20 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-white/10 rounded"></div>
                          <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Rates List */}
                    {estimateData?.rates?.map((rate: Rate, index: number) => (
                      <div
                        key={`${rate.serviceType}-${index}`}
                        className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
                      >
                        <div className="mb-4">
                          <h4 className="font-bold text-lg text-white">
                            {rate.serviceName}
                          </h4>
                          {rate.deliveryDescription && (
                            <p className="text-sm text-brand-yellow font-medium mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow inline-block"></span>
                              {rate.deliveryDescription}
                            </p>
                          )}
                        </div>

                        {/* Service Details */}
                        <div className="space-y-2 border-t border-white/10 pt-3 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Price</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-brand-yellow">
                                {rate.actualPrice?.toFixed(2)}
                              </span>
                              <span className="text-xs text-white/60 font-medium">
                                {rate.currency}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full bg-white text-brand-blue hover:bg-brand-yellow hover:text-brand-blue border-none font-bold py-2.5 h-auto"
                          onClick={() => {
                            addToast({
                              type: "info",
                              title: "Coming Soon",
                              message: "Booking integration is coming soon.",
                            });
                          }}
                        >
                          Book {rate.serviceName}
                        </Button>
                      </div>
                    ))}
                    <p className="text-xs text-center text-white/40 mt-4 px-4 sticky bottom-0 bg-brand-blue py-2">
                      *Final price may vary based on exact weight and
                      dimensions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </Container>
      </div>
    </main>
  );
}
